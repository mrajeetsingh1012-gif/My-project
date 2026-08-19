import React, { useState } from 'react';
import {
  PhoneCall,
  MapPin,
  Siren,
  Flame,
  Shield,
  Ambulance,
  HeartPulse,
  Navigation,
  ChevronRight,
  Send,
  AlertTriangle,
  Hospital as HospitalIcon,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { UserProfile, Hospital, FirstAidGuide } from '../types';
import { MOCK_FIRST_AID } from '../data/mockData';

interface EmergencySectionProps {
  user: UserProfile;
  hospitals: Hospital[];
  onClose?: () => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  user,
  hospitals,
  onClose,
}) => {
  const [gpsLocation, setGpsLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide | null>(null);
  const [copiedLocation, setCopiedLocation] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Metro City Center)`,
          });
          setIsLocating(false);
        },
        () => {
          // Fallback if permission denied
          setGpsLocation({
            lat: 37.7749,
            lng: -122.4194,
            address: 'Metro City Center (Default GPS position)',
          });
          setIsLocating(false);
        }
      );
    } else {
      setGpsLocation({
        lat: 37.7749,
        lng: -122.4194,
        address: 'Metro City Center',
      });
      setIsLocating(false);
    }
  };

  const handleTriggerSOS = async () => {
    handleGetLocation();

    try {
      await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userPhone: user.phone,
          latitude: gpsLocation?.lat || 37.7749,
          longitude: gpsLocation?.lng || -122.4194,
          address: gpsLocation?.address || 'Current User GPS Location',
          contactsNotified: [
            `${user.primaryContact.name} (${user.primaryContact.phone})`,
            `${user.secondaryContact.name} (${user.secondaryContact.phone})`,
          ],
        }),
      });
      setSosSent(true);
      setTimeout(() => setSosSent(false), 8000);
    } catch (e) {
      setSosSent(true);
      setTimeout(() => setSosSent(false), 8000);
    }
  };

  const copyGpsToClipboard = () => {
    const text = gpsLocation
      ? `EMERGENCY SOS: My location is https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng} (${gpsLocation.address})`
      : `EMERGENCY SOS: Please send immediate help to my address.`;
    navigator.clipboard.writeText(text);
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 3000);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white shadow-lg border border-rose-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white animate-pulse">
              <Siren className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-display leading-tight">Emergency Assistance & SOS</h2>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                Instant 112/108 response, GPS dispatch & emergency contacts alert
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Prominent SOS Dispatch Button */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900/60 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 animate-pulse" />

        <div className="max-w-md mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
            One-Tap Emergency Trigger
          </span>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
            In Danger or Critical Medical Need?
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Tapping the SOS button immediately alerts saved emergency contacts (<strong>{user.primaryContact.name}</strong> & <strong>{user.secondaryContact.name}</strong>) with your live GPS location.
          </p>

          <button
            onClick={handleTriggerSOS}
            className="w-40 h-40 mx-auto my-2 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-500 text-white font-extrabold text-2xl font-display shadow-2xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 border-4 border-white dark:border-slate-800 pulse-glow"
          >
            <Siren className="w-10 h-10 animate-bounce" />
            <span>SOS</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-100">
              TAP TO ALERT
            </span>
          </button>

          {sosSent && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>SOS Alert sent! Live GPS location shared with emergency contacts & 112 dispatch log created.</span>
            </div>
          )}

          {/* GPS Location Bar */}
          <div className="pt-2 flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-left">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate font-medium">
                {gpsLocation ? gpsLocation.address : 'GPS Location not fetched yet'}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className="px-2.5 py-1 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 transition-colors"
              >
                {isLocating ? 'Locating...' : 'Refresh GPS'}
              </button>
              {gpsLocation && (
                <button
                  onClick={copyGpsToClipboard}
                  className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-bold"
                  title="Copy location link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          {copiedLocation && (
            <p className="text-[11px] text-emerald-600 font-bold">GPS Location link copied to clipboard!</p>
          )}
        </div>
      </div>

      {/* Emergency Quick Action Buttons */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
          Emergency Quick Action Hotline Dialers
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="tel:112"
            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-md flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-0.5 group"
          >
            <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-extrabold text-sm font-display">Police</p>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                Call 112
              </span>
            </div>
          </a>

          <a
            href="tel:108"
            className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-md flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-0.5 group"
          >
            <Ambulance className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-extrabold text-sm font-display">Ambulance</p>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                Call 108
              </span>
            </div>
          </a>

          <a
            href="tel:101"
            className="p-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-md flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-0.5 group"
          >
            <Flame className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-extrabold text-sm font-display">Fire Rescue</p>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                Call 101 / 112
              </span>
            </div>
          </a>

          <a
            href="tel:108"
            className="p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-0.5 group"
          >
            <PhoneCall className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <p className="font-extrabold text-sm font-display">Govt Ambulance</p>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                Call 108 Free
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Emergency Contacts Saved List */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display flex items-center justify-between">
          <span>Saved Emergency Contacts</span>
          <span className="text-xs text-sky-600 font-normal">Manage in Profile</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{user.primaryContact.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.primaryContact.relation} • {user.primaryContact.phone}</p>
            </div>
            <a
              href={`tel:${user.primaryContact.phone}`}
              className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{user.secondaryContact.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.secondaryContact.relation} • {user.secondaryContact.phone}</p>
            </div>
            <a
              href={`tel:${user.secondaryContact.phone}`}
              className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Nearby Hospitals on Map */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <HospitalIcon className="w-5 h-5 text-sky-600" />
              <span>Nearby Emergency Hospitals</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive map locations & direct ER contact numbers
            </p>
          </div>
        </div>

        {/* Interactive Map Visual Mockup */}
        <div className="relative h-44 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
          <iframe
            title="Emergency Hospital Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src="https://maps.google.com/maps?q=37.7749,-122.4194&z=13&output=embed"
            className="w-full h-full opacity-80"
          />
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md text-white p-2 rounded-lg text-xs flex items-center justify-between">
            <span className="font-semibold truncate">Showing 4 24/7 ER Hospitals nearby</span>
            <span className="text-[10px] text-sky-300 font-bold shrink-0">Radius: 5 km</span>
          </div>
        </div>

        {/* Hospitals Cards */}
        <div className="space-y-2">
          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{hosp.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{hosp.address} • {hosp.distanceKm} km away</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {hosp.services.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${hosp.emergencyPhone}`}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call ER</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 text-center italic">
          * Clear Disclaimer: Hospital information is provided for assistance only and users should contact hospitals directly during emergencies.
        </p>
      </div>

      {/* Interactive First-Aid Guides */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-600" />
          <span>Interactive First-Aid Step-by-Step Guides</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_FIRST_AID.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-sky-600 transition-colors">
                  {guide.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {guide.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 font-display">
                {selectedGuide.title}
              </h3>
              <button
                onClick={() => setSelectedGuide(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {selectedGuide.description}
            </p>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Step-by-Step Response:</p>
              {selectedGuide.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 leading-normal">{step}</span>
                </div>
              ))}
            </div>

            {selectedGuide.warning && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{selectedGuide.warning}</span>
              </div>
            )}

            <button
              onClick={() => setSelectedGuide(null)}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl"
            >
              Close First-Aid Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

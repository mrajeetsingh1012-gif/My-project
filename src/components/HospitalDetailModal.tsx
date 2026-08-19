import React from 'react';
import {
  X,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Hospital as HospitalIcon,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { Hospital } from '../types';

interface HospitalDetailModalProps {
  hospital: Hospital | null;
  onClose: () => void;
}

export const HospitalDetailModal: React.FC<HospitalDetailModalProps> = ({
  hospital,
  onClose,
}) => {
  if (!hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hospital Photo & Title */}
        <div className="space-y-3">
          <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img
              src={hospital.photo}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <h3 className="text-xl font-bold text-white font-display">
                {hospital.name}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}</span>
          </p>
        </div>

        {/* Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">General Desk</span>
            <a
              href={`tel:${hospital.phone}`}
              className="font-bold text-sm text-sky-600 dark:text-sky-400 flex items-center gap-1 mt-0.5"
            >
              <PhoneCall className="w-4 h-4" /> {hospital.phone}
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
            <span className="text-[10px] uppercase font-bold text-rose-500 block">24/7 Casualty ER</span>
            <a
              href={`tel:${hospital.emergencyPhone}`}
              className="font-bold text-sm text-rose-700 dark:text-rose-300 flex items-center gap-1 mt-0.5"
            >
              <ShieldAlert className="w-4 h-4" /> {hospital.emergencyPhone}
            </a>
          </div>
        </div>

        {/* Services Offered */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Key Medical Services & Facilities
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {hospital.services.map((service, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Location View */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-sky-600" /> Map Location View
          </h4>
          <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <iframe
              title={`${hospital.name} Map`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://maps.google.com/maps?q=${hospital.latitude},${hospital.longitude}&z=14&output=embed`}
              className="w-full h-full"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-100 font-bold text-sm rounded-xl"
        >
          Close Hospital Details
        </button>
      </div>
    </div>
  );
};

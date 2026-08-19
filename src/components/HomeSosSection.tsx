import React from 'react';
import {
  ShieldAlert,
  Flame,
  Ambulance,
  MapPin,
  Wifi,
  PhoneCall
} from 'lucide-react';

interface HomeSosSectionProps {
  onTriggerSOS?: () => void;
  onCallNumber?: (num: string) => void;
}

export const HomeSosSection: React.FC<HomeSosSectionProps> = ({
  onTriggerSOS,
  onCallNumber,
}) => {
  const handleDial = (number: string, label: string) => {
    if (onCallNumber) {
      onCallNumber(number);
    } else {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <div className="space-y-4 my-2">
      {/* SOS Wheel & Surrounding Dial Contacts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs relative flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center my-2">
          
          {/* 1. TOP-LEFT: 112 POLICE */}
          <button
            onClick={() => handleDial('112', '112 Police')}
            className="absolute top-2 left-2 flex flex-col items-center gap-1 group hover:scale-105 transition-transform"
          >
            <div className="w-13 h-13 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">112 Police</span>
          </button>

          {/* 2. TOP-RIGHT: 101 FIRE */}
          <button
            onClick={() => handleDial('101', '101 Fire')}
            className="absolute top-2 right-2 flex flex-col items-center gap-1 group hover:scale-105 transition-transform"
          >
            <div className="w-13 h-13 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">101 Fire</span>
          </button>

          {/* 3. CENTER: SOS BUTTON WITH RIPPLE RINGS */}
          <div className="relative flex items-center justify-center">
            {/* Soft Ripple Background Ring */}
            <div className="absolute w-48 h-48 rounded-full bg-rose-100 dark:bg-rose-950/40 animate-ping opacity-30" />
            <div className="absolute w-44 h-44 rounded-full bg-rose-50 dark:bg-rose-950/60" />

            <button
              onClick={onTriggerSOS}
              className="relative w-36 h-36 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center gap-1 shadow-xl shadow-rose-600/30 active:scale-95 transition-transform border-4 border-white dark:border-slate-900 z-10"
            >
              <Wifi className="w-6 h-6 text-rose-200 rotate-90" />
              <span className="text-3xl font-black tracking-widest leading-none font-display">SOS</span>
              <span className="text-[9px] font-bold text-rose-100 uppercase tracking-tight mt-0.5">
                Tap for Emergency Help
              </span>
            </button>
          </div>

          {/* 4. BOTTOM-LEFT: 108 AMBULANCE */}
          <button
            onClick={() => handleDial('108', '108 Ambulance')}
            className="absolute bottom-2 left-2 flex flex-col items-center gap-1 group hover:scale-105 transition-transform"
          >
            <div className="w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Ambulance className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">108 Ambulance</span>
          </button>

          {/* 5. BOTTOM-RIGHT: 102 GOVT AMBULANCE */}
          <button
            onClick={() => handleDial('102', '102 Govt. Ambulance')}
            className="absolute bottom-2 right-2 flex flex-col items-center gap-1 group hover:scale-105 transition-transform"
          >
            <div className="w-13 h-13 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Ambulance className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">102 Govt. Ambulance</span>
          </button>

        </div>
      </div>

      {/* Location sharing info banner matching bottom of Image 2 */}
      <div className="bg-sky-50/80 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/60 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
          Your location will be shared with emergency services when you press SOS.
        </p>
      </div>
    </div>
  );
};

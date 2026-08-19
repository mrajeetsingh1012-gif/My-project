import React from 'react';
import { HeartPulse } from 'lucide-react';

interface EmergencyAlertsCardProps {
  emergencyAlerts?: any[];
  chronicAlerts?: any[];
  onOpenEmergency?: () => void;
  onOpenChronic?: () => void;
}

export const EmergencyAlertsCard: React.FC<EmergencyAlertsCardProps> = ({
  onOpenEmergency,
  onOpenChronic,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* 1. Left Emergency Card */}
      <button
        onClick={() => typeof onOpenEmergency === 'function' && onOpenEmergency()}
        className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs hover:bg-rose-100/80 dark:hover:bg-rose-900/60 transition-all text-left"
      >
        <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-xs">
          SOS
        </div>
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
            Emergency
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Need immediate help?
          </p>
        </div>
      </button>

      {/* 2. Right Chronic Alerts Card */}
      <button
        onClick={() => typeof onOpenChronic === 'function' && onOpenChronic()}
        className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs hover:bg-amber-100/80 dark:hover:bg-amber-900/60 transition-all text-left"
      >
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
            Chronic Alerts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Stay on track
          </p>
        </div>
      </button>
    </div>
  );
};



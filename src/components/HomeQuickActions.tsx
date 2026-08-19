import React from 'react';
import { Search, Calendar, FileText, PhoneCall } from 'lucide-react';

interface HomeQuickActionsProps {
  onOpenDirectory: () => void;
  onOpenAppointments: () => void;
  onOpenRecords: () => void;
  onOpenEmergency: () => void;
}

export const HomeQuickActions: React.FC<HomeQuickActionsProps> = ({
  onOpenDirectory,
  onOpenAppointments,
  onOpenRecords,
  onOpenEmergency,
}) => {
  const actions = [
    {
      id: 'directory',
      label: 'Find Doctor',
      subLabel: 'Search & Hospital',
      icon: Search,
      bg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      action: onOpenDirectory,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      subLabel: 'Request In-Person',
      icon: Calendar,
      bg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      action: onOpenAppointments,
    },
    {
      id: 'records',
      label: 'Record Vault',
      subLabel: 'Lab & Prescription',
      icon: FileText,
      bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      action: onOpenRecords,
    },
    {
      id: 'emergency',
      label: 'Emergency SOS',
      subLabel: '112/108 & Contacts',
      icon: PhoneCall,
      bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      action: onOpenEmergency,
    },
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display">
        Quick Action Shortcuts
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => typeof act.action === 'function' && act.action()}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] active:scale-95 shadow-xs ${act.bg}`}
            >
              <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 w-fit shadow-xs mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm font-display leading-tight">{act.label}</p>
                <p className="text-[11px] opacity-80 mt-0.5">{act.subLabel}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

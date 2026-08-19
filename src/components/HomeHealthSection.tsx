import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Lightbulb,
  ShieldAlert,
  ChevronRight,
  Clock,
  Download,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AppointmentRequest, MedicalRecord } from '../types';

interface HomeHealthSectionProps {
  appointments: AppointmentRequest[];
  records: MedicalRecord[];
  onOpenAppointments: () => void;
  onOpenRecords: () => void;
  onOpenDirectory: () => void;
  onSelectPrescription: (app: AppointmentRequest) => void;
}

export const HomeHealthSection: React.FC<HomeHealthSectionProps> = ({
  appointments,
  records,
  onOpenAppointments,
  onOpenRecords,
  onOpenDirectory,
  onSelectPrescription,
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  const healthTips = [
    {
      title: 'Hydration & Electrolyte Balance',
      category: 'Daily Wellness',
      content: 'Aim for 2.5–3 liters of water daily. Adding a pinch of mineral salt or lemon juice helps maintain electrolyte balance, especially during humid weather.',
    },
    {
      title: '30-Minute Brisk Walking Routine',
      category: 'Heart Care',
      content: 'Brisk walking for 30 minutes 5 days a week can reduce cardiovascular risks by up to 30% and help regulate resting systolic blood pressure.',
    },
    {
      title: 'Digital Eye Strain & 20-20-20 Rule',
      category: 'Eye Health',
      content: 'Every 20 minutes spent looking at screens, look at an object 20 feet away for 20 seconds to prevent eye fatigue and dry eyes.',
    },
  ];

  const upcomingApps = appointments
    .filter((a) => a.status === 'pending' || a.status === 'confirmed')
    .slice(0, 2);

  const recentRecords = records.slice(0, 2);

  const currentTip = healthTips[tipIndex];

  return (
    <div className="space-y-5">
      {/* 1. Upcoming Appointment Requests */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>Upcoming Appointment Requests</span>
          </h3>
          <button
            onClick={() => typeof onOpenAppointments === 'function' && onOpenAppointments()}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {upcomingApps.length > 0 ? (
          <div className="space-y-2">
            {upcomingApps.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {app.doctorName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        app.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {app.specialty} • {app.hospitalName}
                  </p>
                  <p className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Date: {app.date} at {app.timeSlot}
                  </p>
                </div>

                {app.prescriptionSummary && (
                  <button
                    onClick={() => typeof onSelectPrescription === 'function' && onSelectPrescription(app)}
                    className="px-3 py-1.5 bg-sky-600 text-white hover:bg-sky-700 rounded-lg text-xs font-bold shrink-0 shadow-xs"
                  >
                    View Summary
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No upcoming in-person appointment requests scheduled.
            </p>
            <button
              onClick={() => typeof onOpenDirectory === 'function' && onOpenDirectory()}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Search Doctors & Schedule
            </button>
          </div>
        )}
      </div>

      {/* 2. Recent Medical Records */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Recent Medical Records</span>
          </h3>
          <button
            onClick={() => typeof onOpenRecords === 'function' && onOpenRecords()}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            <span>Open Vault</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {recentRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{rec.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {rec.category} • {rec.recordDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => typeof onOpenRecords === 'function' && onOpenRecords()}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                  title="View Record"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Daily Health Tip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800/60 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Daily Verified Health Tip
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display">
                {currentTip.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => setTipIndex((prev) => (prev + 1) % healthTips.length)}
            className="p-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-300"
            title="Next Tip"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
          {currentTip.content}
        </p>
      </div>

      {/* 4. Seasonal Health Awareness Information */}
      <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0" />
          <h4 className="font-bold text-sm text-sky-950 dark:text-sky-200 font-display">
            Monsoon & Humidity Seasonal Health Awareness
          </h4>
        </div>
        <p className="text-xs text-sky-900 dark:text-sky-300 leading-relaxed">
          Monsoon season increases vector-borne risks like Dengue and Malaria. Ensure standing water around residence is cleared, use protective repellent, and drink boiled water.
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import {
  X,
  Star,
  Hospital,
  Clock,
  Globe,
  Award,
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onRequestAppointment: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onRequestAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Doctor Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-800 shadow-md shrink-0"
          />

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                {doctor.name}
              </h3>
              <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {doctor.rating}
              </span>
            </div>

            <p className="text-sm font-bold text-sky-600 dark:text-sky-400">
              {doctor.specialty}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {doctor.qualification}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Experience</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" /> {doctor.experienceYears} Years
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Consultation Fee</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-0.5 mt-0.5">
              ${doctor.fee} (In-Person)
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Languages</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-sky-600" /> {doctor.languages.join(', ')}
            </span>
          </div>
        </div>

        {/* Hospital Affiliation */}
        <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 space-y-1">
          <span className="text-xs font-bold uppercase text-sky-800 dark:text-sky-300 tracking-wider flex items-center gap-1.5">
            <Hospital className="w-4 h-4 text-sky-600" /> Hospital Affiliation
          </span>
          <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {doctor.hospitalName}
          </p>
        </div>

        {/* Biography */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About Doctor
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {doctor.bio}
          </p>
        </div>

        {/* Schedule & Slots */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-600" /> Available Schedule & Slots
          </h4>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {doctor.availableDays.map((day, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg shrink-0"
              >
                {day}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {doctor.timeSlots.map((slot, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-semibold rounded-lg shrink-0 border border-sky-200 dark:border-sky-800"
              >
                {slot}
              </span>
            ))}
          </div>
        </div>

        {/* In-Person Only Notice */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-medium">
          Note: MEDCONNECT supports in-person hospital consultation requests only.
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onClose();
            onRequestAppointment(doctor);
          }}
          className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Request In-Person Appointment</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Plus,
  Hospital,
  User,
  Download,
  Filter,
  Eye,
  RotateCcw
} from 'lucide-react';
import { AppointmentRequest, Doctor } from '../types';

interface AppointmentsPageProps {
  appointments: AppointmentRequest[];
  onOpenRequestModal: (doctor?: Doctor) => void;
  onCancelRequest: (id: string) => void;
  onRescheduleRequest: (id: string, newDate: string, newSlot: string) => void;
  onViewPrescription: (app: AppointmentRequest) => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  onOpenRequestModal,
  onCancelRequest,
  onRescheduleRequest,
  onViewPrescription,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentRequest | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('10:00 AM');

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Review
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-sky-600" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget || !rescheduleDate) return;
    onRescheduleRequest(rescheduleTarget.id, rescheduleDate, rescheduleSlot);
    setRescheduleTarget(null);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            In-Person Appointment Requests
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track, reschedule, cancel, or download post-consultation prescriptions
          </p>
        </div>

        <button
          onClick={() => onOpenRequestModal()}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredAppointments.map((app) => (
          <div
            key={app.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
                    {app.doctorName}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
                  {app.specialty}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" /> {app.date}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block mt-0.5">
                  Slot: {app.timeSlot}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Hospital className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate"><strong>Hospital:</strong> {app.hospitalName}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span><strong>Patient:</strong> {app.patientName}</span>
              </div>
            </div>

            {app.reason && (
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <strong>Reason:</strong> {app.reason}
              </p>
            )}

            {/* Actions Bar */}
            <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
              {app.prescriptionSummary ? (
                <button
                  onClick={() => onViewPrescription(app)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View & Download Prescription Summary</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  In-person consultation pending
                </span>
              )}

              <div className="flex items-center gap-2 shrink-0">
                {(app.status === 'pending' || app.status === 'confirmed') && (
                  <>
                    <button
                      onClick={() => {
                        setRescheduleTarget(app);
                        setRescheduleDate(app.date);
                        setRescheduleSlot(app.timeSlot);
                      }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => onCancelRequest(app.id)}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
            <p>No appointment requests found under status "{statusFilter}".</p>
            <button
              onClick={() => onOpenRequestModal()}
              className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl"
            >
              Request Appointment
            </button>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
              Reschedule Appointment Request
            </h3>
            <p className="text-xs text-slate-500">
              Select new date and time slot for consultation with <strong>{rescheduleTarget.doctorName}</strong>.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  New Time Slot
                </label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

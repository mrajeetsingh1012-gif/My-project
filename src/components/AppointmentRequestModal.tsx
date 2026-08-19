import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Hospital as HospitalIcon, CheckCircle2 } from 'lucide-react';
import { Doctor, Hospital, FamilyProfile } from '../types';

interface AppointmentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  hospitals: Hospital[];
  familyProfiles: FamilyProfile[];
  initialDoctor?: Doctor | null;
  onSubmitRequest: (requestData: any) => void;
}

export const AppointmentRequestModal: React.FC<AppointmentRequestModalProps> = ({
  isOpen,
  onClose,
  doctors,
  hospitals,
  familyProfiles,
  initialDoctor,
  onSubmitRequest,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [patientType, setPatientType] = useState<'self' | 'family'>('self');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sync state when modal opens or initialDoctor/doctors change
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (initialDoctor) {
        setSelectedDoctorId(initialDoctor.id);
        if (initialDoctor.timeSlots && initialDoctor.timeSlots.length > 0) {
          setSelectedSlot(initialDoctor.timeSlots[0]);
        }
      } else if (doctors && doctors.length > 0) {
        setSelectedDoctorId(doctors[0].id);
        if (doctors[0].timeSlots && doctors[0].timeSlots.length > 0) {
          setSelectedSlot(doctors[0].timeSlots[0]);
        }
      }

      // Default date to tomorrow if empty
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setAppointmentDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen, initialDoctor, doctors]);

  if (!isOpen) return null;

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentDoctor) {
      setErrorMsg('Please select a doctor for consultation.');
      return;
    }
    if (!appointmentDate) {
      setErrorMsg('Please select a valid consultation date.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please enter a brief reason or symptoms for the visit.');
      return;
    }

    let patientName = 'Alexander Wright (Self)';
    if (patientType === 'family') {
      if (selectedFamilyId) {
        const fam = familyProfiles.find((f) => f.id === selectedFamilyId);
        if (fam) patientName = `${fam.name} (${fam.relationship})`;
      } else {
        setErrorMsg('Please select a family member profile.');
        return;
      }
    }

    onSubmitRequest({
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      specialty: currentDoctor.specialty,
      hospitalId: currentDoctor.hospitalId,
      hospitalName: currentDoctor.hospitalName,
      patientName,
      familyProfileId: patientType === 'family' ? selectedFamilyId : undefined,
      date: appointmentDate,
      timeSlot: selectedSlot || '10:00 AM',
      reason,
    });

    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
            Request In-Person Hospital Appointment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit your consultation request. In-person visit only.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select Doctor */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Specialist Doctor
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-xs"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} - {doc.specialty} (${doc.fee})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Info Box */}
          {currentDoctor && (
            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 rounded-xl space-y-1">
              <p className="font-bold text-sky-900 dark:text-sky-200 text-xs">
                {currentDoctor.name} ({currentDoctor.qualification})
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Hospital: <strong>{currentDoctor.hospitalName}</strong>
              </p>
              <p className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold">
                Available: {currentDoctor.availableDays.join(', ')} • Fee: ${currentDoctor.fee}
              </p>
            </div>
          )}

          {/* Patient Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Appointment For
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPatientType('self')}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                  patientType === 'self'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Myself (Self)
              </button>
              <button
                type="button"
                onClick={() => setPatientType('family')}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                  patientType === 'family'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Family Member
              </button>
            </div>

            {patientType === 'family' && (
              <div className="pt-1">
                {familyProfiles.length > 0 ? (
                  <select
                    value={selectedFamilyId}
                    onChange={(e) => setSelectedFamilyId(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    <option value="">Select Family Profile...</option>
                    {familyProfiles.map((fam) => (
                      <option key={fam.id} value={fam.id}>
                        {fam.name} ({fam.relationship}, {fam.age} yrs)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-[11px] text-amber-600 font-medium">
                    No family profiles added yet. Manage family health in Profile section.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Consultation Date
              </label>
              <input
                type="date"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Preferred Time Slot
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
              >
                {currentDoctor?.timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason / Symptoms */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Reason for Visit / Main Symptoms
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe symptoms or purpose of in-person consultation..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Appointment Request</span>
          </button>
        </form>
      </div>
    </div>
  );
};

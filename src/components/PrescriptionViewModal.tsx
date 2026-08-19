import React from 'react';
import { X, FileText, Download, Printer, CheckCircle2, Hospital, Calendar, Stethoscope, Activity } from 'lucide-react';
import { AppointmentRequest } from '../types';

interface PrescriptionViewModalProps {
  appointment: AppointmentRequest | null;
  onClose: () => void;
}

export const PrescriptionViewModal: React.FC<PrescriptionViewModalProps> = ({
  appointment,
  onClose,
}) => {
  if (!appointment || !appointment.prescriptionSummary) return null;

  const summary = appointment.prescriptionSummary;

  const handleDownload = () => {
    // Generate printable summary blob download
    const content = `
====================================================
               MEDCONNECT CONSULTATION SUMMARY
====================================================
Doctor: ${appointment.doctorName} (${appointment.specialty})
Hospital: ${appointment.hospitalName}
Patient: ${appointment.patientName}
Consultation Date: ${summary.date}

DIAGNOSIS:
${summary.diagnosis}

SUMMARY:
${summary.summary}

PRESCRIBED MEDICATIONS:
${summary.medicines.map((m) => `- ${m.name} (${m.dosage}) for ${m.duration}`).join('\n')}

PHYSICIAN ADVICE:
${summary.advice}

====================================================
This digital prescription summary is provided by MEDCONNECT.
====================================================
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${appointment.doctorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${summary.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Prescription Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 font-display">
                Official Consultation Prescription Summary
              </h3>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                MEDCONNECT Healthcare Partner Upload
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-slate-600 dark:text-slate-300">
            <div>
              <p><strong>Doctor:</strong> {appointment.doctorName}</p>
              <p><strong>Specialty:</strong> {appointment.specialty}</p>
            </div>
            <div>
              <p><strong>Hospital:</strong> {appointment.hospitalName}</p>
              <p><strong>Date:</strong> {summary.date}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 space-y-1">
          <span className="text-xs font-bold uppercase text-sky-800 dark:text-sky-300 tracking-wider">
            Diagnosis
          </span>
          <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
            {summary.diagnosis}
          </p>
        </div>

        {/* Summary Notes */}
        <div className="space-y-1 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Consultation Findings
          </span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
            {summary.summary}
          </p>
        </div>

        {/* Medicines Table */}
        <div className="space-y-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Prescribed Medicines & Dosage
          </span>
          <div className="space-y-1.5">
            {summary.medicines.map((med, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{med.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Dosage: {med.dosage}</p>
                </div>
                <span className="text-[11px] font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded">
                  Duration: {med.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Physician Advice */}
        {summary.advice && (
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 space-y-1 text-xs">
            <span className="font-bold uppercase text-teal-800 dark:text-teal-300 tracking-wider">
              Physician Advice & Lifestyle Notes
            </span>
            <p className="text-teal-900 dark:text-teal-200">{summary.advice}</p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center gap-2 print:hidden">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download Summary Document</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

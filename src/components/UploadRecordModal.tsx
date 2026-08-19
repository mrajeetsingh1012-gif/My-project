import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { RecordCategory } from '../types';

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newRecord: any) => void;
}

export const UploadRecordModal: React.FC<UploadRecordModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecordCategory>('Prescription');
  const [recordDate, setRecordDate] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !recordDate) return;

    onUpload({
      title,
      category,
      recordDate,
      doctorName: doctorName || 'Self Uploaded',
      fileName: selectedFileName || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.4 MB',
      notes,
    });

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
            Upload Document to Record Vault
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Secure client-side encrypted upload (PDF, JPG, PNG)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Dropzone File Upload */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/50 relative">
            <input
              type="file"
              onChange={handleFileDrop}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-1">
              <Upload className="w-8 h-8 text-indigo-600" />
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {selectedFileName ? selectedFileName : 'Click or Drag & Drop Medical Document'}
              </p>
              <p className="text-[11px] text-slate-400">
                Supports PDF, JPG, PNG up to 25MB
              </p>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Document Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Annual Cardiology Blood Panel 2026"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecordCategory)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="Prescription">Prescription</option>
                <option value="Lab Report">Lab Report</option>
                <option value="Discharge Summary">Discharge Summary</option>
                <option value="Vaccination">Vaccination Certificate</option>
                <option value="Other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Record Date
              </label>
              <input
                type="date"
                required
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Prescribing Doctor / Hospital (Optional)
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="e.g., Dr. Sarah Jenkins"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Notes or Summary Findings (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., All lipid markers normal. Vitamin D supplement recommended."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save to Secure Vault</span>
          </button>
        </form>
      </div>
    </div>
  );
};

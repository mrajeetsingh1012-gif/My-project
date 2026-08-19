import React, { useState } from 'react';
import {
  FileText,
  Search,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  WifiOff,
  Eye,
  Filter,
  Plus,
  Lock,
  Tag,
  Share2
} from 'lucide-react';
import { MedicalRecord, RecordCategory } from '../types';

interface RecordsVaultPageProps {
  records: MedicalRecord[];
  onOpenUploadModal: () => void;
  onDeleteRecord: (id: string) => void;
  onToggleOffline: (id: string) => void;
  isOffline?: boolean;
}

export const RecordsVaultPage: React.FC<RecordsVaultPageProps> = ({
  records,
  onOpenUploadModal,
  onDeleteRecord,
  onToggleOffline,
  isOffline = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewRecordModal, setViewRecordModal] = useState<MedicalRecord | null>(null);

  const categories = ['All', 'Prescription', 'Lab Report', 'Discharge Summary', 'Vaccination', 'Other'];

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.doctorName && rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || rec.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleDownloadFile = (record: MedicalRecord) => {
    // Generate text/binary file download representation
    const textContent = `
====================================================
           MEDCONNECT SECURE MEDICAL RECORD
====================================================
Title: ${record.title}
Category: ${record.category}
Date of Record: ${record.recordDate}
Physician / Provider: ${record.doctorName || 'Not specified'}
Uploaded Date: ${record.uploadedAt}

NOTES & FINDINGS:
${record.notes || 'No notes provided.'}

====================================================
Secure encrypted document stored in MEDCONNECT Vault.
====================================================
    `;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = record.fileName || `${record.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mark as downloaded offline
    if (!record.isDownloadedOffline) {
      onToggleOffline(record.id);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              Medical Record Vault
            </h2>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Encrypted Storage
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize prescriptions, lab reports, discharge summaries & vaccination certificates
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Record</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title, doctor name, or file name..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm pl-11 pr-4 py-2.5 rounded-xl border-none focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Offline Availability Banner Notice */}
      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Records marked as <strong>Downloaded</strong> remain securely available offline even when internet is disconnected.
          </span>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 shrink-0 mt-0.5">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display">
                    {rec.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {rec.category}
                  </span>
                  {rec.isDownloadedOffline && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Offline Ready
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Record Date: {rec.recordDate} • Doctor: {rec.doctorName || 'N/A'} • {rec.fileSize}
                </p>

                {rec.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1 italic">
                    "{rec.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewRecordModal(rec)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                title="View Record Details"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDownloadFile(rec)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                title="Download for Offline Access"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={() => onDeleteRecord(rec.id)}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
            <p>No medical records found under filter "{selectedCategory}".</p>
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
            >
              Upload Record Now
            </button>
          </div>
        )}
      </div>

      {/* Record View Modal */}
      {viewRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 font-display">
                {viewRecordModal.title}
              </h3>
              <button
                onClick={() => setViewRecordModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <span className="text-slate-400 font-medium block">Category</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{viewRecordModal.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Record Date</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{viewRecordModal.recordDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Doctor / Clinic</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{viewRecordModal.doctorName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">File Size</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{viewRecordModal.fileSize}</span>
                </div>
              </div>

              {viewRecordModal.notes && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <span className="font-bold uppercase text-[10px] text-indigo-700 dark:text-indigo-300 block mb-1">
                    Notes & Diagnostic Observations
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {viewRecordModal.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  handleDownloadFile(viewRecordModal);
                  setViewRecordModal(null);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

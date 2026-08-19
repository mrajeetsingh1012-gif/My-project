import React, { useState } from 'react';
import {
  Search,
  Filter,
  Stethoscope,
  Hospital as HospitalIcon,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Globe,
  Calendar,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { Doctor, Hospital } from '../types';

interface DirectoryPageProps {
  doctors: Doctor[];
  hospitals: Hospital[];
  onSelectDoctor: (doctor: Doctor) => void;
  onSelectHospital: (hospital: Hospital) => void;
  onRequestAppointment: (doctor: Doctor) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  doctors,
  hospitals,
  onSelectDoctor,
  onSelectHospital,
  onRequestAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [maxFee, setMaxFee] = useState<number>(200);
  const [minExp, setMinExp] = useState<number>(0);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('All');

  // Specialties list
  const specialties = ['All', 'Cardiology', 'Endocrinology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Neurology'];

  // Filter Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesFee = doc.fee <= maxFee;
    const matchesExp = doc.experienceYears >= minExp;
    const matchesHosp = selectedHospitalId === 'All' || doc.hospitalId === selectedHospitalId;

    return matchesSearch && matchesSpecialty && matchesFee && matchesExp && matchesHosp;
  });

  // Filter Hospitals
  const filteredHospitals = hospitals.filter((hosp) => {
    return (
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-5 pb-8">
      {/* Search Header Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              Healthcare Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Find qualified specialist doctors & accredited hospitals for in-person consultations
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-200/80 dark:bg-slate-800 p-1 max-w-sm">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'doctors'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors ({filteredDoctors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'hospitals'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <HospitalIcon className="w-4 h-4" />
            <span>Hospitals ({filteredHospitals.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'doctors'
                ? 'Search doctor by name, specialty, or hospital...'
                : 'Search hospital by name, location, or service...'
            }
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-xs"
          />
        </div>
      </div>

      {/* Filter Toolbar (For Doctors) */}
      {activeTab === 'doctors' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-sky-600" /> Filter Options
            </span>
            <button
              onClick={() => {
                setSelectedSpecialty('All');
                setMaxFee(200);
                setMinExp(0);
                setSelectedHospitalId('All');
              }}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>

          {/* Specialty Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Range Sliders & Hospital Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Max Fee: ${maxFee}
              </label>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Min Experience: {minExp} Years
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="2"
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Hospital Affiliation
              </label>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium"
              >
                <option value="All">All Hospitals</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* DOCTORS LIST VIEW */}
      {activeTab === 'doctors' && (
        <div className="space-y-3">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4"
            >
              <img
                src={doc.photo}
                alt={doc.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm shrink-0"
              />

              <div className="flex-1 space-y-1.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      {doc.specialty} • {doc.qualification}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      {doc.rating}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <HospitalIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.hospitalName}</span>
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> {doc.experienceYears} Years Exp.
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Globe className="w-3.5 h-3.5 text-sky-600" /> {doc.languages.join(', ')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Fee: ${doc.fee}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-600" /> {doc.availableDays.join(', ')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDoctor(doc)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onRequestAppointment(doc)}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Request In-Person</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
              No doctors found matching your filters.
            </div>
          )}
        </div>
      )}

      {/* HOSPITALS LIST VIEW */}
      {activeTab === 'hospitals' && (
        <div className="space-y-3">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4"
            >
              <img
                src={hosp.photo}
                alt={hosp.name}
                className="w-full sm:w-36 h-28 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
              />

              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
                    {hosp.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{hosp.address}, {hosp.city}, {hosp.state}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {hosp.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium px-2 py-0.5 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={`tel:${hosp.phone}`}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> {hosp.phone}
                  </a>

                  <button
                    onClick={() => onSelectHospital(hosp)}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>View Services & Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

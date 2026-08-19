import React, { useState } from 'react';
import { X, Plus, Trash2, Users, CheckCircle2 } from 'lucide-react';
import { FamilyProfile } from '../types';

interface FamilyProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyProfiles: FamilyProfile[];
  onAddFamilyProfile: (newProfile: any) => void;
  onRemoveFamilyProfile: (id: string) => void;
}

export const FamilyProfilesModal: React.FC<FamilyProfilesModalProps> = ({
  isOpen,
  onClose,
  familyProfiles,
  onAddFamilyProfile,
  onRemoveFamilyProfile,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Spouse');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddFamilyProfile({
      name,
      relationship,
      age: Number(age),
      gender,
      bloodGroup,
      allergies: allergies ? allergies.split(',').map((a) => a.trim()) : [],
    });

    setName('');
    setShowAddForm(false);
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

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
              Family Health Profiles
            </h3>
            <p className="text-xs text-slate-500">
              Manage profiles for dependents & family members
            </p>
          </div>
        </div>

        {/* List of Family Profiles */}
        <div className="space-y-2">
          {familyProfiles.map((fam) => (
            <div
              key={fam.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{fam.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {fam.relationship} • {fam.age} Yrs • {fam.gender} • Blood: {fam.bloodGroup}
                </p>
                {fam.allergies && fam.allergies.length > 0 && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                    Allergies: {fam.allergies.join(', ')}
                  </p>
                )}
              </div>

              <button
                onClick={() => onRemoveFamilyProfile(fam.id)}
                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40"
                title="Remove Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Form Toggle */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        ) : (
          <form onSubmit={handleAddSubmit} className="space-y-3 text-xs p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Add Member Details</h4>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Eleanor Wright"
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Blood Group
                </label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="O+, A+, etc."
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Known Allergies
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Sulfa"
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs"
              >
                Save Member
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

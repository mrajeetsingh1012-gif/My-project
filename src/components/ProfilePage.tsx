import React, { useState } from 'react';
import {
  User,
  Users,
  Shield,
  Bell,
  Eye,
  Award,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  Edit2,
  Gift,
  Sun,
  Moon,
  Type,
  Phone,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';
import { UserProfile, FamilyProfile, RewardState } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  familyProfiles: FamilyProfile[];
  rewards: RewardState;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenFamilyModal: () => void;
  onOpenRewardsModal: () => void;
  onLogout: () => void;
  onOpenAuth?: (mode?: 'register' | 'login') => void;
  onOpenMembership?: () => void;
  accessibilitySettings: {
    darkMode: boolean;
    largeText: boolean;
    highContrast: boolean;
  };
  onToggleDarkMode: () => void;
  onToggleLargeText: () => void;
  onToggleHighContrast: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  familyProfiles,
  rewards,
  onUpdateUser,
  onOpenFamilyModal,
  onOpenRewardsModal,
  onLogout,
  onOpenAuth,
  onOpenMembership,
  accessibilitySettings,
  onToggleDarkMode,
  onToggleLargeText,
  onToggleHighContrast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);
  const [allergies, setAllergies] = useState(user.allergies.join(', '));
  const [primaryContactName, setPrimaryContactName] = useState(user.primaryContact.name);
  const [primaryContactPhone, setPrimaryContactPhone] = useState(user.primaryContact.phone);

  const [biometricEnabled, setBiometricEnabled] = useState(user.biometricEnabled);
  const [notifications, setNotifications] = useState(user.notificationsEnabled);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      phone,
      bloodGroup,
      allergies: allergies.split(',').map((a) => a.trim()),
      primaryContact: {
        ...user.primaryContact,
        name: primaryContactName,
        phone: primaryContactPhone,
      },
      biometricEnabled,
      notificationsEnabled: notifications,
    });
    setIsEditing(false);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medconnect_user_export_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-2xl font-display border-2 border-white/40 shadow-inner">
            {user.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">{user.name}</h2>
            <p className="text-xs text-sky-100 mt-0.5">{user.email} • {user.phone}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap justify-center sm:justify-start">
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase">
                Blood Group: {user.bloodGroup}
              </span>
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                Age: {user.age} Yrs
              </span>
              {user.subscriptionPlan === 'plus' && (
                <span className="text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-xs">
                  <Crown className="w-3 h-3" />
                  PLUS Member
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rewards Quick Badge */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={onOpenRewardsModal}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-sky-100 block">MedConnect Rewards</span>
              <span className="text-base font-extrabold font-display">{rewards.points} Points</span>
            </div>
          </button>
        </div>
      </div>

      {/* MEDCONNECT Plus Membership Spotlight Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white shadow-lg border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white">
                {user.subscriptionPlan === 'plus' ? 'MEDCONNECT Plus Plan Active' : 'Upgrade to MEDCONNECT Plus'}
              </h3>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-full uppercase">
                {user.subscriptionPlan === 'plus' ? 'Active' : 'Save ~16%'}
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              {user.subscriptionPlan === 'plus'
                ? 'Enjoy unlimited PULSE AI, priority booking slots, multi-family vaults, and 24x7 intelligent health-management tools.'
                : 'FREE: Essential healthcare companion • PLUS: Intelligent health-management tools (₹99/mo or ₹999/yr).'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (typeof onOpenMembership === 'function') onOpenMembership();
          }}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{user.subscriptionPlan === 'plus' ? 'Manage Membership' : 'Explore Plus Plans'}</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Family Management */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
                Family Profiles ({familyProfiles.length})
              </h3>
            </div>
            <button
              onClick={onOpenFamilyModal}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage multiple family profiles under one account for appointments and medical records.
          </p>

          <div className="space-y-2">
            {familyProfiles.map((fam) => (
              <div
                key={fam.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{fam.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {fam.relationship} • {fam.age} yrs • Blood: {fam.bloodGroup}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Accessibility Options */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-300">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
              Accessibility & Display Controls
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                {accessibilitySettings.darkMode ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                Dark Mode Theme
              </span>
              <input
                type="checkbox"
                checked={accessibilitySettings.darkMode}
                onChange={onToggleDarkMode}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Type className="w-4 h-4 text-sky-500" />
                Large Text Mode (Senior Friendly)
              </span>
              <input
                type="checkbox"
                checked={accessibilitySettings.largeText}
                onChange={onToggleLargeText}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-500" />
                High Contrast View
              </span>
              <input
                type="checkbox"
                checked={accessibilitySettings.highContrast}
                onChange={onToggleHighContrast}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Security & Biometrics */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
              Security & Biometrics
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Biometric Lock (Fingerprint / FaceID)</p>
                <p className="text-[11px] text-slate-500">Require biometric verification upon launch</p>
              </div>
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={(e) => {
                  setBiometricEnabled(e.target.checked);
                  onUpdateUser({ biometricEnabled: e.target.checked });
                }}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Session History Log</p>
                <p className="text-[11px] text-slate-500">Last active: San Francisco, Web PWA</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Emergency Contacts & Notifications */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
              Emergency Contacts
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{user.primaryContact.name}</p>
                <p className="text-[11px] text-slate-500">{user.primaryContact.relation} • {user.primaryContact.phone}</p>
              </div>
              <span className="text-[10px] font-bold text-sky-600">Primary</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{user.secondaryContact.name}</p>
                <p className="text-[11px] text-slate-500">{user.secondaryContact.relation} • {user.secondaryContact.phone}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Secondary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          
          <button
            onClick={() => onOpenAuth ? onOpenAuth('login') : onLogout()}
            className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-blue-200 dark:border-blue-900 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Switch / Login</span>
          </button>

          <button
            onClick={() => onOpenAuth ? onOpenAuth('register') : onLogout()}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Register New</span>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

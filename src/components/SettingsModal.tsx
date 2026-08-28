import React, { useState } from 'react';
import {
  X,
  User,
  Globe,
  Sun,
  Moon,
  Eye,
  Type,
  Shield,
  Fingerprint,
  KeyRound,
  Download,
  RefreshCw,
  Info,
  LogOut,
  ChevronRight,
  Check,
  Smartphone,
  CheckCircle2,
  HardDrive,
  Sliders,
  Sparkles,
  Lock,
  FileText,
  Settings,
  Crown
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  accessibilitySettings: {
    darkMode: boolean;
    largeText: boolean;
    highContrast: boolean;
  };
  onToggleDarkMode: () => void;
  onToggleLargeText: () => void;
  onToggleHighContrast: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
  onOpenMembership?: () => void;
  isOffline?: boolean;
  userRole?: 'user' | 'admin';
  onSwitchRole?: (role: 'user' | 'admin') => void;
  onOpenAdminConsole?: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇦🇪' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  accessibilitySettings,
  onToggleDarkMode,
  onToggleLargeText,
  onToggleHighContrast,
  onNavigateToProfile,
  onLogout,
  onOpenMembership,
  isOffline = false,
  userRole = 'user',
  onSwitchRole,
  onOpenAdminConsole,
}) => {
  // 1. Language State
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 2. Privacy & Security State
  const [privacySettings, setPrivacySettings] = useState({
    endToEndEncryption: true,
    shareDataWithDoctors: true,
    telemetryOptIn: false,
  });

  // 3. Biometric Login State
  const [biometricEnabled, setBiometricEnabled] = useState(user.biometricEnabled ?? true);

  // 4. PIN & Password State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinConfirmInput, setPinConfirmInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSetSuccess, setPinSetSuccess] = useState(false);

  // 5. Offline Downloads State
  const [autoDownloadWifi, setAutoDownloadWifi] = useState(true);
  const [offlineCacheSize, setOfflineCacheSize] = useState('34.2 MB (4 Records)');
  const [cacheCleared, setCacheCleared] = useState(false);

  // 6. Manual Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  // 7. About Modal State
  const [showAboutModal, setShowAboutModal] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      showToast('Health records & appointments synchronized with cloud.');
    }, 1200);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || !/^\d+$/.test(pinInput)) {
      setPinError('PIN must be a 4-digit number.');
      return;
    }
    if (pinInput !== pinConfirmInput) {
      setPinError('PINs do not match. Please try again.');
      return;
    }
    setPinError('');
    setPinSetSuccess(true);
    setTimeout(() => {
      setShowPinModal(false);
      setPinSetSuccess(false);
      setPinInput('');
      setPinConfirmInput('');
      showToast('Security PIN updated successfully.');
    }, 1000);
  };

  const handleClearOfflineCache = () => {
    setOfflineCacheSize('0 KB (0 Records)');
    setCacheCleared(true);
    showToast('Offline records cache cleared.');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Main Settings Right Drawer Container */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-blue-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Settings</h2>
              <p className="text-[11px] text-blue-100">App Preferences & Account Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close Settings"
            id="close-settings-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Scrollable Settings Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* FEATURE 1: PROFILE */}
          <section className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {user.bloodGroup}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email} • {user.phone}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Emergency Contact: {user.primaryContact?.name} ({user.primaryContact?.phone})</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onNavigateToProfile();
              }}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0 shadow-xs"
              id="settings-profile-btn"
            >
              <User className="w-4 h-4" />
              <span>Manage Profile</span>
            </button>
          </section>

          {/* FEATURE: MEDCONNECT PLUS MEMBERSHIP & PLANS */}
          <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-blue-400/30 relative overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">
                      {user.subscriptionPlan === 'plus' ? 'MEDCONNECT Plus Plan Active' : 'MEDCONNECT Plus Premium'}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                      {user.subscriptionPlan === 'plus' ? 'Active' : 'Save ~16%'}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5">
                    {user.subscriptionPlan === 'plus'
                      ? 'Intelligent Health-Management Tools Active (₹99/mo or ₹999/yr)'
                      : 'FREE: Essential companion • PLUS: Intelligent tools (₹99/mo or ₹999/yr)'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (typeof onOpenMembership === 'function') onOpenMembership();
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl shadow-xs active:scale-95 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                id="settings-membership-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.subscriptionPlan === 'plus' ? 'Manage' : 'Upgrade'}</span>
              </button>
            </div>
          </section>

          {/* LIST OF SETTINGS SECTIONS */}
          <div className="grid grid-cols-1 gap-3">

            {/* FEATURE: ACCOUNT ROLE & ADMIN MODE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Account Access Role</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Patient View vs Admin System Control</p>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                  userRole === 'admin'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {userRole === 'admin' ? '👑 Admin Mode' : '👤 Patient Mode'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchRole) onSwitchRole('user');
                    showToast('Switched to Patient View.');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    userRole === 'user'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-500'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Patient View
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAdminConsole) {
                      onOpenAdminConsole();
                    } else if (onSwitchRole) {
                      onSwitchRole('admin');
                    }
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    userRole === 'admin'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-500'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Admin Console 🔐
                </button>
              </div>
            </div>

            {/* FEATURE 2: LANGUAGE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Language</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">App interface language</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  id="language-picker-btn"
                >
                  <span>{selectedLanguage}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showLanguagePicker ? 'rotate-90' : ''}`} />
                </button>

                {showLanguagePicker && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 overflow-hidden py-1 max-h-48 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.name);
                          setShowLanguagePicker(false);
                          showToast(`App language set to ${lang.name}`);
                        }}
                        className={`w-full px-3 py-2 text-xs font-medium text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          selectedLanguage === lang.name ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {selectedLanguage === lang.name && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FEATURE 3: THEME */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    {accessibilitySettings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">App Theme</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {accessibilitySettings.darkMode ? 'Dark Luxury Theme' : 'Clean Light Theme'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onToggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    accessibilitySettings.darkMode ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  id="theme-toggle-btn"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      accessibilitySettings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>Mode:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {accessibilitySettings.darkMode ? '🌙 Dark Active' : '☀️ Light Active'}
                </span>
              </div>
            </div>

            {/* FEATURE 4: ACCESSIBILITY */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Accessibility</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Typography sizing & visual contrast options</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={onToggleLargeText}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    accessibilitySettings.largeText
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                  id="large-text-toggle-btn"
                >
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold">Large Text Sizing</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${accessibilitySettings.largeText ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {accessibilitySettings.largeText ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={onToggleHighContrast}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    accessibilitySettings.highContrast
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                  }`}
                  id="high-contrast-toggle-btn"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold">High Contrast Mode</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${accessibilitySettings.highContrast ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {accessibilitySettings.highContrast ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* FEATURE 5: PRIVACY & SECURITY */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Privacy & Data Security</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">HIPAA compliant health data controls</p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-1">
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">AES-256 Record Encryption</span>
                  <input
                    type="checkbox"
                    checked={privacySettings.endToEndEncryption}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, endToEndEncryption: e.target.checked })}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Verified Doctor Sharing</span>
                  <input
                    type="checkbox"
                    checked={privacySettings.shareDataWithDoctors}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, shareDataWithDoctors: e.target.checked })}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Anonymous Diagnostics</span>
                  <input
                    type="checkbox"
                    checked={privacySettings.telemetryOptIn}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, telemetryOptIn: e.target.checked })}
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* FEATURE 6: BIOMETRIC LOGIN */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Biometric Login</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Touch ID / Face ID Authentication</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBiometricEnabled(!biometricEnabled);
                      showToast(!biometricEnabled ? 'Biometric Login enabled.' : 'Biometric Login disabled.');
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      biometricEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                    id="biometric-toggle-btn"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center justify-between border border-emerald-100 dark:border-emerald-900/40">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Smartphone className="w-3.5 h-3.5" />
                  {biometricEnabled ? 'Face ID Registered' : 'Disabled'}
                </span>
                <span className="text-[10px] font-bold uppercase">{biometricEnabled ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            {/* FEATURE 7: PIN / PASSWORD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">PIN & Password</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">4-digit security code & credentials</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Security Passcode</span>
                <button
                  onClick={() => setShowPinModal(true)}
                  className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all border border-indigo-200 dark:border-indigo-800"
                  id="change-pin-btn"
                >
                  Change PIN
                </button>
              </div>
            </div>

            {/* FEATURE 8: OFFLINE DOWNLOADS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Offline Downloads</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cached records & offline storage</p>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Local Storage Used:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{offlineCacheSize}</span>
                </div>

                <label className="flex items-center justify-between py-1 cursor-pointer">
                  <span className="text-slate-700 dark:text-slate-300">Auto-download on Wi-Fi</span>
                  <input
                    type="checkbox"
                    checked={autoDownloadWifi}
                    onChange={(e) => setAutoDownloadWifi(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 rounded"
                  />
                </label>

                <button
                  onClick={handleClearOfflineCache}
                  disabled={cacheCleared}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                  id="clear-cache-btn"
                >
                  {cacheCleared ? 'Cache Cleared' : 'Clear Offline Cache'}
                </button>
              </div>
            </div>

            {/* FEATURE 9: MANUAL SYNC */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                    <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin text-sky-600' : ''}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Manual Cloud Synchronization</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sync health vault, prescription logs & appointments with Cloud Run backend
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all disabled:opacity-60"
                  id="manual-sync-now-btn"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Last Cloud Sync Status:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {isSyncing ? 'Syncing data...' : `Last synced: ${lastSyncTime}`}
                </span>
              </div>
            </div>

            {/* FEATURE 10: ABOUT MEDCONNECT */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">About MEDCONNECT</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Platform details & compliance</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <div className="flex items-center justify-between">
                  <span>App Version:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">v2.4.0 (2026.08)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Engine:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Google AI Studio</span>
                </div>

                <button
                  onClick={() => setShowAboutModal(true)}
                  className="w-full mt-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-between"
                  id="about-details-btn"
                >
                  <span>Terms, Privacy & Medical Compliance</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* FEATURE 11: LOGOUT */}
            <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-600 text-white">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-rose-950 dark:text-rose-200">Account Session</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300">Sign out of active account</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                id="settings-logout-btn"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of MEDCONNECT</span>
              </button>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-all shadow-xs"
            id="done-settings-btn"
          >
            Done
          </button>
        </div>
      </div>

      {/* SUB-MODAL 1: CHANGE PIN */}
      {showPinModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs" onClick={() => setShowPinModal(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Lock className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Set Security PIN</h3>
              </div>
              <button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {pinSetSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Security PIN Updated!</p>
              </div>
            ) : (
              <form onSubmit={handleSavePin} className="space-y-4">
                {pinError && (
                  <p className="text-xs text-rose-600 font-semibold bg-rose-50 dark:bg-rose-950 p-2 rounded-xl text-center">
                    {pinError}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter New 4-Digit PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm 4-Digit PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinConfirmInput}
                    onChange={(e) => setPinConfirmInput(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Save PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: ABOUT DETAILS */}
      {showAboutModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs" onClick={() => setShowAboutModal(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Info className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">About MEDCONNECT Platform</h3>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-80 overflow-y-auto pr-1">
              <p>
                <strong>MEDCONNECT Digital Healthcare System</strong> is a comprehensive personal health record, appointment manager, and intelligent triage assistant powered by Google AI technology.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Compliance & Security Standard</p>
                <p className="text-[11px] text-slate-500">HIPAA compliant data architecture with AES-256 cloud encryption and zero unauthorized data monetization.</p>
              </div>
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl space-y-1 border border-amber-200 dark:border-amber-900/50">
                <p className="font-bold">Medical Disclaimer</p>
                <p className="text-[11px]">MedConnect Pulse AI and platform tools provide wellness guidance only and do NOT constitute formal diagnostic advice. In case of life-threatening emergencies, tap Large SOS or dial local emergency services immediately.</p>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
            >
              Close Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

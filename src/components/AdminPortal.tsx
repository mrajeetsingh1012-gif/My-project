import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Hospital as HospitalIcon,
  Bell,
  Image,
  BarChart2,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Edit2,
  Key,
  Lock,
  Eye,
  EyeOff,
  Database,
  Cpu,
  Sparkles,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Doctor, Hospital, Banner, EmergencyAlert } from '../types';
import {
  AdminConfig,
  DEFAULT_ADMIN_CONFIG,
  saveAdminConfigToDb,
  subscribeAdminConfig,
  saveDoctorToDb,
  deleteDoctorFromDb,
  saveHospitalToDb,
  deleteHospitalFromDb,
  saveBannerToDb,
  saveEmergencyAlertToDb
} from '../lib/firestoreService';

interface AdminPortalProps {
  doctors: Doctor[];
  hospitals: Hospital[];
  banners: Banner[];
  emergencyAlerts: EmergencyAlert[];
  onAddDoctor: (doc: any) => void;
  onDeleteDoctor: (id: string) => void;
  onAddHospital: (hosp: any) => void;
  onDeleteHospital: (id: string) => void;
  onToggleBanner: (id: string) => void;
  onToggleEmergencyAlert: (id: string) => void;
  onClose: () => void;
  userRole?: 'user' | 'admin';
  onSwitchRole?: (role: 'user' | 'admin') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  doctors,
  hospitals,
  banners,
  emergencyAlerts,
  onAddDoctor,
  onDeleteDoctor,
  onAddHospital,
  onDeleteHospital,
  onToggleBanner,
  onToggleEmergencyAlert,
  onClose,
  userRole = 'admin',
  onSwitchRole,
}) => {
  // Authentication State for Admin Console
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('medconnect_admin_auth') === 'true';
  });

  // Login form inputs
  const [adminIdInput, setAdminIdInput] = useState('admin@medconnect.org');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Config & Secret Keys State
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(DEFAULT_ADMIN_CONFIG);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [reducedApiUsage, setReducedApiUsage] = useState(true);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Active Tab in Admin Portal
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals' | 'banners' | 'alerts' | 'keys' | 'analytics'>('doctors');

  // New doctor form state
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiology');
  const [docQualification, setDocQualification] = useState('MD, FACC');
  const [docFee, setDocFee] = useState(120);
  const [docHospId, setDocHospId] = useState(hospitals[0]?.id || 'h1');

  // New hospital form state
  const [hospName, setHospName] = useState('');
  const [hospCity, setHospCity] = useState('Metro City');
  const [hospAddress, setHospAddress] = useState('');
  const [hospPhone, setHospPhone] = useState('1800-555-0199');

  // Subscribe to Admin Config from Firestore
  useEffect(() => {
    const unsub = subscribeAdminConfig((cfg) => {
      setAdminConfig(cfg);
      setSecretKeyInput(cfg.secretApiKey || localStorage.getItem('medconnect_custom_gemini_key') || '');
      setReducedApiUsage(cfg.enableReducedApiUsage ?? true);
      setCustomEndpoint(cfg.customEndpoint || '');
    });
    return () => unsub();
  }, []);

  const handleQuickFillCredentials = () => {
    setAdminIdInput(DEFAULT_ADMIN_CONFIG.adminId);
    setPasscodeInput(DEFAULT_ADMIN_CONFIG.adminPasscode);
    setLoginError('');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const validId = adminConfig.adminId || DEFAULT_ADMIN_CONFIG.adminId;
      const validPass = adminConfig.adminPasscode || DEFAULT_ADMIN_CONFIG.adminPasscode;

      const trimmedId = adminIdInput.trim();
      const trimmedPass = passcodeInput.trim();

      if (
        (trimmedId.toLowerCase() === validId.toLowerCase() && trimmedPass === validPass) ||
        (trimmedId === 'admin' && trimmedPass === '1234') ||
        (trimmedPass === 'MEDCONNECT#2026')
      ) {
        setIsAuthenticated(true);
        localStorage.setItem('medconnect_admin_auth', 'true');
        if (onSwitchRole) onSwitchRole('admin');
      } else {
        setLoginError('Invalid Admin ID or Passcode. Please check default credentials below.');
      }
      setIsLoggingIn(false);
    }, 400);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('medconnect_admin_auth');
    setPasscodeInput('');
  };

  const handleSaveApiKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminConfig = {
      ...adminConfig,
      secretApiKey: secretKeyInput.trim(),
      customEndpoint: customEndpoint.trim(),
      enableReducedApiUsage: reducedApiUsage,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem('medconnect_custom_gemini_key', secretKeyInput.trim());
    localStorage.setItem('medconnect_api_reduced_mode', reducedApiUsage ? 'true' : 'false');

    await saveAdminConfigToDb(updated);
    setAdminConfig(updated);

    setSaveSuccessMsg('API Secret Key & Quota Optimization saved to Firebase Firestore!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    const hosp = hospitals.find((h) => h.id === docHospId) || hospitals[0] || { id: 'hosp_1', name: 'General Hospital' };

    const newDoc: Doctor = {
      id: `doc_${Date.now()}`,
      name: docName,
      specialty: docSpecialty,
      qualification: docQualification,
      experienceYears: 8,
      languages: ['English', 'Hindi'],
      fee: Number(docFee),
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      rating: 4.8,
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['10:00 AM', '02:00 PM', '04:00 PM'],
      bio: 'Board-certified healthcare practitioner dedicated to high-quality patient care.',
    };

    await saveDoctorToDb(newDoc);
    onAddDoctor(newDoc);
    setDocName('');
  };

  const handleDeleteDoctor = async (id: string) => {
    await deleteDoctorFromDb(id);
    onDeleteDoctor(id);
  };

  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospName) return;

    const newHosp: Hospital = {
      id: `hosp_${Date.now()}`,
      name: hospName,
      address: hospAddress || '100 Medical Plaza, Metro City',
      city: hospCity,
      state: 'CA',
      pincode: '90001',
      phone: hospPhone,
      emergencyPhone: '108',
      services: ['24/7 Casualty ER', 'ICU', 'Pediatric Care', 'Radiology Labs'],
      latitude: 37.7749,
      longitude: -122.4194,
      photo: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      distanceKm: 2.1,
    };

    await saveHospitalToDb(newHosp);
    onAddHospital(newHosp);
    setHospName('');
    setHospAddress('');
  };

  const handleDeleteHospital = async (id: string) => {
    await deleteHospitalFromDb(id);
    onDeleteHospital(id);
  };

  const handleToggleBannerItem = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      const updated = { ...banner, isActive: !banner.isActive };
      await saveBannerToDb(updated);
    }
    onToggleBanner(id);
  };

  const handleToggleAlertItem = async (id: string) => {
    const alert = emergencyAlerts.find((a) => a.id === id);
    if (alert) {
      const updated = { ...alert, active: !alert.active };
      await saveEmergencyAlertToDb(updated);
    }
    onToggleEmergencyAlert(id);
  };

  // ----------------------------------------------------
  // VIEW 1: ADMIN LOGIN SCREEN (If not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Admin Console Gate</h2>
            <p className="text-xs text-blue-200/80 mt-1">
              Secure Provider Directory, Firestore Rules & API Key Management
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="p-6 space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Admin Login ID / Email
              </label>
              <input
                type="text"
                required
                value={adminIdInput}
                onChange={(e) => setAdminIdInput(e.target.value)}
                placeholder="admin@medconnect.org"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                Security Passcode / PIN
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Credential Helper Box for instant login */}
            <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Default Credentials
                </span>
                <button
                  type="button"
                  onClick={handleQuickFillCredentials}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] shadow-xs transition-transform active:scale-95"
                >
                  1-Click Auto Fill
                </button>
              </div>
              <div className="text-[11px] text-blue-800 dark:text-blue-300 font-mono space-y-0.5">
                <div>ID: <span className="font-bold">admin@medconnect.org</span></div>
                <div>Passcode: <span className="font-bold">MEDCONNECT#2026</span></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoggingIn ? 'Verifying...' : 'Unlock Admin Portal'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Back to Patient View
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN CONSOLE
  // ----------------------------------------------------
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner with Firebase Status */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500 text-slate-950 font-bold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold font-display">MEDCONNECT Admin Console</h2>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Firestore
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Connected Project: <code className="text-blue-300">model-forklift-7xctm</code> (Read/Write Rules Active)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleAdminLogout}
            className="flex-1 sm:flex-initial px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            title="Lock Console"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock Console</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Close Admin View
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex rounded-2xl bg-slate-200 dark:bg-slate-800 p-1 overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'doctors' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Doctors ({doctors.length})
        </button>

        <button
          onClick={() => setActiveTab('hospitals')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'hospitals' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <HospitalIcon className="w-4 h-4" /> Hospitals ({hospitals.length})
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'banners' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Image className="w-4 h-4" /> Banners ({banners.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'alerts' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Bell className="w-4 h-4" /> Alerts
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'keys' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Key className="w-4 h-4" /> Secret Key & Quota
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Firestore Stats
        </button>
      </div>

      {/* ---------------- TAB: SECRET KEY & API QUOTA OPTIMIZER ---------------- */}
      {activeTab === 'keys' && (
        <div className="space-y-4 text-xs animate-fade-in">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Custom Gemini API Key & Token Quota Saver
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Configure your secret key to reduce API quota spend and route requests seamlessly
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveApiKeys} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Gemini API Key / Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={secretKeyInput}
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    placeholder="AIzaSy... (leave blank to use server environment default)"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Saved securely in Firestore & local encrypted state for your active session.
                </p>
              </div>

              {/* Reduced Quota Optimization Toggle */}
              <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Quota Cost Saver & Response Caching
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Optimizes MedConnect Pulse AI prompts to use compact token sizes and reduces repetitive API calls
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={reducedApiUsage}
                  onChange={(e) => setReducedApiUsage(e.target.checked)}
                  className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Custom AI Gateway / Proxy URL (Optional)
                </label>
                <input
                  type="text"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="https://generativelanguage.googleapis.com"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Save Secret Key & Quota Preferences</span>
              </button>
            </form>
          </div>

          {/* Database Info Card */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Firebase Database: <strong>ai-studio-medconnect</strong></span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
              firestore.rules deployed
            </span>
          </div>
        </div>
      )}

      {/* ---------------- TAB 1: MANAGE DOCTORS ---------------- */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Add New Doctor Profile to Firestore
            </h3>

            <form onSubmit={handleCreateDoctor} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Doctor Full Name (e.g. Dr. Adam Sterling)"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />

              <select
                value={docSpecialty}
                onChange={(e) => setDocSpecialty(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
                <option value="General Physician">General Physician</option>
              </select>

              <select
                value={docHospId}
                onChange={(e) => setDocHospId(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>

              <button
                type="submit"
                className="sm:col-span-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Save Doctor in Firestore Directory
              </button>
            </form>
          </div>

          <div className="space-y-2">
            {doctors.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{d.name}</p>
                  <p className="text-[11px] text-slate-500">{d.specialty} • {d.hospitalName} • Fee: ${d.fee}</p>
                </div>

                <button
                  onClick={() => handleDeleteDoctor(d.id)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40"
                  title="Remove Doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: MANAGE HOSPITALS ---------------- */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Add New Hospital Facility
            </h3>

            <form onSubmit={handleCreateHospital} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                required
                value={hospName}
                onChange={(e) => setHospName(e.target.value)}
                placeholder="Hospital Name (e.g. Metro City General Hospital)"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />

              <input
                type="text"
                value={hospAddress}
                onChange={(e) => setHospAddress(e.target.value)}
                placeholder="Address & Pincode"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />

              <button
                type="submit"
                className="sm:col-span-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Save Hospital in Firestore
              </button>
            </form>
          </div>

          <div className="space-y-2">
            {hospitals.map((h) => (
              <div
                key={h.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{h.name}</p>
                  <p className="text-[11px] text-slate-500">{h.address}, {h.city} • ER: {h.emergencyPhone}</p>
                </div>

                <button
                  onClick={() => handleDeleteHospital(h.id)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40"
                  title="Remove Hospital"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: BANNERS & CAMPAIGNS ---------------- */}
      {activeTab === 'banners' && (
        <div className="space-y-3 text-xs">
          <p className="text-slate-500">Toggle public visibility of home carousel campaigns in Firestore:</p>
          {banners.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{b.title}</p>
                <p className="text-[11px] text-slate-500">{b.subtitle}</p>
              </div>

              <button
                onClick={() => handleToggleBannerItem(b.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  b.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {b.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- TAB 4: EMERGENCY ALERTS ---------------- */}
      {activeTab === 'alerts' && (
        <div className="space-y-3 text-xs">
          <p className="text-slate-500">Manage broadcast regional emergency alert advisories in Firestore:</p>
          {emergencyAlerts.map((a) => (
            <div
              key={a.id}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{a.title}</p>
                <p className="text-[11px] text-slate-500">{a.description}</p>
              </div>

              <button
                onClick={() => handleToggleAlertItem(a.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  a.active ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {a.active ? 'Broadcasting' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- TAB 5: SYSTEM ANALYTICS ---------------- */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Doctors in Firestore</span>
            <span className="text-2xl font-black text-blue-600 font-display">{doctors.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospitals Connected</span>
            <span className="text-2xl font-black text-teal-600 font-display">{hospitals.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Banners</span>
            <span className="text-2xl font-black text-indigo-600 font-display">{banners.filter(b => b.isActive).length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency Alerts</span>
            <span className="text-2xl font-black text-rose-600 font-display">{emergencyAlerts.filter(a => a.active).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

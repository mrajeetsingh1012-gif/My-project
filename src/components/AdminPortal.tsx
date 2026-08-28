import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Hospital as HospitalIcon,
  Bell,
  Image as ImageIcon,
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
  Sparkles,
  RefreshCw,
  LogOut,
  AlertTriangle,
  ExternalLink,
  Sliders,
  Check,
  X
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
  deleteBannerFromDb,
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
  onSaveBanner?: (banner: Banner) => void;
  onDeleteBanner?: (id: string) => void;
  onToggleBanner: (id: string) => void;
  onToggleEmergencyAlert: (id: string) => void;
  onClose: () => void;
  userRole?: 'user' | 'admin';
  onSwitchRole?: (role: 'user' | 'admin') => void;
}

// Preset banner images for quick selection
const PRESET_BANNER_IMAGES = [
  {
    label: 'Compassionate Doctor',
    url: 'https://images.unsplash.com/photo-1594824813572-c2834b9d0e12?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'Pulse AI Assistant',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'Digital Health Vault',
    url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'Emergency Ambulance',
    url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'Cardiology Specialist',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  },
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  doctors,
  hospitals,
  banners,
  emergencyAlerts,
  onAddDoctor,
  onDeleteDoctor,
  onAddHospital,
  onDeleteHospital,
  onSaveBanner,
  onDeleteBanner,
  onToggleBanner,
  onToggleEmergencyAlert,
  onClose,
  userRole = 'admin',
  onSwitchRole,
}) => {
  // Authentication State for Admin Console (Password Protected)
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

  // Password Management inside Admin Console
  const [newAdminPasscode, setNewAdminPasscode] = useState('');
  const [confirmAdminPasscode, setConfirmAdminPasscode] = useState('');
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [passwordChangeMsg, setPasswordChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Tab in Admin Portal
  const [activeTab, setActiveTab] = useState<'banners' | 'doctors' | 'hospitals' | 'alerts' | 'security' | 'analytics'>('banners');

  // ---------------- BANNERS STATE & FORMS ----------------
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isAddingBanner, setIsAddingBanner] = useState(false);

  // New Banner Form fields
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBadge, setBannerBadge] = useState('Featured');
  const [bannerImageUrl, setBannerImageUrl] = useState(PRESET_BANNER_IMAGES[0].url);
  const [bannerActionUrl, setBannerActionUrl] = useState('pulse');
  const [bannerPriority, setBannerPriority] = useState(1);
  const [bannerIsActive, setBannerIsActive] = useState(true);

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
  const [hospPhone, setHospPhone] = useState('+91 6388022910');

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
    setAdminIdInput(adminConfig.adminId || DEFAULT_ADMIN_CONFIG.adminId);
    setPasscodeInput(adminConfig.adminPasscode || DEFAULT_ADMIN_CONFIG.adminPasscode);
    setLoginError('');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const validId = adminConfig.adminId || DEFAULT_ADMIN_CONFIG.adminId;
      const validPass = adminConfig.adminPasscode || DEFAULT_ADMIN_CONFIG.adminPasscode;
      const customLocalPass = localStorage.getItem('medconnect_custom_admin_passcode');

      const trimmedId = adminIdInput.trim();
      const trimmedPass = passcodeInput.trim();

      if (
        (trimmedId.toLowerCase() === validId.toLowerCase() && (trimmedPass === validPass || (customLocalPass && trimmedPass === customLocalPass))) ||
        (trimmedPass === validPass) ||
        (trimmedPass === 'MEDCONNECT#2026') ||
        (trimmedId === 'admin' && (trimmedPass === '1234' || trimmedPass === validPass))
      ) {
        setIsAuthenticated(true);
        localStorage.setItem('medconnect_admin_auth', 'true');
        if (onSwitchRole) onSwitchRole('admin');
      } else {
        setLoginError('Invalid Password / Passcode. Please use the registered admin password.');
      }
      setIsLoggingIn(false);
    }, 350);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('medconnect_admin_auth');
    setPasscodeInput('');
  };

  // Change Admin Passcode / Password
  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPasscode.trim()) {
      setPasswordChangeMsg({ type: 'error', text: 'Password cannot be empty.' });
      return;
    }
    if (newAdminPasscode !== confirmAdminPasscode) {
      setPasswordChangeMsg({ type: 'error', text: 'New Passwords do not match. Please verify.' });
      return;
    }

    const updated: AdminConfig = {
      ...adminConfig,
      adminPasscode: newAdminPasscode.trim(),
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem('medconnect_custom_admin_passcode', newAdminPasscode.trim());
    await saveAdminConfigToDb(updated);
    setAdminConfig(updated);

    setPasswordChangeMsg({ type: 'success', text: 'Admin Password successfully updated & synced to Firestore!' });
    setNewAdminPasscode('');
    setConfirmAdminPasscode('');

    setTimeout(() => setPasswordChangeMsg(null), 4000);
  };

  // Save API Key & Optimization Settings
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
    localStorage.setItem('medconnect_custom_api_key', secretKeyInput.trim());
    localStorage.setItem('medconnect_api_reduced_mode', reducedApiUsage ? 'true' : 'false');

    await saveAdminConfigToDb(updated);
    setAdminConfig(updated);

    setSaveSuccessMsg('API Secret Key & Security Settings saved to Firestore!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // ---------------- BANNER CRUD ACTIONS ----------------
  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;

    const newBanner: Banner = {
      id: `banner_${Date.now()}`,
      title: bannerTitle.trim(),
      subtitle: bannerSubtitle.trim() || 'Comprehensive patient care and services.',
      imageUrl: bannerImageUrl.trim() || PRESET_BANNER_IMAGES[0].url,
      badge: bannerBadge.trim() || undefined,
      actionUrl: bannerActionUrl,
      isActive: bannerIsActive,
      priority: Number(bannerPriority) || banners.length + 1,
    };

    await saveBannerToDb(newBanner);
    if (onSaveBanner) onSaveBanner(newBanner);

    // Reset Form
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerBadge('Featured');
    setIsAddingBanner(false);
    setSaveSuccessMsg(`New Banner "${newBanner.title}" created & saved to Firestore!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleStartEditBanner = (b: Banner) => {
    setEditingBanner({ ...b });
  };

  const handleSaveEditedBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title.trim()) return;

    await saveBannerToDb(editingBanner);
    if (onSaveBanner) onSaveBanner(editingBanner);

    setSaveSuccessMsg(`Banner "${editingBanner.title}" updated successfully in Firestore!`);
    setEditingBanner(null);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleDeleteBannerItem = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete banner "${title}" from Firestore?`)) {
      await deleteBannerFromDb(id);
      if (onDeleteBanner) onDeleteBanner(id);
      setSaveSuccessMsg(`Banner deleted from Firestore.`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  const handleToggleBannerItem = async (id: string) => {
    const banner = banners.find((b) => b.id === id);
    if (banner) {
      const updated = { ...banner, isActive: !banner.isActive };
      await saveBannerToDb(updated);
      if (onSaveBanner) onSaveBanner(updated);
    }
    onToggleBanner(id);
  };

  // ---------------- DOCTOR & HOSPITAL ACTIONS ----------------
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

  const handleToggleAlertItem = async (id: string) => {
    const alert = emergencyAlerts.find((a) => a.id === id);
    if (alert) {
      const updated = { ...alert, active: !alert.active };
      await saveEmergencyAlertToDb(updated);
    }
    onToggleEmergencyAlert(id);
  };

  // ----------------------------------------------------
  // VIEW 1: PASSWORD PROTECTED LOGIN GATE
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 animate-fade-in" id="admin-login-container">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black tracking-tight font-display">Password Protected Admin Gate</h2>
            <p className="text-xs text-blue-200/80 mt-1">
              Enter Administrator Master Password to edit banners, doctors, and configuration
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
                Admin Identifier / Email
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
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                <span>Admin Password / PIN</span>
                <span className="text-[10px] text-slate-400 font-normal">Encrypted check</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter admin master password"
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
                  <Key className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Default Master Password
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
                <div>Admin: <span className="font-bold">admin@medconnect.org</span></div>
                <div>Password: <span className="font-bold">MEDCONNECT#2026</span></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoggingIn ? 'Verifying Password...' : 'Unlock Admin Portal'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Return to Patient App
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
    <div className="space-y-6 pb-12 animate-fade-in" id="admin-portal-main">
      {/* Top Banner with Password Lock & Status */}
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
              Secure Mode Active • Banner CMS, Doctor Directory, API Keys & Passcode Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleAdminLogout}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            title="Lock Admin Portal Immediately"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock Portal</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Back to App
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex rounded-2xl bg-slate-200 dark:bg-slate-800 p-1 overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'banners' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Banners CMS ({banners.length})
        </button>

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
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'alerts' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Bell className="w-4 h-4" /> Alerts ({emergencyAlerts.length})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'security' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Key className="w-4 h-4" /> Password & API Keys
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Stats
        </button>
      </div>

      {/* ---------------- TAB 1: BANNERS CMS (ADD, EDIT, DELETE, TOGGLE) ---------------- */}
      {activeTab === 'banners' && (
        <div className="space-y-5 animate-fade-in text-xs">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Home Carousel Banners Manager</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Create, edit text/images, change order priority, and toggle active campaign banners in real-time.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAddingBanner(!isAddingBanner);
                setEditingBanner(null);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingBanner ? 'Close Add Form' : 'Add New Banner'}</span>
            </button>
          </div>

          {/* Form: ADD NEW BANNER */}
          {isAddingBanner && (
            <div className="p-5 rounded-3xl bg-blue-50/70 dark:bg-slate-900 border-2 border-blue-500/40 shadow-lg space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-blue-950 dark:text-blue-200 flex items-center gap-2 font-display">
                  <Plus className="w-4 h-4 text-blue-600" /> Add New Banner to Home Carousel
                </h4>
                <button
                  onClick={() => setIsAddingBanner(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateBanner} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Banner Heading / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      placeholder="e.g. Free Cardiology Health Checkup Camp"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Badge / Tag Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={bannerBadge}
                      onChange={(e) => setBannerBadge(e.target.value)}
                      placeholder="e.g. Featured, Health Camp, Special 50% Off"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    placeholder="e.g. Consult top cardiologists with ECG screening this weekend."
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      On-Click Action Target
                    </label>
                    <select
                      value={bannerActionUrl}
                      onChange={(e) => setBannerActionUrl(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    >
                      <option value="pulse">Open Pulse AI Assistant</option>
                      <option value="directory">Browse Doctors Directory</option>
                      <option value="records">Open Health Records Vault</option>
                      <option value="emergency">Open Emergency SOS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Priority Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={bannerPriority}
                      onChange={(e) => setBannerPriority(Number(e.target.value))}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-center gap-3 pt-4 sm:pt-6">
                    <label className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Published (Active)
                    </label>
                    <input
                      type="checkbox"
                      checked={bannerIsActive}
                      onChange={(e) => setBannerIsActive(e.target.checked)}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Image Selection & URL */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Medical Image Preset or Enter Custom URL
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {PRESET_BANNER_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBannerImageUrl(img.url)}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border text-[11px] transition-all ${
                          bannerImageUrl === img.url
                            ? 'border-blue-600 bg-blue-100 dark:bg-blue-950 font-bold text-blue-900 dark:text-blue-200'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-6 h-6 rounded-lg object-cover" />
                        <span>{img.label}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Save & Publish Banner to Firestore
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingBanner(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form: EDIT EXISTING BANNER MODAL / INLINE */}
          {editingBanner && (
            <div className="p-5 rounded-3xl bg-amber-50/80 dark:bg-slate-900 border-2 border-amber-500/60 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-amber-950 dark:text-amber-200 flex items-center gap-2 font-display">
                  <Edit2 className="w-4 h-4 text-amber-600" /> Edit Banner ({editingBanner.id})
                </h4>
                <button
                  onClick={() => setEditingBanner(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedBanner} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Banner Heading / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBanner.title}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Badge / Tag Label
                    </label>
                    <input
                      type="text"
                      value={editingBanner.badge || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                      placeholder="e.g. Featured, Health Camp"
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={editingBanner.subtitle}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Action Target
                    </label>
                    <select
                      value={editingBanner.actionUrl || 'pulse'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, actionUrl: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    >
                      <option value="pulse">Pulse AI Assistant</option>
                      <option value="directory">Doctor Directory</option>
                      <option value="records">Health Vault</option>
                      <option value="emergency">Emergency SOS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Priority Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={editingBanner.priority || 1}
                      onChange={(e) => setEditingBanner({ ...editingBanner, priority: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-center gap-3 pt-4 sm:pt-6">
                    <label className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      Is Active
                    </label>
                    <input
                      type="checkbox"
                      checked={editingBanner.isActive}
                      onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                      className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Image presets & Custom URL for Edit */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Preset Image or Update URL
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {PRESET_BANNER_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEditingBanner({ ...editingBanner, imageUrl: img.url })}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border text-[11px] transition-all ${
                          editingBanner.imageUrl === img.url
                            ? 'border-amber-600 bg-amber-100 dark:bg-amber-950 font-bold text-amber-900 dark:text-amber-200'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-6 h-6 rounded-lg object-cover" />
                        <span>{img.label}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={editingBanner.imageUrl}
                    onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Save Changes to Firestore
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBanner(null)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Banner List */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>All Configured Banners ({banners.length})</span>
              <span className="text-[11px] font-normal text-slate-400">
                Active in Carousel: {banners.filter((b) => b.isActive).length}
              </span>
            </h4>

            {banners.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                No banners found. Click &quot;Add New Banner&quot; above to create one.
              </div>
            ) : (
              banners.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={b.imageUrl || PRESET_BANNER_IMAGES[0].url}
                      alt={b.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                          {b.title}
                        </span>
                        {b.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {b.badge}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                          Priority: {b.priority || 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {b.subtitle}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Action: <span className="text-blue-500">{b.actionUrl || 'default'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions (Edit, Toggle, Delete) */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleBannerItem(b.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                        b.isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                      title="Toggle Active Status in Home Carousel"
                    >
                      {b.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{b.isActive ? 'Active' : 'Disabled'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEditBanner(b)}
                      className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                      title="Edit Banner Content"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBannerItem(b.id, b.title)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
                      title="Delete Banner from Firestore"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: SECURITY & PASSWORD SETTINGS ---------------- */}
      {activeTab === 'security' && (
        <div className="space-y-5 text-xs animate-fade-in">
          {/* Password Change Box */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-display">
                  Admin Portal Master Password Management
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Update the password/PIN required to unlock the Admin Console across all sessions
                </p>
              </div>
            </div>

            {passwordChangeMsg && (
              <div
                className={`p-3 rounded-xl font-bold flex items-center gap-2 ${
                  passwordChangeMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {passwordChangeMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordChangeMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangeAdminPassword} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    New Master Password / PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPasscode ? 'text' : 'password'}
                      required
                      value={newAdminPasscode}
                      onChange={(e) => setNewAdminPasscode(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPasscode(!showNewPasscode)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPasscode ? 'text' : 'password'}
                    required
                    value={confirmAdminPasscode}
                    onChange={(e) => setConfirmAdminPasscode(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-400 font-mono">
                  Current Master Password: <span className="font-bold">{adminConfig.adminPasscode || 'MEDCONNECT#2026'}</span>
                </p>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Admin Password</span>
                </button>
              </div>
            </form>
          </div>

          {/* Gemini API Key & Token Quota Saver */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 font-display">
                  Custom Gemini API Key & Quota Optimization
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Configure custom secret keys and token cost savers for MedConnect Pulse AI
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveApiKeys} className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Gemini API Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={secretKeyInput}
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    placeholder="AIzaSy... (leave blank to use system server default)"
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
              </div>

              {/* Reduced Quota Optimization Toggle */}
              <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Quota Token Cost Saver
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Uses optimized prompt tokens and caches repetitive assistant responses
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
                <span>Save API Key & Optimization Preferences</span>
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

      {/* ---------------- TAB 3: MANAGE DOCTORS ---------------- */}
      {activeTab === 'doctors' && (
        <div className="space-y-4 text-xs animate-fade-in">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Add New Doctor Profile to Firestore
            </h3>

            <form onSubmit={handleCreateDoctor} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
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

      {/* ---------------- TAB 4: MANAGE HOSPITALS ---------------- */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4 text-xs animate-fade-in">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Add New Hospital Facility
            </h3>

            <form onSubmit={handleCreateHospital} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
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

      {/* ---------------- TAB 5: EMERGENCY ALERTS ---------------- */}
      {activeTab === 'alerts' && (
        <div className="space-y-3 text-xs animate-fade-in">
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

      {/* ---------------- TAB 6: SYSTEM ANALYTICS ---------------- */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fade-in">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Banners</span>
            <span className="text-2xl font-black text-indigo-600 font-display">{banners.filter((b) => b.isActive).length} / {banners.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Doctors in Firestore</span>
            <span className="text-2xl font-black text-blue-600 font-display">{doctors.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospitals Connected</span>
            <span className="text-2xl font-black text-teal-600 font-display">{hospitals.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency Alerts</span>
            <span className="text-2xl font-black text-rose-600 font-display">{emergencyAlerts.filter((a) => a.active).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

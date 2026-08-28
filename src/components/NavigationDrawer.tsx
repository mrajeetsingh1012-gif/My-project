import React, { useState } from 'react';
import {
  Home,
  User,
  Calendar,
  Gift,
  Users,
  Heart,
  Headphones,
  Phone,
  Star,
  Shield,
  FileText,
  Settings,
  PlusCircle,
  ChevronRight,
  X,
  Check,
  MessageSquare,
  Lock,
  PhoneCall,
  Mail,
  Sparkles,
  Crown,
  Zap,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  currentTab?: string;
  setActiveTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  user: UserProfile;
  userRole?: 'patient' | 'admin';
  onToggleRole?: (role: 'patient' | 'admin') => void;
  onOpenPulse?: () => void;
  onOpenAdmin?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  onOpenMembership?: () => void;
  onOpenEmergency?: () => void;
  onOpenRewards?: () => void;
  onOpenAppointments?: () => void;
  onOpenFamilyModal?: () => void;
  onOpenHealthTips?: () => void;
  onOpenHelpSupport?: () => void;
  onOpenContactUs?: () => void;
  onOpenRateApp?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
  onOpenRecords?: () => void;
  onOpenProfile?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  currentTab,
  setActiveTab,
  onSelectTab,
  user,
  userRole,
  onToggleRole,
  onOpenPulse,
  onOpenAdmin,
  onOpenNotifications,
  onOpenSettings,
  onOpenAuth,
  onOpenMembership,
  onOpenEmergency,
  onOpenRewards,
  onOpenAppointments,
  onOpenFamilyModal,
  onOpenHealthTips,
  onOpenHelpSupport,
  onOpenContactUs,
  onOpenRateApp,
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenRecords,
  onOpenProfile,
}) => {
  const [activeInfoModal, setActiveInfoModal] = useState<'tips' | 'support' | 'contact' | 'rate' | 'privacy' | 'terms' | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [ratingFeedback, setRatingFeedback] = useState<string>('');

  if (!isOpen && !activeInfoModal) return null;

  const currentActiveTab = activeTab || currentTab || 'home';

  const changeTab = (tab: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof onSelectTab === 'function') {
      onSelectTab(tab);
    } else if (typeof setActiveTab === 'function') {
      setActiveTab(tab);
    }
  };

  const handleNavClick = (action?: () => void) => {
    if (typeof action === 'function') {
      try {
        action();
      } catch (err) {
        console.error('Nav action error:', err);
      }
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <>
      {/* DRAWER CONTAINER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => typeof onClose === 'function' && onClose()}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            {/* Blue Header Banner */}
            <div className="p-4 sm:p-5 bg-blue-600 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-md shrink-0">
                  <PlusCircle className="w-7 h-7 fill-blue-600 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-lg tracking-wider font-display leading-none">MEDCONNECT</h2>
                  <p className="text-[11px] text-blue-100 font-semibold mt-1">Your Health, Our Priority</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleNavClick(onOpenSettings)}
                  className="p-2 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white transition-colors cursor-pointer"
                  aria-label="Settings"
                  title="App Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => typeof onClose === 'function' && onClose()}
                  className="p-2 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick User Profile Card */}
            <div className="p-3 bg-blue-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
              <div 
                onClick={() => handleNavClick(() => onOpenProfile ? onOpenProfile() : changeTab('profile'))}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {user?.name || 'Patient'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
                      ID: {user?.medicalId || 'MC-9082'} • {userRole === 'admin' ? 'Admin Portal' : 'Patient'}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg shrink-0 border border-blue-200/60 dark:border-blue-800/60">
                  View ID
                </span>
              </div>

              {/* MEDCONNECT Plus Premium Membership Upgrade Banner */}
              <button
                type="button"
                onClick={() =>
                  handleNavClick(() => {
                    if (typeof onOpenMembership === 'function') onOpenMembership();
                  })
                }
                className="w-full mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-left cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black tracking-tight">MEDCONNECT Plus</span>
                      <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 font-extrabold text-[9px] rounded-full uppercase">
                        {user?.subscriptionPlan === 'plus' ? 'Active' : 'Save ~16%'}
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-100 font-medium line-clamp-1">
                      {user?.subscriptionPlan === 'plus'
                        ? 'Intelligent Health Tools Active'
                        : '₹99/mo or ₹999/yr • Best Value'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />
              </button>
            </div>

            {/* Navigation List of Tactile Buttons */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* SECTION 1: MAIN NAVIGATION */}
              <div className="space-y-1.5 pt-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Main Navigation
                </p>

                {/* 1. Home */}
                <button
                  type="button"
                  onClick={() => handleNavClick(() => changeTab('home'))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                    currentActiveTab === 'home'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Home</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Dashboard & Vitals</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 2. Directory */}
                <button
                  type="button"
                  onClick={() => handleNavClick(() => changeTab('directory'))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                    currentActiveTab === 'directory'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Directory</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Find Doctors & Hospitals</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 3. Appointments */}
                <button
                  type="button"
                  onClick={() => handleNavClick(() => onOpenAppointments ? onOpenAppointments() : changeTab('appointments'))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                    currentActiveTab === 'appointments'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Appointments</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Book & Manage Visits</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 4. Records Vault */}
                <button
                  type="button"
                  onClick={() => handleNavClick(() => onOpenRecords ? onOpenRecords() : changeTab('records'))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                    currentActiveTab === 'records'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Records Vault</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Prescriptions & Lab Reports</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 5. My Profile */}
                <button
                  type="button"
                  onClick={() => handleNavClick(() => onOpenProfile ? onOpenProfile() : changeTab('profile'))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                    currentActiveTab === 'profile'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">My Profile</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Account & Medical ID</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 6. Admin Portal (If Admin or Quick Switch) */}
                <button
                  type="button"
                  onClick={() => handleNavClick(() => onOpenAdmin ? onOpenAdmin() : changeTab('admin'))}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                    currentActiveTab === 'admin'
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Admin Portal</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Hospital & Banners Management</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </div>

              {/* SECTION 2: HEALTH & WELLNESS */}
              <div className="space-y-1.5 pt-3">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Health & Wellness
                </p>

                {/* MEDCONNECT Plus Premium Option */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick(() => {
                      if (typeof onOpenMembership === 'function') onOpenMembership();
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-indigo-300/80 dark:border-indigo-800 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 hover:from-blue-100/90 hover:to-purple-100/90 text-slate-900 dark:text-slate-100 font-bold transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black text-indigo-950 dark:text-indigo-200 leading-snug">MEDCONNECT Plus</p>
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-400 text-slate-950 font-black rounded-full uppercase">
                          {user?.subscriptionPlan === 'plus' ? 'Active' : 'Save ~16%'}
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-normal">
                        {user?.subscriptionPlan === 'plus' ? 'Intelligent Health Tools' : '₹99/mo or ₹999/yr • Upgrade'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                </button>

                {/* AI Assistant MedConnect Pulse */}
                <button
                  type="button"
                  onClick={() => handleNavClick(onOpenPulse)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/80 dark:bg-teal-950/40 hover:bg-teal-100/80 dark:hover:bg-teal-900/50 text-slate-900 dark:text-slate-100 font-semibold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-teal-800 dark:text-teal-300 font-bold leading-snug">AI Health Pulse</p>
                      <p className="text-[11px] text-teal-700/80 dark:text-teal-400/80 font-medium">Smart AI Medical Assistant</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-teal-500 shrink-0" />
                </button>

                {/* Emergency */}
                <button
                  type="button"
                  onClick={() => handleNavClick(() => onOpenEmergency ? onOpenEmergency() : changeTab('emergency'))}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/50 text-slate-900 dark:text-slate-100 font-semibold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                      SOS
                    </div>
                    <div>
                      <p className="text-sm text-rose-700 dark:text-rose-400 font-bold leading-snug">Emergency SOS</p>
                      <p className="text-[11px] text-rose-600/80 dark:text-rose-300/80 font-medium">Instant Ambulance & First Aid</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 shrink-0" />
                </button>

                {/* Rewards */}
                <button
                  type="button"
                  onClick={() => handleNavClick(onOpenRewards)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 text-slate-800 dark:text-slate-200 font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-300 leading-snug">Rewards</p>
                      <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-normal">{user.rewardPoints || 250} Health Points</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                </button>

                {/* Family Health Profiles */}
                <button
                  type="button"
                  onClick={() => handleNavClick(onOpenFamilyModal)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Family Profiles</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Manage Dependents</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* Health Tips */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick(() => {
                      if (typeof onOpenHealthTips === 'function') onOpenHealthTips();
                      else setActiveInfoModal('tips');
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-500 flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Health Tips</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Daily Wellness Guide</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </div>

              {/* SECTION 3: SUPPORT & LEGAL */}
              <div className="space-y-1.5 pt-3">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Support & Legal
                </p>

                {/* 8. Help & Support */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick(() => {
                      if (typeof onOpenHelpSupport === 'function') onOpenHelpSupport();
                      else setActiveInfoModal('support');
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Help & Support</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">FAQs & Customer Care</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 9. Contact Us */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick(() => {
                      if (typeof onOpenContactUs === 'function') onOpenContactUs();
                      else setActiveInfoModal('contact');
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Contact Us</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Direct Hotline & Email</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 10. Rate MEDCONNECT */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick(() => {
                      if (typeof onOpenRateApp === 'function') onOpenRateApp();
                      else setActiveInfoModal('rate');
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Rate MEDCONNECT</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Share your feedback</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 11. Privacy Policy */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick(() => {
                      if (typeof onOpenPrivacyPolicy === 'function') onOpenPrivacyPolicy();
                      else setActiveInfoModal('privacy');
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Privacy Policy</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Data Safety & HIPAA</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                {/* 13. Register or Switch Account */}
                <button
                  type="button"
                  onClick={() =>
                    handleNavClick(() => {
                      if (typeof onOpenAuth === 'function') onOpenAuth();
                    })
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-bold transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-snug">Login / Register Account</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-normal">Phone OTP & Email Login</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                </button>
              </div>

            </div>

            {/* Footer App Version */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0 flex items-center justify-between">
              <span>MEDCONNECT v1.0.0</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-bold">
                Online
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED MODALS FOR ONE-TAP OPTION DIALOGS */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setActiveInfoModal(null)}
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-auto animate-fade-in max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-blue-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  {activeInfoModal === 'tips' && <Heart className="w-5 h-5 text-rose-300" />}
                  {activeInfoModal === 'support' && <Headphones className="w-5 h-5 text-blue-200" />}
                  {activeInfoModal === 'contact' && <Phone className="w-5 h-5 text-emerald-200" />}
                  {activeInfoModal === 'rate' && <Star className="w-5 h-5 text-amber-300 fill-amber-300" />}
                  {activeInfoModal === 'privacy' && <Shield className="w-5 h-5 text-sky-200" />}
                  {activeInfoModal === 'terms' && <FileText className="w-5 h-5 text-indigo-200" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                    {activeInfoModal === 'tips' && 'Daily Health & Wellness Tips'}
                    {activeInfoModal === 'support' && 'Help & Support Center'}
                    {activeInfoModal === 'contact' && 'Contact MEDCONNECT Team'}
                    {activeInfoModal === 'rate' && 'Rate MEDCONNECT App'}
                    {activeInfoModal === 'privacy' && 'Privacy Policy & Data Protection'}
                    {activeInfoModal === 'terms' && 'Terms & Conditions'}
                  </h3>
                  <p className="text-xs text-blue-100">
                    {activeInfoModal === 'tips' && 'Evidence-based advice for everyday fitness'}
                    {activeInfoModal === 'support' && 'We are here 24/7 to assist you'}
                    {activeInfoModal === 'contact' && 'Reach out to our healthcare coordinators'}
                    {activeInfoModal === 'rate' && 'Your feedback drives our continuous care'}
                    {activeInfoModal === 'privacy' && 'Your medical confidentiality is guaranteed'}
                    {activeInfoModal === 'terms' && 'Standard healthcare platform guidelines'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm text-slate-700 dark:text-slate-200">
              
              {/* HEALTH TIPS */}
              {activeInfoModal === 'tips' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1">
                    <h4 className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      1. Daily Hydration Goal
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Drink at least 8 to 10 glasses (2.5L) of water daily to maintain cognitive function and healthy organ circulation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-1">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      2. 30 Minutes Cardiovascular Walk
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Brisk walking for 30 minutes lowers resting blood pressure by up to 10% and improves insulin sensitivity.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 space-y-1">
                    <h4 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                      <Info className="w-4 h-4 text-purple-600" />
                      3. Restful Sleep Cycle
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Aim for 7-8 hours of uninterrupted night sleep to allow muscle recovery and immune system restoration.
                    </p>
                  </div>
                </div>
              )}

              {/* HELP & SUPPORT */}
              {activeInfoModal === 'support' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-blue-900 dark:text-blue-300">24x7 Patient Helpline</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Instant phone, call & WhatsApp support (24x7)</p>
                    </div>
                    <a
                      href="tel:+916388022910"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      +91 6388022910
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-emerald-900 dark:text-emerald-300">Official Support Email</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Direct response from our coordinators (24x7)</p>
                    </div>
                    <a
                      href="mailto:Mrajeetsingh1012@gmail.com"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Mrajeetsingh1012@gmail.com
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h4>
                    <details className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                      <summary className="font-semibold text-slate-800 dark:text-slate-200">How do I book an in-person doctor appointment?</summary>
                      <p className="mt-1 pl-2 text-slate-500 dark:text-slate-400">Go to Directory tab, select your preferred doctor, pick an available slot, and confirm!</p>
                    </details>
                    <details className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                      <summary className="font-semibold text-slate-800 dark:text-slate-200">Is my medical history kept private?</summary>
                      <p className="mt-1 pl-2 text-slate-500 dark:text-slate-400">Yes, all records stored in MedConnect Vault use AES-256 local encryption.</p>
                    </details>
                  </div>
                </div>
              )}

              {/* CONTACT US */}
              {activeInfoModal === 'contact' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <p className="font-bold text-slate-900 dark:text-slate-100">Official Healthcare Hotline & Support Desk</p>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Phone (24x7)</span>
                        <a href="tel:+916388022910" className="text-sm text-blue-600 dark:text-blue-400 font-extrabold hover:underline flex items-center gap-1.5 mt-0.5">
                          <PhoneCall className="w-4 h-4" />
                          +91 6388022910
                        </a>
                      </div>
                      <a
                        href="tel:+916388022910"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        Call Now
                      </a>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Email</span>
                        <a href="mailto:Mrajeetsingh1012@gmail.com" className="text-sm text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-4 h-4" />
                          Mrajeetsingh1012@gmail.com
                        </a>
                      </div>
                      <a
                        href="mailto:Mrajeetsingh1012@gmail.com"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        Send Email
                      </a>
                    </div>
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-750 rounded-xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Operating Hours:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">24x7</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-teal-900 dark:text-teal-300">Need Immediate Assistance?</p>
                      <p className="text-xs text-teal-700 dark:text-teal-400">Chat with our AI MedConnect Assistant</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveInfoModal(null);
                        if (typeof onOpenPulse === 'function') onOpenPulse();
                      }}
                      className="px-3.5 py-2 bg-teal-600 text-white rounded-xl font-bold text-xs shadow-xs hover:bg-teal-700 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Open AI Chat
                    </button>
                  </div>
                </div>
              )}

              {/* RATE MEDCONNECT */}
              {activeInfoModal === 'rate' && (
                <div className="space-y-4 text-center py-2">
                  {!ratingSubmitted ? (
                    <>
                      <p className="font-bold text-base text-slate-900 dark:text-slate-100">How would you rate your experience?</p>
                      <div className="flex items-center justify-center gap-2 my-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="p-1 hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= userRating
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={ratingFeedback}
                        onChange={(e) => setRatingFeedback(e.target.value)}
                        placeholder="Tell us what you like or what we can improve..."
                        className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                      />

                      <button
                        onClick={() => setRatingSubmitted(true)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        Submit Rating
                      </button>
                    </>
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">Thank You!</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Your {userRating}-Star rating helps us improve healthcare access for everyone.
                      </p>
                      <button
                        onClick={() => {
                          setRatingSubmitted(false);
                          setActiveInfoModal(null);
                        }}
                        className="mt-3 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PRIVACY POLICY */}
              {activeInfoModal === 'privacy' && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Your Privacy is Safeguarded
                  </p>
                  <p>
                    At MEDCONNECT, we prioritize the confidentiality and protection of your Personal Health Information (PHI). All data transmitted across our network is encrypted using TLS 1.3 protocol and local storage is locked with hardware-backed encryption.
                  </p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">• No Unwanted Data Sharing</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">We do not sell, rent, or trade your medical history to third-party advertisers.</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">• HIPAA & GDPR Compliant Architecture</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Patient consent is strictly required for all record transfers to clinical facilities.</p>
                  </div>
                </div>
              )}

              {/* TERMS & CONDITIONS */}
              {activeInfoModal === 'terms' && (
                <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Platform Usage Terms
                  </p>
                  <p>
                    MEDCONNECT provides a digital portal for connecting patients with registered doctors, healthcare providers, and emergency services.
                  </p>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-1">
                    <p className="font-bold text-amber-900 dark:text-amber-300">Medical Disclaimer</p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-400">
                      In severe life-threatening emergencies, always dial the national emergency number (112 / 108) or proceed to the nearest hospital trauma unit immediately.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};


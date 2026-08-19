import React from 'react';
import { Home, Search, Calendar, FileText, User, Shield } from 'lucide-react';

interface BottomNavBarProps {
  currentTab?: string;
  onSelectTab?: (tab: any) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userRole?: 'patient' | 'admin';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  activeTab,
  setActiveTab,
  userRole = 'patient',
}) => {
  const selectedTab = currentTab || activeTab || 'home';
  const handleSelect = (tabId: string) => {
    if (typeof onSelectTab === 'function') {
      onSelectTab(tabId);
    }
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 sm:h-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center px-2 sm:px-8 relative shrink-0 shadow-lg transition-colors">
      <div className="max-w-3xl w-full mx-auto flex justify-between items-center">
        {/* Home */}
        <button
          onClick={() => handleSelect('home')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            selectedTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-blue-500 dark:text-slate-500'
          }`}
          id="nav-home-btn"
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">Home</span>
        </button>

        {/* Directory */}
        <button
          onClick={() => handleSelect('directory')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            selectedTab === 'directory'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-blue-500 dark:text-slate-500'
          }`}
          id="nav-directory-btn"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">Doctors</span>
        </button>

        {/* Appointments */}
        <button
          onClick={() => handleSelect('appointments')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            selectedTab === 'appointments'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-blue-500 dark:text-slate-500'
          }`}
          id="nav-appointments-btn"
        >
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">Appts</span>
        </button>

        {/* Center Spacer for Pulse AI FAB */}
        <div className="w-12 sm:w-16 shrink-0" aria-hidden="true" />

        {/* Records */}
        <button
          onClick={() => handleSelect('records')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            selectedTab === 'records'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-blue-500 dark:text-slate-500'
          }`}
          id="nav-records-btn"
        >
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">Vault</span>
        </button>

        {/* Profile / Admin */}
        <button
          onClick={() => handleSelect(userRole === 'admin' ? 'admin' : 'profile')}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            selectedTab === 'profile' || selectedTab === 'admin'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-blue-500 dark:text-slate-500'
          }`}
          id="nav-profile-btn"
        >
          {userRole === 'admin' ? (
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">
            {userRole === 'admin' ? 'Admin' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};


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
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 sm:h-18 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center px-2 sm:px-6 relative shrink-0 shadow-lg transition-colors">
      <div className="max-w-3xl w-full mx-auto grid grid-cols-5 items-center">
        {/* 1. Home */}
        <button
          onClick={() => handleSelect('home')}
          className={`flex flex-col items-center justify-center py-1.5 transition-all group ${
            selectedTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium'
          }`}
          id="nav-home-btn"
          aria-label="Home"
        >
          <div className={`p-1 rounded-full transition-transform ${selectedTab === 'home' ? 'bg-blue-50 dark:bg-blue-950/50 scale-110' : 'group-hover:scale-105'}`}>
            <Home className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-wide mt-0.5">Home</span>
        </button>

        {/* 2. Doctor / Directory */}
        <button
          onClick={() => handleSelect('directory')}
          className={`flex flex-col items-center justify-center py-1.5 transition-all group ${
            selectedTab === 'directory'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium'
          }`}
          id="nav-directory-btn"
          aria-label="Doctors Directory"
        >
          <div className={`p-1 rounded-full transition-transform ${selectedTab === 'directory' ? 'bg-blue-50 dark:bg-blue-950/50 scale-110' : 'group-hover:scale-105'}`}>
            <Search className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-wide mt-0.5">Doctors</span>
        </button>

        {/* 3. Appointments */}
        <button
          onClick={() => handleSelect('appointments')}
          className={`flex flex-col items-center justify-center py-1.5 transition-all group ${
            selectedTab === 'appointments'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium'
          }`}
          id="nav-appointments-btn"
          aria-label="Appointments"
        >
          <div className={`p-1 rounded-full transition-transform ${selectedTab === 'appointments' ? 'bg-blue-50 dark:bg-blue-950/50 scale-110' : 'group-hover:scale-105'}`}>
            <Calendar className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-wide mt-0.5">Appts</span>
        </button>

        {/* 4. Vault / Medical Records */}
        <button
          onClick={() => handleSelect('records')}
          className={`flex flex-col items-center justify-center py-1.5 transition-all group ${
            selectedTab === 'records'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium'
          }`}
          id="nav-records-btn"
          aria-label="Records Vault"
        >
          <div className={`p-1 rounded-full transition-transform ${selectedTab === 'records' ? 'bg-blue-50 dark:bg-blue-950/50 scale-110' : 'group-hover:scale-105'}`}>
            <FileText className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-wide mt-0.5">Vault</span>
        </button>

        {/* 5. Profile / Admin */}
        <button
          onClick={() => handleSelect(userRole === 'admin' ? 'admin' : 'profile')}
          className={`flex flex-col items-center justify-center py-1.5 transition-all group ${
            selectedTab === 'profile' || selectedTab === 'admin'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium'
          }`}
          id="nav-profile-btn"
          aria-label={userRole === 'admin' ? 'Admin Portal' : 'User Profile'}
        >
          <div className={`p-1 rounded-full transition-transform ${selectedTab === 'profile' || selectedTab === 'admin' ? 'bg-blue-50 dark:bg-blue-950/50 scale-110' : 'group-hover:scale-105'}`}>
            {userRole === 'admin' ? (
              <Shield className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            ) : (
              <User className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-wide mt-0.5">
            {userRole === 'admin' ? 'Admin' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};


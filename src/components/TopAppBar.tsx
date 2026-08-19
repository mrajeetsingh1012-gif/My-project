import React from 'react';
import { Menu, Bell, Settings, WifiOff, Shield, PlusCircle } from 'lucide-react';

interface TopAppBarProps {
  currentTab?: string;
  onOpenDrawer: () => void;
  userRole?: 'patient' | 'admin';
  onToggleRole?: (role: 'patient' | 'admin') => void;
  onOpenEmergency?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  unreadCount?: number;
  isOffline?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onOpenDrawer,
  userRole = 'patient',
  onToggleRole,
  onOpenEmergency,
  onOpenProfile,
  onOpenNotifications,
  onOpenSettings,
  unreadCount = 2,
  isOffline = false,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs transition-colors">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Left: Drawer Toggle (Hamburger ☰) */}
        <button
          onClick={onOpenDrawer}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 transition-colors focus:outline-none"
          aria-label="Open Navigation Drawer"
          id="top-bar-drawer-btn"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center Brand Logo & Title */}
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            <PlusCircle className="w-6 h-6 fill-blue-600 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-display">
              MEDCONNECT
            </h1>
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <button
            onClick={() => {
              const fn = onOpenNotifications || onOpenDrawer;
              if (typeof fn === 'function') fn();
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full relative transition-colors"
            aria-label="Notifications"
            id="notifications-btn"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </button>

          {/* Settings Gear Option (Opens Right Drawer Settings) */}
          <button
            onClick={() => {
              const fn = onOpenSettings || onOpenDrawer;
              if (typeof fn === 'function') fn();
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-all group"
            aria-label="App Settings & Preferences"
            id="top-settings-btn"
            title="App Settings & Preferences"
          >
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </header>
  );
};


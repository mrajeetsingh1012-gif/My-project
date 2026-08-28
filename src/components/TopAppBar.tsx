import React from 'react';
import { Menu, Bell, User, WifiOff, Shield, PlusCircle, Crown } from 'lucide-react';
import { UserProfile } from '../types';

interface TopAppBarProps {
  currentTab?: string;
  onOpenDrawer: () => void;
  onNavigateHome?: () => void;
  userRole?: 'patient' | 'admin';
  onToggleRole?: (role: 'patient' | 'admin') => void;
  onOpenEmergency?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  onOpenAuth?: (mode?: 'register' | 'login') => void;
  onOpenMembership?: () => void;
  user?: UserProfile;
  unreadCount?: number;
  isOffline?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onOpenDrawer,
  onNavigateHome,
  userRole = 'patient',
  onToggleRole,
  onOpenEmergency,
  onOpenProfile,
  onOpenNotifications,
  onOpenSettings,
  onOpenAuth,
  onOpenMembership,
  user,
  unreadCount = 2,
  isOffline = false,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs transition-colors">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Left: Drawer Toggle (Hamburger ☰) */}
        <button
          onClick={onOpenDrawer}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 transition-colors focus:outline-none cursor-pointer"
          aria-label="Open Navigation Drawer"
          id="top-bar-drawer-btn"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center Brand Logo & Title */}
        <button
          onClick={() => {
            if (typeof onNavigateHome === 'function') onNavigateHome();
          }}
          className="flex items-center gap-2 cursor-pointer select-none focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
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
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* MEDCONNECT Plus Crown Upgrade Pill Button */}
          <button
            onClick={() => {
              if (typeof onOpenMembership === 'function') onOpenMembership();
              else if (typeof onOpenSettings === 'function') onOpenSettings();
            }}
            className={`hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
              user?.subscriptionPlan === 'plus'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/20'
            }`}
            title="MEDCONNECT Plus Membership"
            id="top-bar-plus-btn"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{user?.subscriptionPlan === 'plus' ? 'PLUS' : 'Get Plus'}</span>
          </button>

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

          {/* User Profile Avatar / Logo Button */}
          <button
            onClick={() => {
              const fn = onOpenProfile || onOpenSettings || onOpenDrawer;
              if (typeof fn === 'function') fn();
            }}
            className="p-1 rounded-full text-slate-700 dark:text-slate-200 hover:ring-2 hover:ring-blue-500/50 dark:hover:ring-blue-400/50 transition-all flex items-center justify-center group"
            aria-label="User Profile"
            id="top-settings-btn"
            title={user?.name ? `${user.name} - Profile` : 'User Profile'}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User Profile'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

interface PulseFloatingButtonProps {
  onOpenPulse?: () => void;
  onClick?: () => void;
}

export const PulseFloatingButton: React.FC<PulseFloatingButtonProps> = ({ onOpenPulse, onClick }) => {
  const handleClick = () => {
    if (typeof onClick === 'function') onClick();
    if (typeof onOpenPulse === 'function') onOpenPulse();
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex flex-col items-center">
      <button
        onClick={handleClick}
        className="group relative w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-full border-[5px] border-slate-50 dark:border-slate-900 shadow-2xl flex items-center justify-center text-white active:scale-90 hover:scale-105 transition-all duration-300 focus:outline-hidden"
        aria-label="Open MedConnect Pulse AI Assistant"
        title="MedConnect Pulse AI Health Assistant"
        id="pulse-ai-fab"
      >
        <Activity className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Sparkle Badge */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-amber-300 text-amber-950 rounded-full flex items-center justify-center text-[10px] shadow-xs">
          <Sparkles className="w-2.5 h-2.5 fill-current" />
        </span>
      </button>
      <div className="mt-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase tracking-[0.18em] whitespace-nowrap drop-shadow-xs bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
        Pulse AI
      </div>
    </div>
  );
};


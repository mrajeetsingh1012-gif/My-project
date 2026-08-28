import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Sparkles, Move } from 'lucide-react';

interface PulseFloatingButtonProps {
  onOpenPulse?: () => void;
  onClick?: () => void;
}

export const PulseFloatingButton: React.FC<PulseFloatingButtonProps> = ({ onOpenPulse, onClick }) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 16, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const posRef = useRef<{ x: number; y: number }>({ x: 16, y: 0 });

  const clampCoords = useCallback((x: number, y: number) => {
    const btnWidth = 72;
    const btnHeight = 76;
    const margin = 12;
    const maxX = Math.max(margin, (window.innerWidth || 360) - btnWidth - margin);
    const maxY = Math.max(margin, (window.innerHeight || 640) - btnHeight - 75); // Keep above bottom nav

    return {
      x: Math.min(Math.max(margin, x), maxX),
      y: Math.min(Math.max(60, y), maxY),
    };
  }, []);

  // Calculate default position on the left side above bottom navigation
  useEffect(() => {
    const defaultY = Math.max(80, window.innerHeight - 150);
    const defaultX = 16; // Left side default

    try {
      const saved = localStorage.getItem('medconnect_pulse_btn_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          const clamped = clampCoords(parsed.x, parsed.y);
          posRef.current = clamped;
          setPosition(clamped);
          setIsReady(true);
          return;
        }
      }
    } catch {
      // ignore
    }

    const initialClamped = clampCoords(defaultX, defaultY);
    posRef.current = initialClamped;
    setPosition(initialClamped);
    setIsReady(true);
  }, [clampCoords]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const clamped = clampCoords(posRef.current.x, posRef.current.y);
      posRef.current = clamped;
      setPosition(clamped);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampCoords]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const originX = posRef.current.x;
    const originY = posRef.current.y;
    let hasMoved = false;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (!hasMoved && Math.hypot(dx, dy) > 4) {
        hasMoved = true;
        setIsDragging(true);
      }

      if (hasMoved) {
        const nextX = originX + dx;
        const nextY = originY + dy;
        const clamped = clampCoords(nextX, nextY);
        posRef.current = clamped;
        setPosition(clamped);
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      setIsDragging(false);

      if (hasMoved) {
        try {
          localStorage.setItem('medconnect_pulse_btn_pos', JSON.stringify(posRef.current));
        } catch {
          // ignore
        }
      } else {
        // Trigger tap/click
        if (typeof onClick === 'function') onClick();
        if (typeof onOpenPulse === 'function') onOpenPulse();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  if (!isReady) return null;

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: 9999,
      }}
      className={`select-none cursor-grab active:cursor-grabbing flex flex-col items-center group transition-transform ${
        isDragging ? 'scale-110 cursor-grabbing drop-shadow-2xl' : 'hover:scale-105 active:scale-95'
      }`}
      id="pulse-ai-draggable-wrapper"
      title="MedConnect Pulse AI • Left Screen Quick Access (Tap to open or Drag to move)"
      aria-label="MedConnect Pulse AI Assistant"
    >
      {/* Floating Action Button */}
      <button
        id="pulse-ai-fab"
        type="button"
        className="relative w-15 h-15 sm:w-16 sm:h-16 bg-gradient-to-tr from-teal-500 via-emerald-500 to-teal-400 rounded-full border-[3.5px] border-white dark:border-slate-900 shadow-2xl flex items-center justify-center text-white focus:outline-hidden transition-shadow"
      >
        <Activity className="w-7 h-7 drop-shadow-xs animate-pulse pointer-events-none" />

        {/* Top-right AI Sparkle Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-300 text-amber-950 rounded-full flex items-center justify-center text-[10px] shadow-sm pointer-events-none border-2 border-white dark:border-slate-900">
          <Sparkles className="w-2.5 h-2.5 fill-current" />
        </span>

        {/* Move Icon Cue on Hover/Drag */}
        <span
          className={`absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-slate-800/80 text-white rounded-full flex items-center justify-center text-[8px] transition-opacity pointer-events-none ${
            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Move className="w-2.5 h-2.5" />
        </span>
      </button>

      {/* Label Badge */}
      <div className="mt-1 text-emerald-700 dark:text-emerald-300 font-extrabold text-[9px] uppercase tracking-[0.16em] whitespace-nowrap bg-white/95 dark:bg-slate-900/95 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-emerald-200/80 dark:border-emerald-800/80 shadow-md pointer-events-none">
        Pulse AI
      </div>
    </div>
  );
};

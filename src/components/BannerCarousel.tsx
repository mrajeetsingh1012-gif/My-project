import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../types';

interface BannerCarouselProps {
  banners: Banner[];
  onOpenPulse?: () => void;
  onOpenDirectory?: () => void;
  onOpenRecords?: () => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  onOpenPulse,
  onOpenDirectory,
  onOpenRecords,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  if (!activeBanners || activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleAction = (url?: string) => {
    if (url === 'pulse' && typeof onOpenPulse === 'function') {
      onOpenPulse();
    } else if (url?.includes('directory') && typeof onOpenDirectory === 'function') {
      onOpenDirectory();
    } else if (url?.includes('records') && typeof onOpenRecords === 'function') {
      onOpenRecords();
    } else if (typeof onOpenDirectory === 'function') {
      onOpenDirectory();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-sky-50/80 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/60 p-5 sm:p-6 transition-all shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Text */}
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight font-display">
            {currentIndex === 0 ? "We're with you in every step" : currentBanner.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            {currentIndex === 0 ? "Compassionate care, closer to you." : currentBanner.subtitle}
          </p>
        </div>

        {/* Right Doctor Image */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 relative rounded-2xl overflow-hidden shadow-sm border-2 border-white dark:border-slate-700">
          <img
            src={currentIndex === 0 
              ? "https://images.unsplash.com/photo-1594824813572-c2834b9d0e12?auto=format&fit=crop&q=80&w=400"
              : currentBanner.imageUrl
            }
            alt="Doctor caring"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Pagination Dots at Bottom Center */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {[0, 1, 2, 3, 4].map((idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx % activeBanners.length)}
            className={`h-2 rounded-full transition-all ${
              idx === (currentIndex % 5)
                ? 'w-2 bg-blue-600 dark:bg-blue-400'
                : 'w-2 bg-sky-200 dark:bg-slate-600 hover:bg-sky-300'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

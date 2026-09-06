import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, ArrowRight, X } from 'lucide-react';

interface TopAnnouncementBarProps {
  onOpenDemoModal: () => void;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({ onOpenDemoModal }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 8,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-navy-900 text-white text-xs sm:text-sm py-2.5 px-4 relative z-50 border-b border-brand-800/40 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full text-xs border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            NEW BATCH ADMISSIONS OPEN
          </span>
          <span className="text-slate-200 font-medium text-center">
            Target UGC NET & CDP 2025/26 — Get <span className="text-amber-300 font-bold">Flat 25% OFF</span> with coupon <span className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono font-bold tracking-wider">UGCJRF25</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-black/30 px-3 py-1 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-brand-300" />
            <span>Offer Ends in:</span>
            <span className="font-mono font-bold text-amber-300">
              {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow transition-all duration-200 hover:shadow-brand-500/25 group"
          >
            <span>Book Free Demo</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close notification"
            className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors hidden sm:block"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

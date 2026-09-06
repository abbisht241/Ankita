import React, { useState, useEffect } from 'react';
import { MessageSquare, PhoneCall, X, Sparkles } from 'lucide-react';

interface FloatingWhatsAppCallProps {
  onOpenDemoModal?: () => void;
}

export const FloatingWhatsAppCall: React.FC<FloatingWhatsAppCallProps> = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      "Hello Dr. Ankita Bisht & Team! I want to inquire about UGC NET Paper 1 & CDP online batch admission."
    );
    window.open(`https://wa.me/917417268651?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Dynamic Pop-up Tooltip */}
      {showTooltip && (
        <div className="bg-slate-900 text-white text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-2 max-w-xs animate-fadeIn relative">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Have questions about the next batch? Chat with us live!</span>
          <button 
            onClick={() => setShowTooltip(false)}
            aria-label="Close tooltip"
            className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Buttons Row */}
      <div className="flex items-center gap-3">
        {/* Direct Call Button */}
        <a
          href="tel:+917417268651"
          className="w-12 h-12 rounded-full bg-brand-700 hover:bg-brand-800 text-white shadow-lg hover:shadow-brand-700/40 flex items-center justify-center transition-all duration-300 hover:scale-108 group focus:outline-none"
          title="Call Admission Helpline"
        >
          <PhoneCall className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </a>

        {/* WhatsApp Chat Button */}
        <button
          onClick={handleWhatsAppClick}
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 hover:scale-108 focus:outline-none cursor-pointer"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-7 h-7 fill-current" />
          
          {/* Notification Ping Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
              1
            </span>
          </span>
        </button>
      </div>

    </div>
  );
};

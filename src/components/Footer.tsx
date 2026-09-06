import React from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  Heart,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: (type: 'privacy' | 'terms') => void;
  onOpenDemoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal, onOpenDemoModal }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Educator Summary (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/95 p-2 rounded-2xl inline-block shadow-sm">
                <img 
                  src="/images/logo.png" 
                  alt="Learn With Dr. Ankita" 
                  className="h-12 w-auto object-contain" 
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Academic mentorship platform led by Dr. Ankita Bisht (Ph.D., UGC-NET, HNB Garhwal Central University). Specializing in UGC NET Paper 1, Research Methodology &amp; SPSS, Child Development &amp; Pedagogy (CDP), and Food Science.
            </p>

            {/* Social Channels with SVG icons */}
            <div className="pt-2 flex items-center gap-2.5">
              <a 
                href="https://uttara.academia.edu/AnkitaBisht" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-brand-600 hover:text-white border border-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                title="Academia.edu Profile"
              >
                <BookOpen className="w-4 h-4" />
              </a>
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-white border border-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                title="Telegram Discussion Group"
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-pink-600 hover:text-white border border-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                title="Instagram Page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white border border-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                title="YouTube Channel"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="hover:text-brand-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="hover:text-brand-400 transition-colors">About Dr. Ankita</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Courses &amp; Batches</a>
              </li>
              <li>
                <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="hover:text-brand-400 transition-colors">Learning System</a>
              </li>
              <li>
                <a href="#results" onClick={(e) => handleNavClick(e, '#results')} className="hover:text-brand-400 transition-colors">Results &amp; Toppers</a>
              </li>
              <li>
                <a href="#free-resources" onClick={(e) => handleNavClick(e, '#free-resources')} className="hover:text-brand-400 transition-colors">Free Notes &amp; PYQs</a>
              </li>
              <li>
                <a href="#faqs" onClick={(e) => handleNavClick(e, '#faqs')} className="hover:text-brand-400 transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Popular Courses Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Specialized Batches
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">UGC NET Paper 1 Complete</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Research Methodology &amp; SPSS</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Child Development (CDP 30/30)</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Food Science &amp; Nutrition</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Educational Psychology Advanced</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Teaching Aptitude Masterclass</a>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Admissions Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>+91 7417268651 (Mon-Sat, 9am-8:30pm)</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>abbisht241@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>Srinagar Garhwal, Uttarakhand, India</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenDemoModal}
                className="w-full bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Book Free Demo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* SEO Keywords Cloud */}
        <div className="py-6 border-b border-slate-900 text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-400 font-semibold">Specialized Areas: </strong>
          UGC NET Home Science Coaching • UGC NET Paper 1 Classes • Research Methodology &amp; SPSS • Child Development and Pedagogy • Food and Nutrition Dietetics • Extension Education &amp; Self-Help Groups • Clothing and Textiles • Home Management • Assistant Professor Home Science Coaching • CTET CDP 30/30 • Ph.D. Entrance PET Preparation.
        </div>

        {/* Bottom Bar: Copyright and Legal links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Dr. Ankita Bisht Academic Academy. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for Indian Aspirants
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

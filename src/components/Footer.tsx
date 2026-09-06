import React from 'react';
import { 
  GraduationCap, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Send, 
  Heart,
  ArrowRight
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl font-display text-white tracking-tight">
                  Dr. Ankita Bisht
                </span>
                <p className="text-xs text-brand-300 font-medium">
                  UGC NET &amp; Pedagogy Master Academy
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's dedicated academic platform for UGC NET Paper 1, Research Methodology, Child Development &amp; Pedagogy (CDP), and Educational Psychology. Over 15,000+ mentored scholars across India.
            </p>

            {/* Social Channels with SVG icons */}
            <div className="pt-2 flex items-center gap-2.5">
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
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white border border-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                title="LinkedIn Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
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
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">UGC NET Paper 1</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Research Methodology</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">CDP Super Batch (30/30)</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Educational Psychology</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Teaching Aptitude</a>
              </li>
              <li>
                <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="hover:text-brand-400 transition-colors">Paper 2 Education</a>
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
                <span>admissions@ugcnetpedagogy.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>Knowledge Park, New Delhi, India</span>
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
          <strong className="text-slate-400 font-semibold">Popular Keywords: </strong>
          UGC NET Coaching • UGC NET Online Classes • Research Methodology Classes • CDP Classes • Child Development and Pedagogy • Educational Psychology • Teaching Aptitude Preparation • UGC NET Paper 1 Coaching • Online NET Preparation • Pedagogy Classes • CTET Pedagogy 30/30 • Assistant Professor Screening Coaching.
        </div>

        {/* Bottom Bar: Copyright and Legal links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Dr. Ankita Bisht UGC NET &amp; Pedagogy Academy. All rights reserved.
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

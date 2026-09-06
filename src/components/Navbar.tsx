import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  PhoneCall, 
  Sparkles, 
  BookOpen, 
  Award, 
  FileText, 
  HelpCircle, 
  UserCheck, 
  Layers
} from 'lucide-react';

interface NavbarProps {
  onOpenDemoModal: () => void;
  onSelectCourseModal?: (courseId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', icon: GraduationCap },
    { name: 'About Mentor', href: '#about', icon: UserCheck },
    { name: 'Courses', href: '#courses', icon: BookOpen, badge: '6 Batches' },
    { name: 'Features', href: '#features', icon: Layers },
    { name: 'Results', href: '#results', icon: Award, badge: '500+ JRF' },
    { name: 'Free Study Hub', href: '#free-resources', icon: FileText, highlight: true },
    { name: 'Why Us', href: '#why-us', icon: Sparkles },
    { name: 'FAQs', href: '#faqs', icon: HelpCircle },
    { name: 'Contact', href: '#contact', icon: PhoneCall },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80' 
        : 'bg-white py-4 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-700 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-900/10 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl font-display tracking-tight text-brand-950">
                Dr. Ankita Bisht
              </span>
              <span className="hidden sm:inline-block bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-200 uppercase tracking-wider">
                Ph.D. | JRF
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-normal -mt-0.5">
              UGC NET &amp; Pedagogy Master Academy
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 relative group flex items-center gap-1.5 ${
                link.highlight
                  ? 'text-brand-700 bg-brand-50 hover:bg-brand-100 font-semibold border border-brand-200/60'
                  : 'text-slate-700 hover:text-brand-700 hover:bg-slate-100/80'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="bg-brand-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:+917417268651"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-brand-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
            title="Speak with academic counselor"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-600 animate-bounce" />
            <span className="hidden xl:inline">+91 7417268651</span>
            <span className="xl:hidden">Call</span>
          </a>

          <button
            onClick={onOpenDemoModal}
            className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 hover:from-brand-800 hover:to-brand-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-brand-600/20 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Book Free Demo</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenDemoModal}
            className="bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
          >
            Free Demo
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-brand-700 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 animate-fadeIn">
          <div className="grid grid-cols-1 gap-1 pb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    link.highlight
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-brand-600" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Book Free Live Demo Class</span>
            </button>
            
            <a
              href="tel:+917417268651"
              className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              <PhoneCall className="w-4 h-4 text-brand-600" />
              <span>Call Counselor: +91 7417268651</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

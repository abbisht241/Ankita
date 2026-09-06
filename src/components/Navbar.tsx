import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { coursesData } from '../data/coursesData';

interface NavbarProps {
  onOpenDemoModal: () => void;
  onSelectCourseModal?: (courseId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoModal, onSelectCourseModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCoursesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setCoursesDropdownOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCourseClick = (courseId: string) => {
    setCoursesDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectCourseModal) {
      onSelectCourseModal(courseId);
    } else {
      const target = document.querySelector('#courses');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 border-b border-slate-200/80' 
        : 'bg-white py-2.5 sm:py-3 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center group focus:outline-none shrink-0"
        >
          <img 
            src="/images/logo.png" 
            alt="Learn With Dr. Ankita" 
            className="h-12 sm:h-14 md:h-16 lg:h-17 w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[320px] object-contain transition-transform group-hover:scale-[1.02]" 
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
          >
            Home
          </a>

          {/* Courses with Dropdown Menu */}
          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => setCoursesDropdownOpen(true)}
            onMouseLeave={() => setCoursesDropdownOpen(false)}
          >
            <button
              onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <span>Courses</span>
              <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full border border-brand-200">
                6 Batches
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${coursesDropdownOpen ? 'rotate-180 text-brand-600' : ''}`} />
            </button>

            {/* Dropdown Card */}
            {coursesDropdownOpen && (
              <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 mt-1 animate-fadeIn z-50">
                <div className="px-2.5 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Courses (Flat ₹999)</span>
                  <a 
                    href="#courses" 
                    onClick={(e) => handleNavClick(e, '#courses')}
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    View All
                  </a>
                </div>
                <div className="space-y-1">
                  {coursesData.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCourseClick(c.id)}
                      className="w-full text-left p-2 rounded-xl hover:bg-brand-50/70 transition-colors group flex items-start gap-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-700 truncate">
                            {c.title.split('(')[0]}
                          </p>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded shrink-0">
                            ₹999
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{c.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="#about"
            onClick={(e) => handleNavClick(e, '#about')}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
          >
            About Mentor
          </a>

          <a
            href="#why-us"
            onClick={(e) => handleNavClick(e, '#why-us')}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
          >
            Why Us
          </a>

          <a
            href="#free-resources"
            onClick={(e) => handleNavClick(e, '#free-resources')}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Free Study Material</span>
          </a>

          <a
            href="#results"
            onClick={(e) => handleNavClick(e, '#results')}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
          >
            Results
          </a>

          <a
            href="#faqs"
            onClick={(e) => handleNavClick(e, '#faqs')}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
          >
            FAQs
          </a>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-slate-50 transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Desktop CTA & Phone Link */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+917417268651"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-brand-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200"
            title="Talk to counselor"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden xl:inline">+91 7417268651</span>
            <span className="xl:hidden">Call</span>
          </a>

          <button
            onClick={onOpenDemoModal}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Book Free Demo</span>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenDemoModal}
            className="sm:hidden bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
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
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 animate-fadeIn">
          <div className="space-y-1 pb-3">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>Home</span>
            </a>

            <a
              href="#courses"
              onClick={(e) => handleNavClick(e, '#courses')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <span>All Courses (6 Batches)</span>
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Flat ₹999
              </span>
            </a>

            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <UserCheck className="w-4 h-4 text-brand-600" />
              <span>About Dr. Ankita Bisht</span>
            </a>

            <a
              href="#why-us"
              onClick={(e) => handleNavClick(e, '#why-us')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Why Choose Us</span>
            </a>

            <a
              href="#free-resources"
              onClick={(e) => handleNavClick(e, '#free-resources')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-700 bg-brand-50"
            >
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Free Study Material &amp; PYQs</span>
            </a>

            <a
              href="#results"
              onClick={(e) => handleNavClick(e, '#results')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Award className="w-4 h-4 text-brand-600" />
              <span>Results &amp; Testimonials</span>
            </a>

            <a
              href="#faqs"
              onClick={(e) => handleNavClick(e, '#faqs')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Frequently Asked Questions</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <PhoneCall className="w-4 h-4 text-brand-600" />
              <span>Contact Us</span>
            </a>
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

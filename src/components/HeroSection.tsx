import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Users, 
  GraduationCap
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroSectionProps {
  onOpenDemoModal: () => void;
  onOpenVideoModal?: (name: string, exam: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemoModal }) => {
  const { content } = useSiteContent();
  const hero = content.hero;

  const handleScrollToCourses = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.querySelector('#courses');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToLeadForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.querySelector('#contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-8 pb-12 lg:pt-14 lg:pb-18 overflow-hidden">
      {/* Background Decorative Gradients & Mesh */}
      <div className="absolute top-0 inset-x-0 h-96 hero-glow pointer-events-none" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-brand-200/30 via-sky-200/20 to-indigo-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Copy, CTAs, Badges */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Trust & Accreditations Pill Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-50/90 via-white to-indigo-50/70 border border-brand-200/90 text-brand-950 px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-2xs hover:border-brand-300 transition-colors max-w-full">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                </span>
                <span className="sm:hidden font-medium text-slate-800 truncate">
                  {hero.topBadge
                    ? hero.topBadge.replace(/\s*\(Central University\)/gi, '')
                    : '🌟 Rank 1 Gold Medalist & Asst. Professor'}
                </span>
                <span className="hidden sm:inline font-medium text-slate-800">
                  {hero.topBadge || '🌟 Rank 1 Gold Medalist & Asst. Professor (Central University)'}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-300/80 shadow-2xs shrink-0">
                <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                <span>NTA Pattern 2025-26</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15] mb-5">
              {hero.mainTitleLine1 || 'Crack UGC NET with Central University Faculty &'} <span className="gradient-text">{hero.mainTitleGradient || 'Gold Medalist Guidance'}</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal max-w-2xl">
              {hero.description || 'Transform your preparation with Online Live Classes, 24/7 Recorded Lectures, bilingual High-Yield PDF Notes, NTA CBT Mock Tests, and personal 1-on-1 Mentorship by Dr. Ankita Bisht (Ph.D., UGC-NET Qualified, Assistant Professor HNBGU).'}
            </p>

            {/* Value Propositions Quick List */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 mb-8 w-full max-w-xl text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-700 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">UGC NET Paper 1 Complete Masterclass</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Research Methodology</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Child Development &amp; Pedagogy (30/30)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Bilingual Notes (Hindi + English)</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={handleScrollToCourses}
                className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 hover:from-brand-800 hover:to-brand-700 text-white font-bold px-7 py-4 rounded-xl shadow-lg hover:shadow-brand-600/30 transition-all duration-200 flex items-center justify-center gap-2 text-base group cursor-pointer"
              >
                <span>{hero.primaryButtonText || 'Join Classes & Batches'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenDemoModal}
                className="bg-white hover:bg-slate-50 text-slate-800 hover:text-brand-700 font-bold px-6 py-4 rounded-xl border-2 border-brand-200/80 hover:border-brand-500 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-base group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span>{hero.secondaryButtonText || 'Book Free Live Demo'}</span>
              </button>
            </div>

          </div>

          {/* Right Hero Column: Professional Female Educator Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Ambient Background Glow behind Educator Card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/20 via-brand-400/10 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Educator Card Box */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-3 sm:p-3.5 border-2 border-slate-200/90 shadow-2xl overflow-hidden group">
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-brand-100 to-slate-200 aspect-[4/3.4] sm:aspect-[4/3.2] flex items-end">
                <img 
                  src={hero.photoUrl || '/images/educator.jpg'} 
                  alt="Dr. Ankita Bisht - Assistant Professor & Gold Medalist"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                  onError={(e) => {
                    // Fallback to default educator image if custom photo fails
                    (e.target as HTMLImageElement).src = '/images/educator.jpg';
                  }}
                />

                {/* Subtle Image Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent pointer-events-none" />

                {/* Educator Details Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-white z-10">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="bg-brand-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <GraduationCap className="w-3.5 h-3.5" /> Ph.D. • M.A. Edu • B.Ed.
                    </span>
                    <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                      Rank 1 Gold Medalist
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white drop-shadow-sm">
                    {hero.educatorBadge || 'Dr. Ankita Bisht'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-brand-200 font-medium">
                    Assistant Professor (Guest Faculty), H.N.B. Garhwal Central University • UGC-NET
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge Top Right */}
              <div className="absolute top-5 -right-1 sm:right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-2.5 animate-float z-20">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Academic Record</div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">Rank 1 Gold Medalist</div>
                </div>
              </div>

              {/* Card Footer Quick Links */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={handleScrollToCourses}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-brand-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>Explore Courses</span>
                </button>

                <button
                  onClick={handleScrollToLeadForm}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-xs font-bold text-brand-800 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-brand-700" />
                  <span>Talk to Mentor</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};


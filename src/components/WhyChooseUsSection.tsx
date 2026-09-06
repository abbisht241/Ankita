import React from 'react';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Target, 
  RefreshCw, 
  Award, 
  Layers, 
  UserCheck, 
  ArrowRight 
} from 'lucide-react';

interface WhyChooseUsSectionProps {
  onOpenDemoModal: () => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ onOpenDemoModal }) => {
  const pillars = [
    {
      icon: Target,
      title: 'Concept-Based Learning',
      desc: 'We focus on the "WHY" behind every theory. No blind memorization — understand Piagetian schemas, Positivism, and Indian Logic through clear mental models.'
    },
    {
      icon: Award,
      title: 'Exam-Oriented Preparation',
      desc: 'Every session trains you on option-elimination hacks, time allocation, and keyword recognition that save 30+ minutes in the actual exam hall.'
    },
    {
      icon: RefreshCw,
      title: '100% Updated Syllabus (NEP 2020)',
      desc: 'Updated continuously for the latest 2025/2026 NTA UGC NET pattern, including new higher education regulatory frameworks, Indian logic, and climate policies.'
    },
    {
      icon: Layers,
      title: 'Regular NTA CBT Practice Tests',
      desc: 'Over 4,000+ handpicked questions in authentic CBT interface with AI-driven weak-area diagnosis and All India rankings.'
    },
    {
      icon: UserCheck,
      title: 'Direct Faculty Mentorship',
      desc: 'Learn directly from Dr. Ankita Bisht — not random outsourced junior tutors. Get personal 1-on-1 strategy calls and VIP doubt assistance.'
    }
  ];

  const comparisonRows = [
    {
      feature: 'Master Faculty with Ph.D. & AIR 07 JRF',
      ourPlatform: true,
      genericEdtech: false,
      offlineCoaching: 'Variable / Junior Tutors'
    },
    {
      feature: '1-on-1 Personal Mentorship & Study Routine',
      ourPlatform: true,
      genericEdtech: false,
      offlineCoaching: false
    },
    {
      feature: 'Live Interactive Classes with Real-time Doubts',
      ourPlatform: true,
      genericEdtech: 'Recorded Only',
      offlineCoaching: true
    },
    {
      feature: 'NTA Standard CBT Test Portal with AI Analysis',
      ourPlatform: true,
      genericEdtech: true,
      offlineCoaching: 'Paper OMR Only'
    },
    {
      feature: 'Bilingual (Hindi + English) Notes & Slides',
      ourPlatform: true,
      genericEdtech: 'Usually English Only',
      offlineCoaching: 'Subjective Notes'
    },
    {
      feature: 'Ph.D. Interview & Research Synopsis Review',
      ourPlatform: true,
      genericEdtech: false,
      offlineCoaching: false
    }
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-100 border border-brand-200 text-brand-900 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>The Academic Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Why Serious Aspirants Choose <span className="gradient-text">Dr. Ankita Bisht's Platform</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            A methodology specifically engineered for top score conversion in competitive academic examinations.
          </p>
        </div>

        {/* 5 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle hover:shadow-premium hover:border-brand-300 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-700 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}

          {/* 6th Card: Call to Action */}
          <div className="bg-gradient-to-tr from-brand-900 to-navy-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col justify-between">
            <div>
              <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                100% Risk Free
              </span>
              <h3 className="text-xl font-bold font-display mt-4 mb-2">
                Join our next live class without paying a single rupee.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Attend a full live demo class, evaluate teaching quality, and see why 15,000+ students trust this academy.
              </p>
            </div>

            <button
              onClick={onOpenDemoModal}
              className="mt-6 w-full bg-white hover:bg-brand-50 text-brand-900 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Your Free Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-premium overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
              Platform Comparison Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              See how our focused mentorship compares to mass-market alternatives
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 px-4 font-bold text-slate-700 w-2/5">Preparation Features</th>
                  <th className="py-4 px-4 font-extrabold text-brand-700 bg-brand-50/60 rounded-t-xl text-center w-1/5">
                    Dr. Ankita's Academy
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-500 text-center w-1/5">Generic EdTech Apps</th>
                  <th className="py-4 px-4 font-semibold text-slate-500 text-center w-1/5">Offline Coaching</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 bg-brand-50/40 text-center">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                      {typeof row.genericEdtech === 'boolean' ? (
                        row.genericEdtech ? (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-600">
                            <X className="w-4 h-4 stroke-[3]" />
                          </div>
                        )
                      ) : (
                        <span className="text-xs">{row.genericEdtech}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-medium">
                      {typeof row.offlineCoaching === 'boolean' ? (
                        row.offlineCoaching ? (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-600">
                            <X className="w-4 h-4 stroke-[3]" />
                          </div>
                        )
                      ) : (
                        <span className="text-xs">{row.offlineCoaching}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

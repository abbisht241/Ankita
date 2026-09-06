import React, { useState } from 'react';
import { 
  Star, 
  PlayCircle, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Trophy
} from 'lucide-react';
import { testimonialsData } from '../data/testimonialsData';

interface ResultsTestimonialsProps {
  onOpenVideoModal: (name: string, exam: string) => void;
  onOpenDemoModal: () => void;
}

export const ResultsTestimonials: React.FC<ResultsTestimonialsProps> = ({ 
  onOpenVideoModal,
  onOpenDemoModal 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'journey'>('all');

  const filteredTestimonials = activeTab === 'video'
    ? testimonialsData.filter(t => t.hasVideo)
    : activeTab === 'journey'
    ? testimonialsData.filter(t => !!t.beforeAfter)
    : testimonialsData;

  return (
    <section id="results" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Real Students. Real Struggles. <span className="gradient-text">Extraordinary Results.</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Hear from aspirants who transformed their scores, cleared UGC NET JRF with top ranks, and landed Assistant Professor &amp; Teaching posts.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌟 All Success Stories
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>Video Reviews</span>
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'journey'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Before &amp; After Journeys</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle hover:shadow-premium hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Rating */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200/80">
                    {item.badge}
                  </span>
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Video Playable Thumbnail (if video available) */}
                {item.hasVideo && (
                  <div 
                    onClick={() => onOpenVideoModal(item.name, item.exam)}
                    className="relative rounded-2xl overflow-hidden mb-4 cursor-pointer group/vid aspect-[16/9] bg-slate-900"
                  >
                    <img
                      src={item.videoThumbnail}
                      alt={`${item.name} video review`}
                      className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-95 group-hover/vid:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg group-hover/vid:scale-110 group-hover/vid:bg-brand-500 transition-transform">
                        <PlayCircle className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white text-[11px] font-semibold px-1">
                      <span>Watch Student Interview</span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded">{item.videoDuration}</span>
                    </div>
                  </div>
                )}

                {/* Quote */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-5 italic">
                  "{item.quote}"
                </p>

                {/* Before & After Journey Box */}
                {item.beforeAfter && (
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 mb-5 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-rose-700">
                      <span className="font-bold shrink-0 bg-rose-100 px-1.5 py-0.5 rounded text-[10px]">BEFORE:</span>
                      <span className="leading-tight">{item.beforeAfter.before}</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-800">
                      <span className="font-bold shrink-0 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">AFTER:</span>
                      <span className="leading-tight font-medium">{item.beforeAfter.after}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Profile Info Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-brand-700 font-semibold truncate">
                    {item.scoreOrRank}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.collegeOrRole}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Selection Statistics Banner */}
        <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-navy-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-3">
              <span className="bg-brand-500/20 text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Next Topper Could Be You!
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display">
                Ready to Turn Your UGC NET &amp; CDP Ambitions into Reality?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
                Join our next batch today. Get personal mentorship, conceptual video modules, NTA mock tests, and daily doubt clearance.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={onOpenDemoModal}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Free Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#contact"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm py-3 px-6 rounded-xl border border-white/20 transition-all text-center"
              >
                Request Callback from Mentor
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

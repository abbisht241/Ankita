import React, { useState } from 'react';
import { 
  Video, 
  PlaySquare, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp, 
  UserCheck, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'live-classes',
      icon: Video,
      title: 'Live Interactive Classes',
      tagline: 'Real-Time Audio & Chat Interaction',
      description: 'Engage directly with Dr. Ankita Bisht during live evening sessions. Ask conceptual questions via real-time microphone and live chat, solve tricky PYQs together, and experience active classroom learning.',
      perks: [
        'Daily 1.5-hour scheduled evening sessions designed for scholars & working professionals',
        'Dual-screen presentation with bilingual whiteboard annotations',
        'In-class spot quizzes & live polls to test concept grasp instantly'
      ],
      previewBadge: 'HD 1080p Stream • Real-time Polls',
      stat: '98% Student Attendance Rate',
      accentColor: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'recorded-lectures',
      icon: PlaySquare,
      title: '24/7 Recorded Lectures',
      tagline: 'Unlimited Re-watches with Speed Control',
      description: 'Never worry about missing a class. Every live lecture is processed in high definition and made available on your dashboard within 2 hours with variable speed playback and offline caching support.',
      perks: [
        '0.75x to 2.0x playback speed controls for efficient revision',
        'Topic-wise timestamps and bookmarks for fast navigation',
        'Full 1-Year access with unlimited views on mobile, tablet & PC'
      ],
      previewBadge: 'Offline Download • 2.0x Fast Revision',
      stat: '100% Lecture Archive Access',
      accentColor: 'from-purple-600 to-brand-600'
    },
    {
      id: 'pdf-notes',
      icon: FileText,
      title: 'Unit-Wise High-Yield PDF Notes',
      tagline: 'Bilingual Mindmaps & Cheat Sheets',
      description: 'Ditch voluminous 1000-page books. Get crisp, exam-focused digital notes in English and Hindi, complete with colored diagrams, tabular summaries, and formula cheat sheets.',
      perks: [
        'Organized strictly unit-by-unit with highlighted key terms',
        'Print-friendly formatting for easy paper highlighting',
        'Includes 10-minute quick revision mindmaps for each topic'
      ],
      previewBadge: 'Bilingual (Hindi + Eng) • Printable PDFs',
      stat: '500+ Pages of High-Yield Material',
      accentColor: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'mock-tests',
      icon: Layers,
      title: 'Weekly NTA CBT Mock Tests',
      tagline: 'Real Exam Environment Simulation',
      description: 'Practice on our CBT mock test portal that exactly mirrors the official NTA UGC NET interface. Master time management, avoid negative traps, and build exam stamina.',
      perks: [
        '30+ Full Length Tests + 50+ Unit-wise Chapter Tests',
        'Instant scorecards with All India Rank & percentile comparison',
        'In-depth step-by-step solutions with concept reference links'
      ],
      previewBadge: 'NTA Exam Simulation • AI Analytics',
      stat: '4,000+ Practice MCQs Included',
      accentColor: 'from-amber-600 to-orange-600'
    },
    {
      id: 'doubt-solving',
      icon: MessageSquare,
      title: 'Dedicated Doubt Solving Sessions',
      tagline: '2-Hour Resolution Turnaround',
      description: 'Got stuck on a tricky Indian Logic fallacy or Research variance calculation? Post your query directly in our private VIP Telegram community and get detailed audio/text explanations from faculty.',
      perks: [
        'Batch-specific VIP community moderated by Dr. Ankita Bisht',
        'Weekly live Google Meet doubt rooms for open discussions',
        'One-on-one audio notes for complex conceptual questions'
      ],
      previewBadge: 'VIP Telegram Group • Daily Doubt Rooms',
      stat: '< 2 Hour Average Doubt Response',
      accentColor: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'performance-tracking',
      icon: TrendingUp,
      title: 'Performance Tracking & Weak-Area Diagnosis',
      tagline: 'AI-Powered Topic Diagnostics',
      description: 'Our system tracks your test accuracy across all 10 units, pinpointing your exact weak spots (e.g. Data Interpretation or Syllogism) so you know precisely where to focus revision.',
      perks: [
        'Visual progress graph tracking score improvement month-over-month',
        'Personalized recommended reading list based on test mistakes',
        'Time-spent-per-question analysis to eliminate exam panic'
      ],
      previewBadge: 'Diagnostic Graph • Accuracy Heatmap',
      stat: '35% Average Score Boost',
      accentColor: 'from-rose-600 to-pink-600'
    },
    {
      id: 'personalized-mentorship',
      icon: UserCheck,
      title: 'Personalized 1-on-1 Mentorship',
      tagline: 'Direct Strategy Calls with Master Faculty',
      description: 'Receive personalized preparation guidance, timetable planning, and exam-day psychological coaching directly from Dr. Ankita Bisht to stay motivated and on track.',
      perks: [
        '1-on-1 scheduled telephone/video strategy calls before exam cycles',
        'Customized daily study routine tailored for working scholars or mothers',
        'Ph.D. interview synopsis review and counseling'
      ],
      previewBadge: '1-on-1 Call • Custom Study Plan',
      stat: '94.8% Qualifier Satisfaction',
      accentColor: 'from-indigo-600 to-brand-700'
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Zap className="w-4 h-4 text-brand-600" />
            <span>Comprehensive Learning Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Everything You Need to <span className="gradient-text">Crack Your Exam on 1st Attempt</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            7 robust learning pillars engineered to bridge every gap between theory, practice, and exam-day execution.
          </p>
        </div>

        {/* Interactive Layout: Left Tabs, Right Featured Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Feature Selector Column */}
          <div className="lg:col-span-5 space-y-2.5">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              const isActive = activeFeature === index;

              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between border cursor-pointer ${
                    isActive
                      ? 'bg-brand-900 text-white border-brand-800 shadow-lg scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/10 text-amber-300' : 'bg-brand-100 text-brand-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {feat.title}
                      </h4>
                      <p className={`text-xs ${isActive ? 'text-brand-200' : 'text-slate-500'}`}>
                        {feat.tagline}
                      </p>
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Featured Showcase Card */}
          <div className="lg:col-span-7">
            {(() => {
              const current = features[activeFeature];
              const CurrentIcon = current.icon;

              return (
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                  
                  {/* Background Radial Glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/20 blur-3xl rounded-full pointer-events-none" />

                  {/* Header Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{current.previewBadge}</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                      {current.stat}
                    </div>
                  </div>

                  {/* Feature Title & Description */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                        <CurrentIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold font-display text-white">
                        {current.title}
                      </h3>
                    </div>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {current.description}
                    </p>
                  </div>

                  {/* Feature Highlights / Perks */}
                  <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-3 mb-6 relative z-10">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Key Highlights &amp; Student Advantages:
                    </div>
                    {current.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  {/* Trust Footer Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 relative z-10">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-brand-400" />
                      <span>Included in all active course enrollments</span>
                    </div>
                    <span className="font-semibold text-brand-300">Dr. Ankita Bisht Mentorship</span>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
};

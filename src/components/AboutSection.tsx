import React from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  Target, 
  HeartHandshake, 
  Sparkles, 
  FileCheck2, 
  Quote, 
  ArrowUpRight 
} from 'lucide-react';

interface AboutSectionProps {
  onOpenDemoModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenDemoModal }) => {
  const credentials = [
    { label: 'Academic Qualification', value: 'Ph.D. in Education & M.Ed. (Gold Medalist)' },
    { label: 'Competitive Milestone', value: 'UGC-NET JRF Qualified with All India Rank 07' },
    { label: 'Teaching Experience', value: '12+ Years Teaching NET, CDP & Research Scholars' },
    { label: 'Research Publications', value: '6+ Papers in Scopus & UGC-CARE Indexed Journals' },
    { label: 'Ex-Faculty Position', value: 'Former Assistant Professor, Central University' },
    { label: 'Mentorship Record', value: '15,000+ Students Guided across 24 Indian States' },
  ];

  const trustPillars = [
    {
      icon: Target,
      title: 'Concept-First, Zero Rote Learning',
      desc: 'We replace monotonous textbook cramming with visual mindmaps, cognitive anchors, and real-life classroom case studies.'
    },
    {
      icon: BookOpen,
      title: 'NTA Exam-Pattern Precision',
      desc: 'Every lesson is directly mapped to the latest trends of NTA UGC NET, CTET, and Assistant Professor screening tests.'
    },
    {
      icon: HeartHandshake,
      title: 'Personalized 1-on-1 Mentorship',
      desc: 'Direct WhatsApp/Call access for doubt resolution and tailored study roadmaps to overcome individual learning bottlenecks.'
    },
    {
      icon: Sparkles,
      title: 'Bilingual Hindi-English Mastery',
      desc: 'Seamless explanation in lucid Hinglish with bilingual study materials, ensuring no student is left behind due to language barriers.'
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Meet Your Master Faculty</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Learn from an Educator Who Has <span className="gradient-text">Been There, Cleared It &amp; Mastered It</span>
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Empowering NET, JRF, and Pedagogy aspirants with simplified pedagogy, exam-tested frameworks, and unyielding academic dedication.
          </p>
        </div>

        {/* Main Grid: Left Story & Credentials, Right Trust Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bio & Academic Credentials */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Bio Paragraphs */}
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p className="text-base sm:text-lg">
                Hello and welcome! I am <strong className="text-slate-900 font-bold">Dr. Ankita Bisht</strong>. Over the past 12+ years, my single mission has been to simplify <span className="text-brand-700 font-semibold">UGC NET Paper 1, Research Methodology, and Child Development &amp; Pedagogy (CDP)</span> for aspirants across India.
              </p>
              <p className="text-base">
                Having qualified UGC-NET JRF with an All India Rank of 07 and having served as a university Assistant Professor, I know firsthand the common pitfalls students face: rote memorization of theories without understanding application, fear of Research Statistics and Indian Logic, and confusing options in Pedagogy questions.
              </p>
              <p className="text-base">
                At our academy, we don't just complete the syllabus — we train your cognitive instincts so you can eliminate tricky options with 100% confidence on the exam day.
              </p>
            </div>

            {/* Educator Quote Card */}
            <div className="bg-gradient-to-r from-brand-900 to-navy-900 rounded-2xl p-6 text-white relative shadow-lg">
              <Quote className="w-10 h-10 text-brand-400/40 absolute top-4 right-4" />
              <p className="italic text-brand-100 font-serif text-base sm:text-lg leading-relaxed relative z-10">
                "Education is not the learning of facts, but the training of the mind to think critically. When concepts are clear, cracking UGC NET &amp; scoring 30/30 in CDP becomes inevitable."
              </p>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-brand-800/80">
                <div className="flex items-center gap-3">
                  <img src="/images/educator.jpg" alt="Dr. Ankita Bisht" className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-400/50" />
                  <div>
                    <div className="font-bold text-white text-sm">Dr. Ankita Bisht</div>
                    <div className="text-xs text-brand-300">Ph.D. Education | UGC-NET JRF AIR 07</div>
                  </div>
                </div>
                <div className="font-serif italic text-amber-300 text-sm hidden sm:block">~ Educator &amp; Mentor</div>
              </div>
            </div>

            {/* Verified Credentials Grid */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-600" />
                Verified Academic Profile &amp; Milestones
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {credentials.map((cred, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500 font-medium">{cred.label}</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800">{cred.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Why Students Trust This Platform */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-brand-50/50 rounded-3xl p-6 sm:p-8 border border-brand-100">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-2">
                Why Students Across India Trust This Platform
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                A proven teaching methodology engineered for maximum retention and top rank qualification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trustPillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-brand-300 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Banner inside About */}
              <div className="mt-6 pt-6 border-t border-brand-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">Experience the teaching methodology</div>
                  <div className="text-xs text-slate-500">Attend a 100% free live demo session this week</div>
                </div>
                <button
                  onClick={onOpenDemoModal}
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Attend Free Demo</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

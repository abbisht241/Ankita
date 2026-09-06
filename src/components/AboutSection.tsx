import React from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  FileCheck2, 
  Quote, 
  ArrowUpRight,
  Award,
  BookMarked,
  ExternalLink
} from 'lucide-react';

interface AboutSectionProps {
  onOpenDemoModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenDemoModal }) => {
  const credentials = [
    { label: 'Current Faculty Role', value: 'Assistant Professor (Guest Faculty), HNB Garhwal Central University (2023-2026)' },
    { label: 'Academic Distinction', value: 'Rank 1 - Gold Medalist (M.A. Home Science 2018, 8.4 CGPA)' },
    { label: 'Doctoral Qualification', value: 'Ph.D. in Home Science (2024), H.N.B. Garhwal University' },
    { label: 'National Milestone', value: 'UGC-NET Qualified (NTA) in Home Science (2020)' },
    { label: 'Published Book', value: 'Author of "समृद्ध स्त्रियां, समृद्ध समाज: उत्तराखण्ड में SHG की भूमिका"' },
    { label: 'Research Publications', value: '8+ Papers in UGC-CARE (Madhya Bharti Grp-1) & Refereed Journals (IJAHS)' },
  ];

  const researchSpecializations = [
    {
      title: 'Food Science & Nutrition',
      desc: 'Nutritional biochemistry, ICMR-NIN RDA 2020 standards, therapeutic dietetics & maternal health programs.'
    },
    {
      title: 'Child / Human Development (CDP)',
      desc: 'Lifespan developmental psychology, constructivist paradigms (Piaget, Vygotsky), CWSN & inclusive education.'
    },
    {
      title: 'Research Methodology & SPSS',
      desc: 'Hypothesis testing, parametric/non-parametric statistics, SPSS data analysis, sampling & synopsis defense.'
    },
    {
      title: 'Teaching Aptitude & Pedagogy',
      desc: 'Levels of teaching, Bloom’s taxonomy, micro-teaching, evaluation systems & SWAYAM/MOOCs digital models.'
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
            Learn from a Central University <span className="gradient-text">Gold Medalist &amp; Assistant Professor</span>
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Empowering UGC NET, JRF, and Pedagogy aspirants with simplified frameworks, empirical research methodology, and personalized academic guidance.
          </p>
        </div>

        {/* Main Grid: Left Story & Credentials, Right Trust Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bio & Academic Credentials */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Bio Paragraphs */}
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p className="text-base sm:text-lg">
                Hello and welcome! I am <strong className="text-slate-900 font-bold">Dr. Ankita Bisht</strong>. I serve as an <span className="text-brand-700 font-semibold">Assistant Professor (Guest Faculty) at H.N.B. Garhwal University (A Central University)</span>, Srinagar Garhwal, Uttarakhand.
              </p>
              <p className="text-base">
                Having earned my <strong className="text-slate-900 font-semibold">Ph.D. in Home Science (2024)</strong> with research focused on the socio-economic empowerment of women through Self-Help Groups, and having achieved <strong className="text-slate-900 font-semibold">Rank 1 Gold Medalist</strong> honours in M.A. Home Science along with <strong className="text-slate-900 font-semibold">UGC-NET qualification</strong>, I understand exactly what it takes to master complex subjects and crack competitive academic exams.
              </p>
              <p className="text-base">
                I am also the author of the published academic book <em className="text-brand-800 font-medium">“समृद्ध स्त्रियां, समृद्ध समाज: उत्तराखण्ड में स्वयं सहायता समूहों की भूमिका”</em> and have published 8+ research papers in the <strong>UGC CARE List</strong> and international peer-reviewed journals. My teaching philosophy connects theoretical foundations directly with real-world empirical examples and SPSS statistical insights.
              </p>
            </div>

            {/* Academic Profiles Pill Links */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://uttara.academia.edu/AnkitaBisht"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                <span>Academia.edu Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ORCID: 0009-0008-5085-3278</span>
              </div>
            </div>

            {/* Educator Quote Card */}
            <div className="bg-gradient-to-r from-brand-900 to-navy-900 rounded-2xl p-6 text-white relative shadow-lg">
              <Quote className="w-10 h-10 text-brand-400/40 absolute top-4 right-4" />
              <p className="italic text-brand-100 font-serif text-base sm:text-lg leading-relaxed relative z-10">
                "Education is not merely the accumulation of facts, but the scientific training of the mind to question, analyze, and apply concepts with precision."
              </p>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-brand-800/80">
                <div className="flex items-center gap-3">
                  <img src="/images/educator.jpg" alt="Dr. Ankita Bisht" className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-400/50" />
                  <div>
                    <div className="font-bold text-white text-sm">Dr. Ankita Bisht</div>
                    <div className="text-xs text-brand-300">Ph.D. Home Science • Rank 1 Gold Medalist • UGC-NET</div>
                  </div>
                </div>
                <div className="font-serif italic text-amber-300 text-sm hidden sm:block">~ Assistant Professor, HNBGU</div>
              </div>
            </div>

            {/* Verified Credentials Grid */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                Official Academic Credentials &amp; Achievements
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

          {/* Right Column: Specialization Pillars & Published Work */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-brand-50/50 rounded-3xl p-6 sm:p-8 border border-brand-100">
              <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Core Research &amp; Teaching Specializations</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-2">
                UGC NET Paper 1, CDP, Research &amp; Nutrition Mastery
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Structured pedagogical modules engineered by a Central University faculty for deep conceptual retention.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {researchSpecializations.map((spec, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-brand-300 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs mb-2.5">
                      0{idx + 1}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                      {spec.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Published Book & Research Highlight Card */}
              <div className="mt-5 bg-gradient-to-r from-amber-500/10 to-brand-500/10 border border-amber-300/60 rounded-2xl p-4.5 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Published Authored Book</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    "समृद्ध स्त्रियां, समृद्ध समाज: उत्तराखण्ड में स्वयं सहायता समूहों की भूमिका"
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    First Prize Winner (International Conference 2023) • Organising Secretary, National Nutrition Month Seminar 2024.
                  </p>
                </div>
              </div>

              {/* Action Banner inside About */}
              <div className="mt-6 pt-6 border-t border-brand-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">Attend a Live Class this week</div>
                  <div className="text-xs text-slate-500">Experience Dr. Ankita Bisht's concept-first methodology</div>
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

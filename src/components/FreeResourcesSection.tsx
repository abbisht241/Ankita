import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  HelpCircle 
} from 'lucide-react';
import { resourcesData as defaultResourcesData } from '../data/resourcesData';
import type { Resource } from '../types';
import { InteractiveQuizWidget } from './InteractiveQuizWidget';
import { useSiteContent } from '../context/SiteContentContext';

interface FreeResourcesSectionProps {
  onOpenResourceModal: (resource: Resource) => void;
  onOpenDemoModal?: () => void;
}

export const FreeResourcesSection: React.FC<FreeResourcesSectionProps> = ({ 
  onOpenResourceModal
}) => {
  const { content } = useSiteContent();
  const resourcesConfig = content.resources;
  const rawResources: Resource[] = (resourcesConfig?.resources && resourcesConfig.resources.length > 0) ? resourcesConfig.resources : defaultResourcesData;
  const activeResources: Resource[] = rawResources.map((r: Resource) => ({
    ...r,
    title: r.title ? r.title.replace(/Research Methodology\s*&\s*SPSS/gi, 'Research Methodology & Statistical Tests').replace(/\s*&\s*SPSS/gi, '').replace(/\bSPSS\b/gi, '').trim() : r.title,
    description: r.description ? r.description.replace(/in SPSS/gi, 'in statistical analysis').replace(/\bSPSS\b/gi, 'statistical').replace(/\s{2,}/g, ' ').trim() : r.description,
    topicsCovered: Array.isArray(r.topicsCovered) ? r.topicsCovered.map((t: string) => t.replace(/SPSS Output Interpretation/gi, 'Statistical Output Interpretation').replace(/\bSPSS\b/gi, 'Statistical').trim()) : r.topicsCovered,
    previewSnippet: r.previewSnippet ? r.previewSnippet.replace(/SPSS Decision Rule/gi, 'Statistical Decision Rule').replace(/\bSPSS\b/gi, 'Statistical').trim() : r.previewSnippet
  }));

  const [activeTab, setActiveTab] = useState<'all' | 'quiz' | 'notes' | 'pyqs'>('all');

  const filteredResources = activeTab === 'notes'
    ? activeResources.filter(r => r.type === 'PDF Notes' || r.type === 'Mindmap' || r.type === 'Formula Sheet')
    : activeTab === 'pyqs'
    ? activeResources.filter(r => r.type === 'PYQ Solved')
    : activeResources;

  const handleResourceClick = (res: Resource) => {
    const action = res.downloadAction || 'modal';

    if (action === 'direct' && res.downloadUrl) {
      window.open(res.downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (action === 'whatsapp') {
      const msg = encodeURIComponent(`Hello Dr. Ankita! I would like to receive the free PDF: "${res.title}". Please share the download link.`);
      window.open(`https://wa.me/917417268651?text=${msg}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (action === 'telegram') {
      const tgUrl = res.downloadUrl || 'https://t.me/drankitaeducator';
      window.open(tgUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Default: Open modal with lead capture and instant download link
    onOpenResourceModal(res);
  };

  return (
    <section id="free-resources" className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{resourcesConfig?.sectionBadge || '100% Free Study Materials & Tools'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            {resourcesConfig?.sectionTitle || 'Free High-Yield Notes, Solved PYQs & Practice Hub'}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            {resourcesConfig?.sectionSubtitle || 'Boost your daily preparation with curated revision mindmaps, solved exam archives, and diagnostic tests.'}
          </p>
        </div>


        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-brand-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📚 All Study Materials
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-brand-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-brand-500" />
            <span>PDF Notes &amp; Mindmaps</span>
          </button>
          <button
            onClick={() => setActiveTab('pyqs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pyqs'
                ? 'bg-brand-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Solved PYQs (2020-2024)</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-brand-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Interactive Diagnostic Quiz</span>
          </button>

          {/* CBT Mock Test CTA */}
          <a
            href="/test"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-indigo-700 hover:bg-indigo-800 text-white shadow-md"
          >
            <span>🚀</span>
            <span>NTA CBT Mock Test</span>
          </a>
        </div>

        {/* Dynamic Content: Either Quiz or Resources Grid */}
        {activeTab === 'quiz' ? (
          <div className="mb-12">
            <InteractiveQuizWidget />
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Downloadable PDF Resources Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle hover:shadow-premium hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-brand-100 text-brand-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {res.type}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {res.fileSize} • {res.pageCount} Pages
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 group-hover:text-brand-700 transition-colors mb-2 leading-snug">
                      {res.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {res.description}
                    </p>

                    {/* Topics Covered Checklist */}
                    <div className="bg-white/80 rounded-xl p-3 border border-slate-200/60 mb-5 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Contents Snapshot:
                      </div>
                      {res.topicsCovered.map((topic, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {res.downloadCount}
                    </span>

                    <button
                      onClick={() => handleResourceClick(res)}
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 group-hover:shadow-md cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{res.downloadBtnText || 'Download PDF'}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Embedded Interactive Practice Quiz Teaser inside study hub */}
            <div className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Test Your Conceptual Speed with Quick Diagnostic Test
                </h3>
                <p className="text-xs text-slate-500">
                  Instant answer evaluation with step-by-step logic breakdown
                </p>
              </div>
              <InteractiveQuizWidget />
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

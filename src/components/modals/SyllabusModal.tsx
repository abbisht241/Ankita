import React from 'react';
import { 
  X, 
  Download, 
  ArrowRight, 
  FileText,
  ExternalLink,
  Layers,
  Clock
} from 'lucide-react';
import type { Course } from '../../types';

interface SyllabusModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  onDownloadPdf: () => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({ 
  course, 
  onClose, 
  onEnroll,
  onDownloadPdf 
}) => {
  if (!course) return null;

  const pdfUrl = course.syllabusPdfUrl;
  const pdfName = course.syllabusPdfName || `${course.title} Syllabus.pdf`;
  const pdfSize = course.syllabusPdfSize;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 shrink-0">
          <div className="pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-brand-100 text-brand-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                {course.category} • Official Syllabus
              </span>
              {pdfUrl && (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Verified PDF Preview</span>
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-1 leading-snug">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {course.duration} • {course.liveHours} • {course.medium}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pdfUrl && (
              <>
                <a
                  href={pdfUrl}
                  download={pdfName}
                  className="hidden sm:flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold px-3 py-2 rounded-xl border border-brand-200 transition-colors cursor-pointer shadow-2xs"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  title="Open Fullscreen"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Fullscreen</span>
                </a>
              </>
            )}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Interactive PDF Preview or Fallback */}
        <div className="overflow-y-auto py-4 flex-1 pr-1 space-y-4">
          {pdfUrl ? (
            /* Live Interactive Embedded PDF Viewer */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span className="font-semibold text-slate-800">{pdfName}</span>
                  {pdfSize && <span className="text-slate-400">({pdfSize})</span>}
                </div>
                <div className="sm:hidden flex items-center gap-2">
                  <a
                    href={pdfUrl}
                    download={pdfName}
                    className="text-brand-700 font-bold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-600 font-bold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Open
                  </a>
                </div>
              </div>

              <div className="w-full h-[60vh] min-h-[380px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full rounded-2xl"
                >
                  <iframe
                    src={pdfUrl}
                    title={`${course.title} Syllabus PDF Preview`}
                    className="w-full h-full rounded-2xl border-0"
                  >
                    {/* Fallback for browsers that don't support embedded PDF rendering */}
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-3">
                        <FileText className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">
                        {pdfName}
                      </h4>
                      <p className="text-xs text-slate-500 mb-4 max-w-sm">
                        Aapke browser me embedded preview open nahi ho raha. Niche button par click karke PDF ko direct download ya view karein.
                      </p>
                      <a
                        href={pdfUrl}
                        download={pdfName}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Open / Download Syllabus PDF</span>
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            </div>
          ) : (
            /* Fallback when no PDF is uploaded yet */
            <div className="space-y-4">
              <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Official Syllabus PDF Uploading Soon
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Dr. Ankita Bisht is currently finalizing the authentic 2026 syllabus PDF for this course. You can directly request the syllabus PDF copy on WhatsApp.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/917417268651?text=${encodeURIComponent(`Hello Dr. Ankita Bisht, please share the detailed syllabus PDF for "${course.title}".`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <span>Request Syllabus on WhatsApp 💬</span>
                  </a>
                </div>
              </div>

              {/* Legacy modules breakdown as secondary reference if present */}
              {course.syllabusModules && course.syllabusModules.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-600" />
                      <span>Curriculum Overview ({course.syllabusModules.length} Units)</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {course.syllabusModules.map((mod, i) => (
                      <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-brand-700">{mod.unitNumber}: {mod.unitTitle}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Clock className="w-3 h-3" /> {mod.hours}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{mod.topics.join(' • ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              download={pdfName}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Download className="w-4 h-4 text-brand-600" />
              <span>Download Syllabus PDF {pdfSize ? `(${pdfSize})` : ''}</span>
            </a>
          ) : (
            <button
              onClick={onDownloadPdf}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Syllabus Outline</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onEnroll(course);
            }}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enroll in This Batch (₹{course.price.toLocaleString('en-IN')}/month)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

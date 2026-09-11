import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Layers 
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 shrink-0">
          <div className="pr-6">
            <span className="bg-brand-100 text-brand-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              {course.category} • Complete Curriculum
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-1.5 leading-snug">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {course.duration} • {course.liveHours} • {course.medium}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Syllabus Content */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          
          {/* Target Exams & Benefits */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
            <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-600" />
              <span>Target Examinations:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(course.targetExams || []).map((exam, i) => (
                <span key={i} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                  {exam}
                </span>
              ))}
            </div>

            <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Key Preparation Outcomes:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {(course.keyBenefits || []).map((ben, i) => (
                <div key={i} className="flex items-start gap-1.5 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ben}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unit-wise Modules Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Unit-by-Unit Detailed Syllabus</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {(course.syllabusModules || []).length} Detailed Modules
              </span>
            </div>

            {(course.syllabusModules || []).map((module, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-brand-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 rounded">
                      {module.unitNumber}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {module.unitTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-500" />
                    {module.hours}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                  {(module.topics || []).map((topic, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onDownloadPdf}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Syllabus PDF</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onEnroll(course);
            }}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enroll in This Batch (₹{course.price.toLocaleString('en-IN')})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

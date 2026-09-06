import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-brand-600" />
            ) : (
              <FileText className="w-5 h-5 text-brand-600" />
            )}
            <h3 className="text-xl font-bold font-display text-slate-900">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Text Content */}
        <div className="overflow-y-auto py-5 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pr-2">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Last Updated: January 2025</strong>
              </p>
              <h4 className="font-bold text-slate-900">1. Information We Collect</h4>
              <p>
                When you enroll in our batches, book a free live demo, or download study PDFs from Dr. Ankita Bisht's UGC NET &amp; Pedagogy Academy, we collect personal information including your name, email address, WhatsApp mobile number, and course preferences.
              </p>
              <h4 className="font-bold text-slate-900">2. How We Use Your Information</h4>
              <p>
                We use this information strictly to provide course access links, share PDF notes and lecture schedules, deliver 1-on-1 mentorship, and notify you about upcoming exam batch updates. We will never sell, rent, or lease your personal information to third parties.
              </p>
              <h4 className="font-bold text-slate-900">3. Data Security &amp; Encryption</h4>
              <p>
                All student records and payment transactions are processed through encrypted 256-bit SSL protocols. Video streams and study materials are protected against unauthorized copying to safeguard intellectual property.
              </p>
              <h4 className="font-bold text-slate-900">4. Contacting Our Data Privacy Officer</h4>
              <p>
                For questions regarding data removal or privacy preferences, contact us at <code>abbisht241@gmail.com</code>.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated: January 2025</strong>
              </p>
              <h4 className="font-bold text-slate-900">1. Course Enrollment &amp; Access Validity</h4>
              <p>
                Enrollment grants individual, non-transferable access to live sessions, recorded archives, PDF notes, and CBT mock tests for the specified validity period (typically 1 Year). Sharing account credentials with other users is strictly prohibited.
              </p>
              <h4 className="font-bold text-slate-900">2. Intellectual Property Rights</h4>
              <p>
                All lectures, slide decks, PDF mindmaps, question banks, and video recordings are the exclusive intellectual property of Dr. Ankita Bisht. Reproduction or unauthorized redistribution will result in immediate termination of access and legal action.
              </p>
              <h4 className="font-bold text-slate-900">3. Live Class Conduct &amp; Community Guidelines</h4>
              <p>
                Students are expected to maintain respectful academic decorum during live interactive sessions and within the VIP Telegram doubt forums.
              </p>
              <h4 className="font-bold text-slate-900">4. Refund Policy</h4>
              <p>
                We offer a transparent 7-day satisfaction guarantee on select comprehensive masterclass programs. If you are not satisfied with course delivery, you may request a refund within 7 days of batch initiation.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

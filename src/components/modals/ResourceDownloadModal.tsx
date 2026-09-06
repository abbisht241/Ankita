import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import type { Resource } from '../../types';
import confetti from 'canvas-confetti';
import { AdminStorage } from '../../services/adminStorageService';

interface ResourceDownloadModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const ResourceDownloadModal: React.FC<ResourceDownloadModalProps> = ({ 
  resource, 
  onClose 
}) => {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!resource) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save student lead to Admin Panel -> Demo Leads & Inquiries
    try {
      await AdminStorage.addInquiry({
        name: 'Study Material Lead',
        email: email.trim(),
        phone: whatsapp.trim(),
        targetExam: resource.title,
        source: 'resource_download',
        status: 'new',
        notes: `Downloaded: ${resource.title} (${resource.type} - ${resource.fileSize})`
      });
    } catch (err) {
      console.warn('Could not record lead:', err);
    }

    setIsSubmitting(false);
    setIsDownloaded(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Automatically trigger download URL if present
    if (resource.downloadUrl && resource.downloadUrl.startsWith('http')) {
      setTimeout(() => {
        window.open(resource.downloadUrl, '_blank', 'noopener,noreferrer');
      }, 600);
    }
  };

  const handleResetAndClose = () => {
    setIsDownloaded(false);
    setEmail('');
    setWhatsapp('');
    onClose();
  };

  const targetPdfUrl = resource.downloadUrl || 'https://t.me/drankitaeducator';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDownloaded ? (
          <div>
            {/* Header */}
            <div className="text-left mb-6 pr-6">
              <span className="bg-brand-100 text-brand-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                {resource.type} • {resource.fileSize}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-2 leading-snug">
                {resource.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {resource.pageCount} Pages of High-Yield Revision Content by Dr. Ankita Bisht
              </p>
            </div>

            {/* Document Preview Snippet Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 space-y-3">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>Document Excerpt Preview:</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 italic leading-relaxed font-serif">
                "{resource.previewSnippet}"
              </div>

              {/* Topics list */}
              <div className="pt-2 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Included in this PDF:
                </div>
                {resource.topicsCovered.map((topic, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Lead Form */}
            <form onSubmit={handleDownload} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="10-digit mobile number for PDF download link"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-brand-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isSubmitting ? 'Preparing PDF Link...' : 'Instant Download PDF (Free)'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct PDF download link without annoying ads or spam</span>
              </div>
            </form>
          </div>
        ) : (
          /* Download Success Screen */
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-bold font-display text-slate-900">
              Your PDF is Ready!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-900">{resource.title}</strong> has been linked for instant access.
            </p>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Direct PDF Link Access:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                If the download did not start automatically, click the button below to view and download your study notes file directly.
              </p>
            </div>

            {/* Direct Action Link Button */}
            <div className="space-y-2.5 pt-2">
              <a
                href={targetPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>📥 Open &amp; Download PDF Now</span>
              </a>

              <a
                href={`https://wa.me/917417268651?text=${encodeURIComponent(`Hello Dr. Ankita! I registered to download: ${resource.title}. Please share the direct notes link.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Receive on WhatsApp Chat</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Continue Exploring Other Notes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

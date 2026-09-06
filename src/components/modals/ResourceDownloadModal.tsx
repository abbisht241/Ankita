import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import type { Resource } from '../../types';
import confetti from 'canvas-confetti';

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

  if (!resource) return null;

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloaded(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleResetAndClose = () => {
    setIsDownloaded(false);
    setEmail('');
    setWhatsapp('');
    onClose();
  };

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
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-md hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instant Download PDF (Free)</span>
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
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-bold font-display text-slate-900">
              Your PDF is Ready!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-900">{resource.title}</strong> has been sent to your WhatsApp ({whatsapp}) and email ({email}).
            </p>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left">
              <div className="font-bold mb-1">📥 Direct Download Started:</div>
              <p>
                A copy has been saved to your downloads folder. For mobile users, you can also view it instantly in our student app.
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow transition-colors cursor-pointer"
            >
              Continue Exploring Resources
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

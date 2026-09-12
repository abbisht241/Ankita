import React, { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  User, 
  Phone, 
  RotateCcw,
  FileText
} from 'lucide-react';
import { coursesData as defaultCoursesData } from '../../data/coursesData';
import { useSiteContent } from '../../context/SiteContentContext';

export const AdminShareLinkTab: React.FC = () => {
  const { content } = useSiteContent();
  const activeCourses = (content?.courses?.courses && content.courses.courses.length > 0)
    ? content.courses.courses
    : defaultCoursesData;

  const [copiedGeneralLink, setCopiedGeneralLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);

  // WhatsApp Message Composer State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('general');

  const templates: Record<string, { title: string; defaultText: string }> = {
    general: {
      title: '🎓 General Academy Admission Invite',
      defaultText: `Namaste [NAME]! 🙏

Admissions are officially open for *Dr. Ankita Bisht Academic Academy (2026 Batches)*.

Specialized live interactive coaching for:
✅ UGC NET Paper 1 (Target 85+ Marks)
✅ Research Methodology & Data Analysis
✅ Child Development & Pedagogy (CDP)
✅ Food Science & Nutrition

Special Flat Tuition: *₹999 Only*

👉 *Register Online Here:*
https://learnwithdrankita.com/register

Admissions Helpline: +91 7417268651
Dr. Ankita Bisht (Ph.D., UGC-NET)`
    },
    ugcNet: {
      title: '📖 UGC NET Paper 1 Super 50 Batch',
      defaultText: `Namaste [NAME]! 📚

Are you preparing for *UGC NET Paper 1*?

Dr. Ankita Bisht's *Super 50 Interactive Batch* is starting this week:
🔹 All 10 Units Covered in Depth
🔹 Concept-Based Interactive Live Classes (Evening 7:00 PM)
🔹 High-Yield Bilingual PDF Notes & PYQ Bank
🔹 1-on-1 Strategy & Doubt Resolution

Fee: Flat *₹999* (Limited Seats)

👉 *Direct Registration Link:*
https://learnwithdrankita.com/register

Helpline: +91 7417268651`
    },
    research: {
      title: '🔬 Research Methodology & Ph.D. Bootcamp',
      defaultText: `Dear [NAME], 🎓

If you are a Ph.D. Scholar, PET Aspirant, or Assistant Professor aspirant:

Join Dr. Ankita Bisht's *Research Methodology & Ph.D. Bootcamp*:
📊 Research Design & Hypothesis Formulation
📊 Practical Statistical Data Analysis & Interpretation
📊 Thesis Writing & High-Impact Journal Publication Guidance

Special Fee: *₹999 Only*

👉 *Register Your Seat:*
https://learnwithdrankita.com/register

Direct Inquiry: +91 7417268651`
    },
    cdp: {
      title: '👶 Child Development & Pedagogy (CDP 30/30)',
      defaultText: `Namaste [NAME]! 🌟

Score *30/30 in CDP & Teaching Pedagogy* with Dr. Ankita Bisht.

✨ Piaget, Vygotsky, Kohlberg Theories Masterclass
✨ Pedagogical Problem-Solving & NEP 2020 Framework
✨ Live Interactive Doubt Classes + Bilingual PDFs

Flat Fee: *₹999 Only*

👉 *Enrollment Link:*
https://learnwithdrankita.com/register

Helpline: +91 7417268651`
    },
    demoFollowup: {
      title: '🎁 Demo Class Follow-up & Special Offer',
      defaultText: `Hello [NAME]! 👋

Thank you for attending / inquiring about Dr. Ankita Bisht's live session!

Your reserved seat is held under the *Special ₹999/month Enrollment Offer*. Please complete your registration below to get instant batch group access and PDF materials:

👉 *Complete Registration Link:*
https://learnwithdrankita.com/register

See you in the live class!
Dr. Ankita Bisht & Academic Team
Helpline: +91 7417268651`
    }
  };

  const [customMessage, setCustomMessage] = useState<string>(templates.general.defaultText);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    let text = templates[templateKey].defaultText;
    if (studentName.trim()) {
      text = text.replace(/\[NAME\]/g, studentName.trim());
    } else {
      text = text.replace(/\[NAME\]/g, 'Scholar');
    }
    setCustomMessage(text);
  };

  const handleNameChange = (name: string) => {
    setStudentName(name);
    let text = templates[selectedTemplate].defaultText;
    if (name.trim()) {
      text = text.replace(/\[NAME\]/g, name.trim());
    } else {
      text = text.replace(/\[NAME\]/g, 'Scholar');
    }
    setCustomMessage(text);
  };

  const handleCopyGeneralLink = () => {
    navigator.clipboard.writeText('https://learnwithdrankita.com/register');
    setCopiedGeneralLink(true);
    setTimeout(() => setCopiedGeneralLink(false), 2500);
  };

  const handleCopyCustomMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const encodedText = encodeURIComponent(customMessage);
    const cleanPhone = studentPhone.replace(/\D/g, '');
    
    if (cleanPhone.length >= 10) {
      const fullNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
      window.open(`https://wa.me/${fullNumber}?text=${encodedText}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    }
  };

  const handleResetMessage = () => {
    handleTemplateChange(selectedTemplate);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Main Header Card with Public Link */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-brand-700/50 space-y-4 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Public Student Registration Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Share Registration Link &amp; WhatsApp Invites
            </h2>
            <p className="text-xs sm:text-sm text-brand-200 max-w-2xl leading-relaxed">
              Send this link to prospective students so they can fill their own details, choose their batch, and pay online directly.
            </p>
          </div>

          <a
            href="/register"
            target="_blank"
            rel="noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Preview Form Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Master URL Bar */}
        <div className="bg-slate-950/80 border border-brand-500/40 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-10 relative">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Official Self-Registration URL</span>
              <span className="font-mono text-xs sm:text-sm text-amber-300 font-extrabold truncate block">
                https://learnwithdrankita.com/register
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyGeneralLink}
              className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedGeneralLink ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Registration Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* 2. Interactive WhatsApp Message Composer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>WhatsApp Message Composer &amp; Share Tool</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the invitation message with student name &amp; phone before sending on WhatsApp.
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            1-Click WhatsApp Direct
          </span>
        </div>

        {/* Template Selector Pills */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Choose Message Template:
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(templates).map(([key, item]) => {
              const isSelected = selectedTemplate === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTemplateChange(key)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Student Name & Phone Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student Name (Optional - Inserts automatically)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Priya Sharma / Amit"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student WhatsApp Number (Optional - For Direct Send)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="10-digit mobile number (e.g. 9876543210)"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
              />
            </div>
          </div>

        </div>

        {/* Editable Message Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Editable WhatsApp Message Text:</span>
            </label>
            <button
              onClick={handleResetMessage}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Template</span>
            </button>
          </div>

          <textarea
            rows={8}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl font-mono text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-y leading-relaxed"
          />
        </div>

        {/* Message Send & Copy Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          
          <button
            onClick={handleCopyCustomMessage}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
          >
            {copiedMessage ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Message Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Message Text (For Telegram / SMS)</span>
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>
              {studentPhone.trim()
                ? `Send Directly to +91 ${studentPhone.replace(/\D/g, '')}`
                : 'Open & Share on WhatsApp'}
            </span>
          </button>

        </div>

      </div>

      {/* 3. Course-Specific Direct Registration Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-5">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-700" />
            <span>Course-Specific Registration Links</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Share direct registration links for specific subjects and batches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCourses.map((course) => {
            const courseUrl = `https://learnwithdrankita.com/register?course=${encodeURIComponent(course.id)}`;
            const isCopied = copiedCourseId === course.id;

            const handleCopyCourseLink = () => {
              navigator.clipboard.writeText(courseUrl);
              setCopiedCourseId(course.id);
              setTimeout(() => setCopiedCourseId(null), 2500);
            };

            const handleShareCourseWhatsApp = () => {
              const text = encodeURIComponent(
                `Namaste! 🙏\n\nAdmissions are open for *${course.title}* with Dr. Ankita Bisht.\n\nFee: Special *₹${course.price}/month* (Monthly Fee - Limited Seats)\nDuration: ${course.duration} | Bilingual Live Classes\n\n👉 *Direct Registration Link:*\n${courseUrl}\n\nHelpline: +91 7417268651`
              );
              window.open(`https://wa.me/?text=${text}`, '_blank');
            };

            return (
              <div
                key={course.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                      {course.badge || course.category}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 font-mono">
                      ₹{course.price}/mo
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={handleCopyCourseLink}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareCourseWhatsApp}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

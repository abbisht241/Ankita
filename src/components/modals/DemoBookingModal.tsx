import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Video, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  BookOpen 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminStorage } from '../../services/adminStorageService';

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export const DemoBookingModal: React.FC<DemoBookingModalProps> = ({ 
  isOpen, 
  onClose,
  defaultCourse 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: defaultCourse || 'UGC NET Paper 1 Complete Masterclass',
    slot: 'Evening Batch (7:00 PM - 8:30 PM)',
    day: 'Tomorrow (Live Interactive Session)'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Push into Admin CRM pipeline
    AdminStorage.addInquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      targetExam: `${formData.course} (${formData.slot})`,
      source: 'demo_modal',
      status: 'new',
      notes: `Demo Day: ${formData.day} | Slot: ${formData.slot}`
    });

    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (err) {}
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto"
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

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="text-left mb-6 pr-8">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>100% Free Live Trial Class</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900">
                Book Your Live Demo Session
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Experience Dr. Ankita Bisht's concept-based teaching live on Google Meet / Web Dashboard.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number (For Class Link) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  />
                </div>
              </div>

              {/* Target Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Course / Subject <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 outline-none"
                  >
                    <option value="UGC NET Paper 1 Complete Masterclass">UGC NET Paper 1 Masterclass</option>
                    <option value="Research Methodology & SPSS Data Analysis Masterclass">Research Methodology &amp; SPSS</option>
                    <option value="Child Development & Pedagogy (CDP) Super Batch">Child Development &amp; Pedagogy (CDP)</option>
                    <option value="Food Science, Nutrition & Maternal Health Masterclass">Food Science &amp; Nutrition</option>
                    <option value="Educational Psychology & Learning Theories Advanced">Educational Psychology Advanced</option>
                    <option value="Teaching Aptitude Masterclass & Pedagogical Skills">Teaching Aptitude Masterclass</option>
                  </select>
                </div>
              </div>

              {/* Preferred Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Slot
                  </label>
                  <select
                    value={formData.slot}
                    onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  >
                    <option value="Evening (7:00 PM - 8:30 PM)">Evening (7:00 PM - 8:30 PM)</option>
                    <option value="Night (8:45 PM - 10:00 PM)">Night (8:45 PM - 10:00 PM)</option>
                    <option value="Morning (10:00 AM - 11:30 AM)">Morning (10:00 AM - 11:30 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Day
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  >
                    <option value="Today (Upcoming Slot)">Today (Upcoming Slot)</option>
                    <option value="Tomorrow (Live Session)">Tomorrow (Live Session)</option>
                    <option value="Upcoming Saturday Batch">Upcoming Saturday Batch</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Confirm Free Demo Registration</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>No credit card required • Instant access link via WhatsApp</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-bold font-display text-slate-900">
              Demo Class Booked Successfully!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600">
              Congratulations <strong className="text-slate-900">{formData.name}</strong>! Your seat has been reserved for <strong className="text-brand-700">{formData.course}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Live Class Time:</span>
                <span className="font-bold text-slate-800">{formData.slot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Scheduled Day:</span>
                <span className="font-bold text-slate-800">{formData.day}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Platform:</span>
                <span className="font-bold text-brand-700">Dr. Ankita Bisht Live Portal (Google Meet / Zoom)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              We have dispatched your direct joining link and pre-class notes to <span className="font-semibold text-slate-800">{formData.phone}</span> (WhatsApp).
            </p>

            <button
              onClick={handleResetAndClose}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow transition-colors cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Headphones 
} from 'lucide-react';
import type { LeadFormData } from '../types';

interface LeadContactSectionProps {
  initialCourse?: string;
}

export const LeadContactSection: React.FC<LeadContactSectionProps> = ({ initialCourse }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    course: initialCourse || 'UGC NET Paper 1 Complete Masterclass',
    prepStage: 'Beginner (Starting Fresh for 2025/26)',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const coursesList = [
    'UGC NET Paper 1 Complete Masterclass',
    'Research Methodology & SPSS Data Analysis',
    'Child Development & Pedagogy (CDP)',
    'Food Science, Nutrition & Maternal Health',
    'Educational Psychology & Learning Theories',
    'Teaching Aptitude Masterclass',
    'Full Combo Pack (Paper 1 + CDP & Research)'
  ];

  const prepStages = [
    'Beginner (Starting Fresh for 2025/26)',
    'Repeat Aspirant (Targeting Score Improvement)',
    'Ph.D. Entrance / Research Scholar',
    'Working Professional / School Teacher',
    'College Assistant Professor Aspirant'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate fast server response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hello Dr. Ankita Bisht & Team! My name is ${formData.name || 'Aspirant'}. I am interested in *${formData.course}*. Please guide me regarding batch schedule, syllabus, and enrollment.`
    );
    window.open(`https://wa.me/917417268651?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-100 border border-brand-200 text-brand-900 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Headphones className="w-4 h-4 text-brand-600" />
            <span>Admissions &amp; Academic Counseling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Take the First Step Towards <span className="gradient-text">Your JRF &amp; Teaching Career</span>
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Get a personalized preparation roadmap, fee assistance details, and instant batch demo access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Details & WhatsApp Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-brand-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />
              
              <h3 className="text-xl font-bold font-display mb-2">
                Direct Contact &amp; Support
              </h3>
              <p className="text-xs text-brand-200 mb-6">
                Our academic counselors are available Monday to Saturday, 9:00 AM to 8:30 PM IST.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <a 
                  href="tel:+917417268651" 
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-brand-300 font-medium">Admission Helpline (Call Direct)</div>
                    <div className="font-bold text-white text-sm sm:text-base">+91 7417268651</div>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/10">
                  <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-brand-300 font-medium">Official Academic Email</div>
                    <div className="font-bold text-white">abbisht241@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/10">
                  <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-brand-300 font-medium">Academic Center &amp; Location</div>
                    <div className="font-medium text-white">Srinagar Garhwal, Uttarakhand, India</div>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action Box */}
              <div className="mt-8 pt-6 border-t border-brand-800">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950" />
                  <span>Instant WhatsApp Chat with Counselor</span>
                </button>
                <p className="text-[11px] text-brand-300 text-center mt-2">
                  Average response time: &lt; 5 minutes on WhatsApp
                </p>
              </div>

            </div>

            {/* Trust Assurance Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>100% Privacy &amp; No Spam Guarantee</span>
              </div>
              <p>
                Your contact details are strictly confidential and used solely for academic counseling and batch orientation.
              </p>
            </div>

          </div>

          {/* Right Column: High-Converting Lead Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-premium relative">
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-1">
                      Request Course Syllabus &amp; Counseling Call
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6">
                      Fill in your details to receive full syllabus PDFs and coupon codes on WhatsApp.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Priya Sharma / Amit"
                        className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                      />
                    </div>

                    {/* WhatsApp Mobile */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                    />
                  </div>

                  {/* Course Interested In */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Course / Batch Interested In <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                    >
                      {coursesList.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preparation Stage */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Current Preparation Stage
                    </label>
                    <select
                      value={formData.prepStage}
                      onChange={(e) => setFormData({ ...formData, prepStage: e.target.value })}
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                    >
                      {prepStages.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Any Specific Questions / Target Exam Year
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Planning for June 2025 NET JRF, need clarity on bilingual notes and timing..."
                      className="w-full bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 hover:from-brand-800 hover:to-brand-700 text-white font-extrabold text-sm py-4 px-6 rounded-xl shadow-lg hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Processing Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit &amp; Get Free Study Material</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                /* Success Feedback State */
                <div className="text-center py-10 space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">
                    Thank You, {formData.name || 'Scholar'}!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your request for <strong className="text-brand-700">{formData.course}</strong> has been received. Our senior academic counselor will call you within 2 hours.
                  </p>
                  
                  <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 max-w-md mx-auto text-xs text-brand-900 text-left space-y-1">
                    <div className="font-bold">✅ What happens next:</div>
                    <div>1. We have sent the course curriculum &amp; sample notes to your email ({formData.email}).</div>
                    <div>2. You will receive a WhatsApp invite with your free live demo class link.</div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={handleWhatsAppRedirect}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Continue on WhatsApp</span>
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
                    >
                      Submit Another Query
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  BookOpen, 
  Clock, 
  MapPin, 
  CreditCard, 
  Lock, 
  Send, 
  Download, 
  MessageCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { coursesData } from '../data/coursesData';
import { AdminStorage, type StudentEnrollment } from '../services/adminStorageService';
import { startRazorpayCheckout, type RazorpaySuccessPayload } from '../services/razorpayService';

interface StudentRegistrationPageProps {
  onBackToWebsite: () => void;
}

export const StudentRegistrationPage: React.FC<StudentRegistrationPageProps> = ({ onBackToWebsite }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(coursesData[0]?.id || 'ugc-net-paper-1');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    timing: 'Evening Batch (7:00 PM - 8:30 PM)',
    targetExam: 'UGC NET June/Dec 2025-2026',
    cityState: '',
    paymentChoice: 'razorpay' as 'razorpay' | 'upi_direct',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enrolledStudent, setEnrolledStudent] = useState<StudentEnrollment | null>(null);

  const selectedCourse = coursesData.find(c => c.id === selectedCourseId) || coursesData[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp mobile number');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in all mandatory fields');
      return;
    }

    // If Razorpay online gateway is chosen
    if (formData.paymentChoice === 'razorpay') {
      setIsLoading(true);
      startRazorpayCheckout({
        course: selectedCourse,
        studentName: formData.name.trim(),
        studentEmail: formData.email.trim(),
        studentPhone: cleanPhone,
        onSuccess: async (_verifyResult, payload: RazorpaySuccessPayload) => {
          setIsLoading(false);
          const newStudent = await AdminStorage.addStudent({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: cleanPhone,
            courseId: selectedCourse.id,
            courseTitle: selectedCourse.title,
            amount: selectedCourse.price,
            paymentId: payload.razorpay_payment_id,
            orderId: payload.razorpay_order_id,
            paymentMode: 'razorpay',
            status: 'active',
            notes: `Registered via /register | Batch: ${formData.timing} | Exam: ${formData.targetExam} | City: ${formData.cityState}`
          });
          setEnrolledStudent(newStudent);
          try {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
          } catch (err) {}
        },
        onFailure: (err) => {
          setIsLoading(false);
          setErrorMessage(`Payment Error: ${err}. Please try again or choose Direct Registration.`);
        },
        onDismiss: () => {
          setIsLoading(false);
        }
      });
      return;
    }

    // Direct / UPI Registration
    setIsLoading(true);
    try {
      const newStudent = await AdminStorage.addStudent({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: cleanPhone,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        amount: selectedCourse.price,
        paymentId: `pay_REG_${Date.now()}`,
        paymentMode: 'upi_direct',
        status: 'active',
        notes: `Direct Registration via /register | Batch: ${formData.timing} | Exam: ${formData.targetExam} | City: ${formData.cityState}`
      });
      setIsLoading(false);
      setEnrolledStudent(newStudent);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      } catch (err) {}
    } catch (e: any) {
      setIsLoading(false);
      setErrorMessage(e.message || 'Failed to complete registration');
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-brand-950 text-slate-100 font-sans flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          
          <button
            onClick={onBackToWebsite}
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Academy Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official 2026 Batch Admissions Open</span>
            </span>
          </div>

        </div>
      </header>

      {/* Main Registration Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">

        {!enrolledStudent ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Title & Mentor Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-brand-400" />
                <span>Dr. Ankita Bisht Academic Mentorship Portal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white">
                Student Admission &amp; <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">Batch Registration</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Enroll directly into live interactive batches for UGC NET Paper 1, Research Methodology (SPSS), CDP, and Food Science. Get instant class links and study material access.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 p-4 rounded-2xl text-xs font-semibold text-center animate-fadeIn">
                {errorMessage}
              </div>
            )}

            {/* Registration Form Card */}
            <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm space-y-8">
              
              {/* Step 1: Select Course */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Step 1: Select Your Course / Batch</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Flat Special Tuition: ₹999 Only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {coursesData.map((course) => {
                    const isSelected = selectedCourseId === course.id;
                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-brand-900/50 border-brand-500 ring-2 ring-brand-500/30 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              {course.badge || course.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs line-through text-slate-500">₹{course.originalPrice}</span>
                              <span className="text-sm font-extrabold text-emerald-400 font-mono">₹{course.price}</span>
                            </div>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                            {course.title}
                          </h4>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{course.duration}</span>
                          <span className="text-brand-300 font-medium">Bilingual (Hindi + Eng)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Student Details */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Step 2: Student Contact &amp; Academic Details</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Student Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Pooja Sharma / Rohit Negi"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Mobile */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Mobile (For Class Link) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address (For Notes &amp; PDF) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  {/* Batch Timing */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Preferred Batch Timing <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.timing}
                        onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="Evening Batch (7:00 PM - 8:30 PM)">Evening Batch (7:00 PM - 8:30 PM)</option>
                        <option value="Night Batch (8:45 PM - 10:00 PM)">Night Batch (8:45 PM - 10:00 PM)</option>
                        <option value="Morning Batch (10:00 AM - 11:30 AM)">Morning Batch (10:00 AM - 11:30 AM)</option>
                        <option value="Weekend Special (Sat & Sun)">Weekend Special (Sat &amp; Sun)</option>
                      </select>
                    </div>
                  </div>

                  {/* Target Exam */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Exam &amp; Cycle
                    </label>
                    <input
                      type="text"
                      value={formData.targetExam}
                      onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                      placeholder="e.g. UGC NET June 2026 / Ph.D. PET"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* City & State */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      City &amp; State (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.cityState}
                        onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                        placeholder="e.g. Dehradun, Uttarakhand"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Step 3: Payment & Enrollment Option */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>Step 3: Choose Enrollment &amp; Payment Mode</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: Live Razorpay */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentChoice: 'razorpay' })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.paymentChoice === 'razorpay'
                        ? 'bg-brand-900/60 border-brand-400 ring-2 ring-brand-400/30 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Online Razorpay (Instant)</span>
                      </span>
                      <span className="text-xs font-extrabold text-emerald-400 font-mono">₹{selectedCourse.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Pay via UPI (GPay/PhonePe/Paytm), Cards, or Net Banking. Instant class link generated.
                    </p>
                  </div>

                  {/* Option 2: Direct Registration */}
                  <div
                    onClick={() => setFormData({ ...formData, paymentChoice: 'upi_direct' })}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.paymentChoice === 'upi_direct'
                        ? 'bg-brand-900/60 border-brand-400 ring-2 ring-brand-400/30 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-amber-400" />
                        <span>Direct Admission / UPI</span>
                      </span>
                      <span className="text-xs font-bold text-amber-400">Reserve Seat</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Submit admission form directly. Counselor / Dr. Ankita will verify and confirm batch seat.
                    </p>
                  </div>

                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-brand-600 via-brand-500 to-amber-600 hover:from-brand-700 hover:to-amber-700 text-white font-extrabold text-sm sm:text-base py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Processing Admission...</span>
                  ) : formData.paymentChoice === 'razorpay' ? (
                    <>
                      <Lock className="w-5 h-5 text-amber-300" />
                      <span>Proceed to Pay ₹{selectedCourse.price} &amp; Complete Registration</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Submit Student Registration Form</span>
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Academic Portal • Admissions Helpline: +91 7417268651</span>
                </div>
              </div>

            </form>

          </div>
        ) : (
          /* Enrolled Confirmation & Admission Slip Card */
          <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
              
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
                  <Award className="w-3.5 h-3.5" />
                  <span>Admission Confirmed</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Welcome to the Academy, {enrolledStudent.name}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Your registration has been recorded successfully in the batch database.
                </p>
              </div>

              {/* Official Admission Slip Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left text-xs space-y-3 font-sans">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400 font-medium">Enrollment ID:</span>
                  <span className="font-mono font-extrabold text-amber-400">{enrolledStudent.id}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400 font-medium">Enrolled Course:</span>
                  <span className="font-bold text-white text-right max-w-[280px]">{enrolledStudent.courseTitle}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400 font-medium">Student Mobile:</span>
                  <span className="font-mono font-semibold text-white">{enrolledStudent.phone}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400 font-medium">Fee Paid / Mode:</span>
                  <span className="font-semibold text-emerald-400">₹{enrolledStudent.amount} ({enrolledStudent.paymentMode.toUpperCase()})</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400 font-medium">Live Class Platform:</span>
                  <span className="font-bold text-brand-300">Google Meet / Live Dashboard</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Admission Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ACTIVE</span>
                  </span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                
                <a
                  href={`https://wa.me/917417268651?text=${encodeURIComponent(
                    `Hello Dr. Ankita Bisht! I have completed my registration for ${enrolledStudent.courseTitle}. My Enrollment ID is ${enrolledStudent.id}. Please send me the official batch group link.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join Official WhatsApp Batch Group</span>
                </a>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePrintSlip}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Print / Save Admission Slip</span>
                  </button>

                  <button
                    onClick={onBackToWebsite}
                    className="text-xs text-slate-400 hover:text-white font-medium underline cursor-pointer"
                  >
                    Back to Home
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Dr. Ankita Bisht Academic Academy • All Rights Reserved</p>
      </footer>

    </div>
  );
};

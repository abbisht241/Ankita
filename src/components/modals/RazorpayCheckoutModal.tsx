import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock, 
  CreditCard, 
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Course } from '../../types';
import { startRazorpayCheckout, type RazorpayVerifyResponse, type RazorpaySuccessPayload } from '../../services/razorpayService';

import { AdminStorage } from '../../services/adminStorageService';

interface RazorpayCheckoutModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  course,
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    verify: RazorpayVerifyResponse;
    payload: RazorpaySuccessPayload;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessData(null);
      setIsLoading(false);
    }
  }, [isOpen, course]);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    startRazorpayCheckout({
      course,
      studentName: formData.name.trim(),
      studentEmail: formData.email.trim(),
      studentPhone: cleanPhone,
      onSuccess: (verifyResult, payload) => {
        setIsLoading(false);
        setSuccessData({ verify: verifyResult, payload });

        // Save into Admin database
        AdminStorage.addStudent({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: cleanPhone,
          courseId: course.id,
          courseTitle: course.title,
          amount: course.price,
          feeDue: 0,
          paymentStatus: 'paid',
          paymentId: payload.razorpay_payment_id,
          orderId: payload.razorpay_order_id,
          paymentMode: 'razorpay',
          status: 'active',
          notes: 'Enrolled via Online Razorpay Gateway'
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      },
      onFailure: (errorStr) => {
        setIsLoading(false);
        setErrorMessage(errorStr);
      },
      onDismiss: () => {
        setIsLoading(false);
      }
    });
  };

  const discountAmount = course.originalPrice - course.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden relative max-h-[92vh] flex flex-col animate-scaleUp">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Instant Batch Enrollment
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            Secure Checkout
          </h3>
          <p className="text-xs text-brand-200 mt-1 line-clamp-1">
            {course.title}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* SUCCESS STATE */}
          {successData ? (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  Payment Verified &amp; Enrolled! 🎉
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Welcome to <strong>{course.title}</strong> with Dr. Ankita Bisht.
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-medium text-slate-500">Payment ID:</span>
                  <span className="font-mono font-bold text-slate-900">{successData.payload.razorpay_payment_id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-medium text-slate-500">Order ID:</span>
                  <span className="font-mono text-slate-800">{successData.payload.razorpay_order_id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="font-medium text-slate-500">Student Name:</span>
                  <span className="font-semibold text-slate-900">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-700">₹{course.price} (Flat Rate)</span>
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <p className="font-bold text-brand-900 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-brand-600" />
                  What happens next?
                </p>
                <p className="text-slate-700">
                  Our academic team has sent your login credentials and class schedule to <strong>{formData.email}</strong> and WhatsApp (<strong>{formData.phone}</strong>).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href={`https://wa.me/917417268651?text=Hi%20Dr.%20Ankita,%20I%20have%20enrolled%20in%20${encodeURIComponent(course.title)}%20(Payment%20ID:%20${successData.payload.razorpay_payment_id})`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>Join Batch WhatsApp Group</span>
                </a>

                <button
                  onClick={onClose}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Checkout Notice:</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Course Order Summary Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.duration} • Bilingual Notes &amp; CBT Tests
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 line-through mr-1">
                      ₹{course.originalPrice}
                    </span>
                    <span className="text-base font-extrabold text-brand-700">
                      ₹{course.price}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/70 pt-2 flex justify-between items-center text-xs text-slate-600">
                  <span>Special Discount:</span>
                  <span className="text-emerald-700 font-semibold">-₹{discountAmount}</span>
                </div>

                <div className="border-t border-slate-200/70 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-lg text-brand-800">₹{course.price}</span>
                </div>
              </div>

              {/* Student Details Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. priya@gmail.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    256-Bit SSL Encrypted
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    Razorpay Verified
                  </span>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 hover:from-brand-800 hover:to-brand-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-lg hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Secure Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-amber-300" />
                      <span>Proceed to Pay ₹{course.price}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Supports UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, and NetBanking.
                </p>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

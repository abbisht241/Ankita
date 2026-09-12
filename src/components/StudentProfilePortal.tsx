import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  MessageCircle, 
  FileText, 
  LogOut, 
  Sparkles, 
  Printer, 
  Layers, 
  User, 
  Mail, 
  Phone, 
  X, 
  Target, 
  CreditCard, 
  Zap 
} from 'lucide-react';
import { 
  AdminStorage, 
  OFFICIAL_BATCH_WHATSAPP_LINK,
  type StudentEnrollment, 
  type BatchConfig 
} from '../services/adminStorageService';
import { 
  MockTestStorage, 
  type TestSubmission, 
  type MockTest, 
  type MockQuestion,
  formatTestDuration
} from '../services/mockTestService';
import { startRazorpayCheckout, type RazorpaySuccessPayload } from '../services/razorpayService';
import { coursesData } from '../data/coursesData';
import { useSiteContent } from '../context/SiteContentContext';
import { SiteContentService } from '../services/siteContentService';
import { resourcesData } from '../data/resourcesData';
import type { Resource } from '../types';

interface StudentProfilePortalProps {
  onBackToWebsite: () => void;
  onLaunchTest?: (testId: string) => void;
}

export const StudentProfilePortal: React.FC<StudentProfilePortalProps> = ({ 
  onBackToWebsite,
  onLaunchTest 
}) => {
  const { content } = useSiteContent();
  const studyMaterials: Resource[] = (content?.resources?.resources && content.resources.resources.length > 0)
    ? content.resources.resources
    : (SiteContentService.getSiteContent()?.resources?.resources || resourcesData);

  // Session & Auth state
  const [currentStudent, setCurrentStudent] = useState<StudentEnrollment | null>(null);
  const [loginInput, setLoginInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Portal Data state
  const [batches, setBatches] = useState<BatchConfig[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [availableTests, setAvailableTests] = useState<MockTest[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mock_tests' | 'study_material' | 'fee_history'>('dashboard');

  // Scorecard Review Modal
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<TestSubmission | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Pay Fee Modal
  const [showPayFeeModal, setShowPayFeeModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');

  // Current Month String helper
  const currentMonthName = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }, []);

  const nextMonthName = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }, []);

  // Initialize & check auto-login from URL or localStorage session
  useEffect(() => {
    const initPortal = async () => {
      // 1. Check URL query params: ?email=... or ?phone=...
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      const phoneParam = urlParams.get('phone');
      const targetQuery = emailParam || phoneParam;

      if (targetQuery) {
        setLoginLoading(true);
        const found = await AdminStorage.findStudentByEmailOrPhone(targetQuery);
        if (found) {
          AdminStorage.setStudentSession({ email: found.email, phone: found.phone, studentId: found.id });
          setCurrentStudent(found);
          setLoginLoading(false);
          return;
        }
        setLoginLoading(false);
      }

      // 2. Check stored session
      const savedSession = AdminStorage.getStudentSession();
      if (savedSession && (savedSession.email || savedSession.phone)) {
        const query = savedSession.email || savedSession.phone || '';
        const found = await AdminStorage.findStudentByEmailOrPhone(query);
        if (found) {
          setCurrentStudent(found);
          return;
        }
      }
    };

    initPortal();
  }, []);

  // Fetch student tests, submissions, and batches when student is loaded
  useEffect(() => {
    if (!currentStudent) return;

    // Batches
    const loadedBatches = AdminStorage.getBatches();
    setBatches(loadedBatches);

    // Tests
    const tests = MockTestStorage.getTests();
    setAvailableTests(tests);

    // Student's submissions
    MockTestStorage.getSubmissionsForStudent(currentStudent.email, currentStudent.phone)
      .then(subs => {
        setSubmissions(subs);
      })
      .catch(() => {
        const localSubs = MockTestStorage.getSubmissions();
        const cleanEmail = (currentStudent.email || '').toLowerCase().trim();
        const cleanPhone = (currentStudent.phone || '').replace(/\D/g, '');
        const matched = localSubs.filter(s => {
          const sEmail = (s.studentEmail || '').toLowerCase().trim();
          const sPhone = (s.studentPhone || '').replace(/\D/g, '');
          return (cleanEmail && sEmail === cleanEmail) || (cleanPhone.length >= 8 && sPhone.endsWith(cleanPhone));
        });
        setSubmissions(matched);
      });
  }, [currentStudent]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setLoginError('Please enter your registered email address or mobile number.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const found = await AdminStorage.findStudentByEmailOrPhone(loginInput.trim());
      if (found) {
        AdminStorage.setStudentSession({ email: found.email, phone: found.phone, studentId: found.id });
        setCurrentStudent(found);
      } else {
        setLoginError('No student record found with this Email / Phone. Please check spelling or WhatsApp support.');
      }
    } catch (err) {
      setLoginError('An error occurred during verification. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    AdminStorage.clearStudentSession();
    setCurrentStudent(null);
    setLoginInput('');
    setLoginError('');
  };

  // Matched Batch for current student
  const matchedBatch = useMemo(() => {
    if (!currentStudent || !batches.length) return null;
    return (
      batches.find(b => b.courseId === currentStudent.courseId) ||
      batches.find(b => b.courseId === 'ugc-net-paper-1') ||
      batches[0]
    );
  }, [currentStudent, batches]);

  // Official Batch Community WhatsApp Group Link
  const activeBatchGroupLink = useMemo(() => {
    if (matchedBatch?.whatsappGroupLink && !matchedBatch.whatsappGroupLink.includes('DrAnkita')) {
      return matchedBatch.whatsappGroupLink;
    }
    return OFFICIAL_BATCH_WHATSAPP_LINK;
  }, [matchedBatch]);

  // Batch Timing display
  const studentDisplayTiming = useMemo(() => {
    const raw = currentStudent?.timing || matchedBatch?.timing;
    if (!raw || raw.includes('Weekend Special')) {
      return 'Evening Batch (7:00 PM - 8:30 PM)';
    }
    return raw;
  }, [currentStudent?.timing, matchedBatch?.timing]);

  // Fee Details
  const isFeePaid = useMemo(() => {
    if (!currentStudent) return false;
    return (
      (currentStudent.paymentStatus === 'paid' || currentStudent.paymentMode === 'razorpay') &&
      Number(currentStudent.amount) > 0 &&
      (currentStudent.feeDue === 0 || currentStudent.feeDue === undefined)
    );
  }, [currentStudent]);

  const dueAmount = useMemo(() => {
    if (!currentStudent) return 999;
    if (isFeePaid) return 0;
    return currentStudent.feeDue !== undefined ? Number(currentStudent.feeDue) : 999;
  }, [currentStudent, isFeePaid]);

  const studentBillingMonth = useMemo(() => {
    if (!currentStudent) return currentMonthName;
    if (currentStudent.billingMonth) return currentStudent.billingMonth;
    return new Date(currentStudent.enrolledAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }, [currentStudent, currentMonthName]);

  // Mock test statistics
  const testStats = useMemo(() => {
    const totalAttempted = submissions.length;
    if (totalAttempted === 0) {
      return {
        totalAttempted: 0,
        avgPercentage: 0,
        bestScore: 0,
        bestTotal: 20,
        passedCount: 0
      };
    }

    const totalPercents = submissions.reduce((acc, s) => acc + (s.percentage || 0), 0);
    const avgPercentage = Math.round(totalPercents / totalAttempted);
    const bestSubmission = [...submissions].sort((a, b) => (b.percentage || 0) - (a.percentage || 0))[0];
    const passedCount = submissions.filter(s => s.isPassed).length;

    return {
      totalAttempted,
      avgPercentage,
      bestScore: bestSubmission?.score || 0,
      bestTotal: bestSubmission?.totalMarks || 20,
      passedCount
    };
  }, [submissions]);

  // Launch test handler
  const handleStartTest = (testId: string) => {
    if (onLaunchTest) {
      onLaunchTest(testId);
    } else {
      window.location.href = `/test?id=${encodeURIComponent(testId)}&email=${encodeURIComponent(currentStudent?.email || '')}&phone=${encodeURIComponent(currentStudent?.phone || '')}&name=${encodeURIComponent(currentStudent?.name || '')}`;
    }
  };

  // Questions of the active test being reviewed
  const reviewTestQuestions: MockQuestion[] = useMemo(() => {
    if (!selectedSubmissionForReview) return [];
    const test = availableTests.find(t => t.id === selectedSubmissionForReview.testId) || availableTests[0];
    return test?.questions || [];
  }, [selectedSubmissionForReview, availableTests]);

  // Filtered review questions
  const filteredReviewQuestions = useMemo(() => {
    if (!selectedSubmissionForReview) return [];
    const answers = selectedSubmissionForReview.answers || {};

    return reviewTestQuestions.filter((q) => {
      const studentAns = answers[q.id];
      const isAttempted = studentAns !== undefined && studentAns !== -1;
      const isCorrect = isAttempted && studentAns === q.correctIndex;

      if (reviewFilter === 'correct') return isCorrect;
      if (reviewFilter === 'incorrect') return isAttempted && !isCorrect;
      if (reviewFilter === 'unattempted') return !isAttempted;
      return true;
    });
  }, [selectedSubmissionForReview, reviewTestQuestions, reviewFilter]);

  // Online Fee Payment via Razorpay
  const handlePayFeeOnline = async () => {
    if (!currentStudent) return;
    setIsProcessingPayment(true);
    setPaymentSuccessMessage('');

    const targetCourse = coursesData.find(c => c.id === currentStudent.courseId) || {
      id: currentStudent.courseId || 'ugc-net-paper-1',
      title: currentStudent.courseTitle,
      price: dueAmount > 0 ? dueAmount : 999,
      category: 'Paper 1 Masterclass'
    };

    try {
      await startRazorpayCheckout({
        course: {
          id: targetCourse.id,
          title: `Monthly Tuition Fee - ${targetCourse.title}`,
          price: dueAmount > 0 ? dueAmount : 999,
          category: targetCourse.category
        } as any,
        studentName: currentStudent.name,
        studentEmail: currentStudent.email,
        studentPhone: currentStudent.phone,
        onSuccess: async (_verifyResult, payload: RazorpaySuccessPayload) => {
          setIsProcessingPayment(false);
          // Mark paid in storage
          await AdminStorage.updateStudent(currentStudent.id, {
            amount: (Number(currentStudent.amount) || 0) + (dueAmount > 0 ? dueAmount : 999),
            feeDue: 0,
            paymentStatus: 'paid',
            status: 'active',
            paymentMode: 'razorpay',
            paymentId: payload.razorpay_payment_id,
            billingMonth: currentMonthName,
            nextDueMonth: nextMonthName,
            notes: `Monthly fee paid online via Razorpay (${payload.razorpay_payment_id}) for ${currentMonthName}`
          });

          // Refresh current student state
          const updated = await AdminStorage.findStudentByEmailOrPhone(currentStudent.email);
          if (updated) setCurrentStudent(updated);

          setPaymentSuccessMessage(`Fee payment successful! Reference: ${payload.razorpay_payment_id}. Your admission & batch access are confirmed.`);
          setTimeout(() => {
            setShowPayFeeModal(false);
          }, 2500);
        },
        onFailure: (err) => {
          setIsProcessingPayment(false);
          alert(`Payment Error: ${err}. You can also pay directly via UPI.`);
        },
        onDismiss: () => {
          setIsProcessingPayment(false);
        }
      });
    } catch (e: any) {
      setIsProcessingPayment(false);
      alert(e.message || 'Failed to initialize payment gateway.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. LOGIN SCREEN (Clean, modern light aesthetic)
  // ─────────────────────────────────────────────────────────────
  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-brand-500 selection:text-white relative">
        {/* Subtle Top Header bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-700 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-brand-600" />
              <span>Back to Main Website</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                <span>Student Portal</span>
              </span>
            </div>
          </div>
        </header>

        {/* Login Form Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl relative">
            
            {/* Header / Avatar */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md shadow-brand-500/20 mb-3">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Student Learning Portal
              </h1>
              <p className="text-xs text-slate-500">
                विद्यार्थी लॉगिन पोर्टल • Check your monthly fee status, batch community &amp; CBT mock test scorecards.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{loginError}</p>
                  <p className="text-[11px] text-rose-700 mt-1">
                    Need help? WhatsApp Dr. Ankita at{' '}
                    <a 
                      href="https://wa.me/917417268651?text=Hello%20Dr.%20Ankita,%20I%20am%20having%20trouble%20logging%20into%20my%20Student%20Portal." 
                      target="_blank" 
                      rel="noreferrer"
                      className="underline font-bold text-rose-900"
                    >
                      +91 7417268651
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Registered Email or WhatsApp Mobile</span>
                  <span className="text-[10px] text-brand-600 font-medium">ईमेल या मोबाइल नंबर</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="e.g. student@gmail.com or 9876543210"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loginLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Admission Record...</span>
                  </>
                ) : (
                  <>
                    <span>Open My Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Registration link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                New admission / Not enrolled yet?{' '}
                <a 
                  href="/register" 
                  className="font-bold text-brand-700 hover:text-brand-800 underline underline-offset-2 ml-1"
                >
                  Enroll in a Course (₹999/month) →
                </a>
              </p>
            </div>

          </div>
        </main>

        {/* Helpline note */}
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          Dr. Ankita Bisht Academic Academy • Student Support Helpline:{' '}
          <a href="tel:+917417268651" className="text-slate-700 font-semibold hover:underline">+91 7417268651</a>
        </footer>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. LOGGED-IN STUDENT DASHBOARD (Executive Light & Clean LMS UI)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brand-600" />
              <span>Website</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-600 text-white font-black text-base flex items-center justify-center shadow-sm">
                {currentStudent.name ? currentStudent.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    {currentStudent.name}
                  </h1>
                  <span className="font-mono text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                    {currentStudent.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[220px] sm:max-w-sm">
                  {currentStudent.courseTitle.split('(')[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            
            {/* Fee Status Badge in Navbar */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold">
              {isFeePaid ? (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fee Paid ({studentBillingMonth})</span>
                </span>
              ) : (
                <button
                  onClick={() => setShowPayFeeModal(true)}
                  className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 cursor-pointer transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Fee Due: ₹{dueAmount} (Pay Now)</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowReceiptModal(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              <span>Fee Receipt</span>
            </button>

            <a
              href="https://wa.me/917417268651"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Faculty Helpline</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Section 1: Hero Welcome & Two Major Status Cards (Fee & WhatsApp Batch) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Left Column (2 cols): Student Identity & Enrolled Course Info */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enrolled &amp; Active Student</span>
                </span>
                
                {isFeePaid ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Monthly Fee Status: Paid ({studentBillingMonth})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Fee Due: ₹{dueAmount} Pending</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentStudent.courseTitle}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="truncate">{currentStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>+91 {currentStudent.phone}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{studentDisplayTiming}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (1 col): Monthly Fee Card with Direct Pay Button */}
          <div className={`rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-4 ${
            isFeePaid 
              ? 'bg-gradient-to-br from-emerald-50 via-white to-white border-emerald-200' 
              : 'bg-gradient-to-br from-rose-50 via-white to-white border-rose-200'
          }`}>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  <span>Monthly Fee Status</span>
                </span>
                
                {isFeePaid ? (
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    PAID ✓
                  </span>
                ) : (
                  <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full animate-pulse">
                    PENDING
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-500 block">Billing Month:</span>
                <p className="text-lg font-black text-slate-900">{studentBillingMonth}</p>
              </div>

              {isFeePaid ? (
                <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-emerald-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Paid Amount:</span>
                    <strong className="text-emerald-700 font-mono font-bold text-sm">₹{currentStudent.amount || 999}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Next Billing Month:</span>
                    <span className="text-slate-700 font-semibold">{nextMonthName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Payment Mode:</span>
                    <span className="uppercase font-semibold text-slate-600">{currentStudent.paymentMode.replace('_', ' ')}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 bg-white p-3 rounded-2xl border border-rose-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Fee Balance Due:</span>
                    <strong className="text-rose-600 font-mono font-black text-base">₹{dueAmount}</strong>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    Please pay your monthly tuition fee to keep your mock tests and batch active.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons for Fee */}
            <div className="space-y-2 pt-2">
              {!isFeePaid ? (
                <button
                  onClick={() => setShowPayFeeModal(true)}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Fee Online (₹{dueAmount})</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-600" />
                    <span>Download Receipt</span>
                  </button>

                  <button
                    onClick={() => setShowPayFeeModal(true)}
                    className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-brand-200 transition-colors cursor-pointer"
                  >
                    <span>Advance Pay</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ── Section 2: Batch Community Banner (WhatsApp Group - No Google Meet links) ── */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official Batch Community
              </span>
              <span className="text-emerald-100 text-xs font-semibold">
                Daily Batch Timing: {studentDisplayTiming}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              {matchedBatch?.title || currentStudent.courseTitle}
            </h3>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Dr. Ankita Bisht posts the live class link, daily doubt discussion, and class PDFs directly inside this official WhatsApp group.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={activeBatchGroupLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>Open Batch WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
            </a>
          </div>
        </div>

        {/* ── Section 3: Navigation Tabs ── */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs mb-6">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1.5 sm:py-2.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="sm:hidden text-[11px] leading-tight text-center font-semibold">Overview</span>
              <span className="hidden sm:inline">Overview &amp; Batch Info</span>
            </button>

            <button
              onClick={() => setActiveTab('mock_tests')}
              className={`py-2 px-1.5 sm:py-2.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                activeTab === 'mock_tests'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Target className="w-4 h-4 shrink-0" />
              <span className="sm:hidden text-[11px] leading-tight text-center font-semibold">
                CBT Tests <span className="text-[10px] opacity-80">({submissions.length})</span>
              </span>
              <span className="hidden sm:inline">CBT Mock Tests ({submissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('study_material')}
              className={`py-2 px-1.5 sm:py-2.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                activeTab === 'study_material'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="sm:hidden text-[11px] leading-tight text-center font-semibold">Study Notes</span>
              <span className="hidden sm:inline">Study Notes &amp; Syllabus PDF</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: OVERVIEW & BATCH INFO ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CBT Tests Attempted</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{testStats.totalAttempted}</span>
                  <span className="text-xs text-slate-400">tests</span>
                </div>
                <p className="text-[11px] text-brand-600 font-semibold">Real NTA exam simulation</p>
              </div>

              <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Accuracy</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-amber-600">
                    {testStats.avgPercentage}%
                  </span>
                  <span className="text-xs text-slate-400">score</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  {testStats.avgPercentage >= 70 ? 'Target JRF on Track 🏆' : 'Practice regularly'}
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Highest CBT Score</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                    {testStats.bestScore}
                  </span>
                  <span className="text-xs text-slate-400">/ {testStats.bestTotal}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Best CBT performance</p>
              </div>

              <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Admission ID</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">{currentStudent.id}</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold">Confirmed Active</p>
              </div>

            </div>

            {/* Recent Mock Test Records Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900">Your Recent Mock Test Attempts (CBT Record)</h3>
                  <p className="text-xs text-slate-500">Review your past test scores, answers, and faculty rationales</p>
                </div>
                <button
                  onClick={() => setActiveTab('mock_tests')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 underline underline-offset-2 cursor-pointer"
                >
                  View All ({submissions.length}) →
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                  <Target className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">You haven't attempted any CBT Mock Tests yet.</p>
                  <button
                    onClick={() => setActiveTab('mock_tests')}
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <span>Attempt Your First CBT Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submissions.slice(0, 2).map((sub) => (
                    <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{sub.testTitle}</h4>
                          <span className="text-[11px] text-slate-500">
                            {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                          sub.isPassed 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {sub.score} / {sub.totalMarks} ({sub.percentage}%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
                        <span>Time: {Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s</span>
                        <button
                          onClick={() => {
                            setSelectedSubmissionForReview(sub);
                            setReviewFilter('all');
                          }}
                          className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review Question Scorecard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Faculty Guidance Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-black text-lg shrink-0">
                  DA
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900">Need Guidance from Dr. Ankita Bisht?</h4>
                  <p className="text-xs text-slate-500">
                    Connect directly on WhatsApp for Paper 1 study strategy, doubts, or Ph.D. research inquiries.
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/917417268651?text=${encodeURIComponent(
                  `Namaste Dr. Ankita Bisht! I am ${currentStudent.name} (ID: ${currentStudent.id}), enrolled in ${currentStudent.courseTitle}. I have a doubt regarding our class.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 7417268651)</span>
              </a>
            </div>

          </div>
        )}

        {/* ── TAB 2: CBT MOCK TESTS & SCORECARDS ── */}
        {activeTab === 'mock_tests' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-600" />
                  <span>CBT Mock Test Performance &amp; Scorecards</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Check all your attempted tests, view correct/incorrect answers, and read Dr. Ankita's academic rationales.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Attempts</span>
                  <span className="text-base font-black text-slate-900">{submissions.length} Tests</span>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Avg Accuracy</span>
                  <span className="text-base font-black text-emerald-600">{testStats.avgPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Test Attempt History */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Your Completed CBT Attempts ({submissions.length})</span>
              </h4>

              {submissions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs">
                  No mock test submissions found for your account. Click on any test below to start practicing!
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div 
                      key={sub.id}
                      className="bg-white border border-slate-200 hover:border-brand-300 rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                            {sub.id}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            sub.isPassed 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {sub.isPassed ? 'PASSED ✓' : 'NEEDS PRACTICE'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        </div>

                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                          {sub.testTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <div>
                            Score: <strong className="text-slate-900 font-mono">{sub.score} / {sub.totalMarks}</strong> ({sub.percentage}%)
                          </div>
                          <div>
                            Correct: <strong className="text-emerald-600 font-mono font-bold">{sub.correctCount}</strong>
                          </div>
                          <div>
                            Incorrect: <strong className="text-rose-600 font-mono font-bold">{sub.incorrectCount}</strong>
                          </div>
                          <div>
                            Time Spent: <strong className="text-slate-700 font-mono">{Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:shrink-0">
                        <button
                          onClick={() => {
                            setSelectedSubmissionForReview(sub);
                            setReviewFilter('all');
                          }}
                          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>View Scorecard &amp; Answers</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Tests to Practice */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Available CBT Tests to Practice Now</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTests.map((test) => (
                  <div 
                    key={test.id}
                    className="bg-white border border-slate-200 hover:border-brand-400 rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-md">
                          {test.category}
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTestDuration(test.questions?.length || 0)}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-slate-900">
                        {test.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {test.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>Questions: <strong className="text-slate-800">{test.questions?.length || 0}</strong></span>
                        <span>Total Marks: <strong className="text-slate-800">{test.totalMarks}</strong></span>
                        <span>Marks/Q: <strong className="text-emerald-600">+{test.positiveMarks}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartTest(test.id)}
                      className="w-full bg-slate-900 hover:bg-brand-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Start CBT Examination</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: STUDY NOTES & SYLLABUS ── */}
        {activeTab === 'study_material' && (
          <div className="space-y-5">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-600" />
                  <span>Course Study Material &amp; Syllabus Downloads</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Official PDF resources, unit-wise notes, and formula cheat sheets prepared by Dr. Ankita Bisht.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                {studyMaterials.length} Resources Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studyMaterials.map((res, idx) => {
                const downloadLink = res.downloadUrl && res.downloadUrl !== '#' && !res.downloadUrl.startsWith('/resources/')
                  ? res.downloadUrl 
                  : 'https://t.me/drankitaeducator';
                const isExternal = downloadLink.startsWith('http');

                return (
                  <div key={res.id || idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-brand-300 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                          {res.type || 'PDF Notes'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{res.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {res.description || res.previewSnippet || 'Official study material & revision notes.'}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <span>📦 {res.fileSize || 'PDF Document'}</span>
                        {res.pageCount && <span>• 📄 {res.pageCount} Pages</span>}
                      </div>
                    </div>

                    <a
                      href={downloadLink}
                      target={isExternal ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      download={!isExternal}
                      className="w-full bg-slate-100 hover:bg-brand-700 text-slate-800 hover:text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer group"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-600 group-hover:text-white transition-colors" />
                      <span>{res.downloadBtnText || 'Download PDF'}</span>
                      {isExternal && <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />}
                    </a>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: PAY MONTHLY FEE ONLINE / UPI DIRECT MODAL
      ───────────────────────────────────────────────────────────── */}
      {showPayFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-slate-900">
            
            <button
              onClick={() => setShowPayFeeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Pay Monthly Course Fee</h3>
                  <p className="text-xs text-slate-500">Admission ID: <span className="font-mono font-bold text-slate-700">{currentStudent.id}</span></p>
                </div>
              </div>

              {paymentSuccessMessage ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-2 text-center animate-fadeIn">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Payment Successful!</p>
                  <p>{paymentSuccessMessage}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Fee Summary Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Student Name:</span>
                      <strong className="text-slate-900">{currentStudent.name}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Course:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">{currentStudent.courseTitle.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Month:</span>
                      <span className="font-bold text-brand-700">{studentBillingMonth}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Total Amount to Pay:</span>
                      <span className="text-base font-black text-emerald-700 font-mono">₹{dueAmount > 0 ? dueAmount : 999}.00</span>
                    </div>
                  </div>

                  {/* Payment Option 1: Instant Online Gateway */}
                  <button
                    onClick={handlePayFeeOnline}
                    disabled={isProcessingPayment}
                    className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Opening Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{dueAmount > 0 ? dueAmount : 999} via Razorpay (UPI / Cards)</span>
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <span className="relative bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">OR PAY DIRECTLY VIA UPI</span>
                  </div>

                  {/* Payment Option 2: Direct UPI */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span>Direct GPay / PhonePe / Paytm:</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-slate-800 font-bold select-all text-center">
                      7417268651@okbizaxis
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      After sending ₹{dueAmount > 0 ? dueAmount : 999}, share your screenshot on WhatsApp for instant receipt &amp; batch confirmation:
                    </p>
                    <a
                      href={`https://wa.me/917417268651?text=${encodeURIComponent(
                        `Namaste Dr. Ankita Bisht! I am ${currentStudent.name} (Student ID: ${currentStudent.id}). I have paid ₹${dueAmount > 0 ? dueAmount : 999} monthly fee for ${studentBillingMonth}. Please find my payment screenshot attached.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Share Screenshot on WhatsApp</span>
                    </a>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: QUESTION-BY-QUESTION SCORECARD REVIEW MODAL
      ───────────────────────────────────────────────────────────── */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {selectedSubmissionForReview.id}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    selectedSubmissionForReview.isPassed 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {selectedSubmissionForReview.isPassed ? 'PASSED ✓' : 'NEEDS PRACTICE'}
                  </span>
                </div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 mt-1 line-clamp-1">
                  {selectedSubmissionForReview.testTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
                  title="Print Scorecard"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedSubmissionForReview(null)}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Score Summary Strip */}
            <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Score Obtained</span>
                <p className="font-black text-slate-900 text-sm">
                  {selectedSubmissionForReview.score} / {selectedSubmissionForReview.totalMarks} ({selectedSubmissionForReview.percentage}%)
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Correct Answers</span>
                <p className="font-black text-emerald-600 text-sm">
                  {selectedSubmissionForReview.correctCount} Correct
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Incorrect</span>
                <p className="font-black text-rose-600 text-sm">
                  {selectedSubmissionForReview.incorrectCount} Wrong
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Time Taken</span>
                <p className="font-black text-slate-700 text-sm">
                  {Math.floor(selectedSubmissionForReview.timeSpentSeconds / 60)}m {selectedSubmissionForReview.timeSpentSeconds % 60}s
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Questions ({reviewTestQuestions.length})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-700 hover:bg-slate-100 border border-emerald-200'
                }`}
              >
                Correct ({selectedSubmissionForReview.correctCount})
              </button>
              <button
                onClick={() => setReviewFilter('incorrect')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'incorrect'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-rose-700 hover:bg-slate-100 border border-rose-200'
                }`}
              >
                Incorrect ({selectedSubmissionForReview.incorrectCount})
              </button>
              <button
                onClick={() => setReviewFilter('unattempted')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'unattempted'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-amber-700 hover:bg-slate-100 border border-amber-200'
                }`}
              >
                Unattempted ({selectedSubmissionForReview.unattemptedCount || 0})
              </button>
            </div>

            {/* Question by Question Review Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {filteredReviewQuestions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No questions match this filter.
                </div>
              ) : (
                filteredReviewQuestions.map((q, idx) => {
                  const studentAns = selectedSubmissionForReview.answers[q.id];
                  const isAttempted = studentAns !== undefined && studentAns !== -1;
                  const isCorrect = isAttempted && studentAns === q.correctIndex;

                  return (
                    <div 
                      key={q.id}
                      className={`p-5 rounded-2xl border space-y-4 ${
                        !isAttempted
                          ? 'border-slate-200 bg-white'
                          : isCorrect
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-rose-200 bg-rose-50/30'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                            Q{idx + 1}
                          </span>
                          {q.subject && (
                            <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                              {q.subject}
                            </span>
                          )}
                          {q.topic && (
                            <span className="text-[10px] text-slate-400 hidden sm:inline">
                              • {q.topic}
                            </span>
                          )}
                        </div>

                        <div>
                          {!isAttempted ? (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Unattempted (0 Marks)
                            </span>
                          ) : isCorrect ? (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Correct (+2 Marks)
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-600" /> Incorrect (0 Marks)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question text */}
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isStudentPick = studentAns === optIdx;
                          const isRightAnswer = q.correctIndex === optIdx;

                          let optionStyles = 'border-slate-200 bg-white text-slate-700';
                          if (isRightAnswer) {
                            optionStyles = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold';
                          } else if (isStudentPick && !isRightAnswer) {
                            optionStyles = 'border-rose-300 bg-rose-50 text-rose-900 font-bold';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${optionStyles}`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                  isRightAnswer 
                                    ? 'bg-emerald-600 text-white' 
                                    : isStudentPick 
                                    ? 'bg-rose-600 text-white' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              <div className="shrink-0 flex items-center gap-1.5">
                                {isRightAnswer && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                    ✓ Correct Answer
                                  </span>
                                )}
                                {isStudentPick && !isRightAnswer && (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                    ✗ Your Pick
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Faculty Explanation / Rationale Box */}
                      {q.explanation && (
                        <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200/80 space-y-1">
                          <span className="text-[11px] font-bold text-brand-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Dr. Ankita Bisht's Academic Rationale (विस्तृत व्याख्या):</span>
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Candidate: {selectedSubmissionForReview.studentName} ({selectedSubmissionForReview.studentPhone})</span>
              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Close Review
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: OFFICIAL ADMISSION FEE RECEIPT MODAL
      ───────────────────────────────────────────────────────────── */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Receipt Content */}
            <div className="space-y-5 text-left text-xs">
              
              <div className="border-b border-slate-200 pb-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white mb-2 shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900">Dr. Ankita Bisht Academic Academy</h3>
                <p className="text-[11px] text-slate-500">Official Student Admission &amp; Fee Receipt</p>
                <div className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-3 py-0.5 rounded-full mt-2">
                  CONFIRMED &amp; PAID
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Enrollment ID</span>
                  <span className="font-mono font-bold text-slate-900">{currentStudent.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Receipt Date</span>
                  <span className="font-bold text-slate-900">{new Date(currentStudent.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-slate-900">{currentStudent.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Mobile</span>
                  <span className="font-bold text-slate-900">+91 {currentStudent.phone}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Course Name</span>
                <span className="font-bold text-slate-900">{currentStudent.courseTitle}</span>
                {currentStudent.timing && (
                  <span className="text-[11px] text-slate-600 block">Batch Timing: {currentStudent.timing}</span>
                )}
              </div>

              <div className="border-t border-b border-slate-200 py-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">Course Fee Paid (Net):</span>
                <span className="font-mono font-black text-emerald-700 text-base">₹{currentStudent.amount || 999}.00</span>
              </div>

              <div className="text-[10px] text-slate-500 space-y-1">
                <p>• Payment Reference: <span className="font-mono text-slate-700">{currentStudent.paymentId}</span></p>
                <p>• Mode: <span className="font-semibold text-slate-700 uppercase">{currentStudent.paymentMode.replace('_', ' ')}</span></p>
                <p>• Faculty Helpline: +91 7417268651 | contact@learnwithdrankita.com</p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

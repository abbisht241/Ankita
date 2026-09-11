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
  Video, 
  MessageCircle, 
  FileText, 
  PhoneCall, 
  LogOut, 
  Sparkles, 
  Printer, 
  Calendar, 
  Layers, 
  User, 
  Mail, 
  Phone, 
  X,
  Target
} from 'lucide-react';
import { 
  AdminStorage, 
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

interface StudentProfilePortalProps {
  onBackToWebsite: () => void;
  onLaunchTest?: (testId: string) => void;
}

export const StudentProfilePortal: React.FC<StudentProfilePortalProps> = ({ 
  onBackToWebsite,
  onLaunchTest 
}) => {
  // Session & Auth state
  const [currentStudent, setCurrentStudent] = useState<StudentEnrollment | null>(null);
  const [loginInput, setLoginInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Portal Data state
  const [batches, setBatches] = useState<BatchConfig[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [availableTests, setAvailableTests] = useState<MockTest[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mock_tests' | 'study_material' | 'receipt'>('dashboard');

  // Scorecard Review Modal
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<TestSubmission | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);

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
        setLoginError('No enrolled student found with this Email/Phone. Please check the spelling or WhatsApp support.');
      }
    } catch (err) {
      setLoginError('An error occurred during verification. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = async (email: string) => {
    setLoginInput(email);
    setLoginLoading(true);
    setLoginError('');
    const found = await AdminStorage.findStudentByEmailOrPhone(email);
    if (found) {
      AdminStorage.setStudentSession({ email: found.email, phone: found.phone, studentId: found.id });
      setCurrentStudent(found);
    } else {
      setLoginError('Demo student record not found.');
    }
    setLoginLoading(false);
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

  // ─────────────────────────────────────────────────────────────
  // 1. LOGIN SCREEN (If student not logged in)
  // ─────────────────────────────────────────────────────────────
  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white relative overflow-hidden">
        {/* Background glow ornaments */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-600/20 via-indigo-900/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

        {/* Top Header */}
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-brand-400" />
              <span>Back to Main Website</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-950/80 text-brand-300 border border-brand-800/60">
                <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                <span>Student Portal</span>
              </span>
            </div>
          </div>
        </header>

        {/* Login Form Container */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative">
            
            {/* Header / Avatar */}
            <div className="text-center space-y-2 mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-500/20 mb-3 border border-brand-400/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Student Learning Portal
              </h1>
              <p className="text-xs text-slate-400">
                विद्यार्थी लॉगिन पोर्टल • Access your enrolled batch, live classes &amp; mock test scorecards.
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-800/60 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{loginError}</p>
                  <p className="text-[11px] text-rose-300 mt-1">
                    Need help? WhatsApp Dr. Ankita at{' '}
                    <a 
                      href="https://wa.me/917417268651?text=Hello%20Dr.%20Ankita,%20I%20am%20having%20trouble%20logging%20into%20my%20Student%20Portal." 
                      target="_blank" 
                      rel="noreferrer"
                      className="underline font-bold text-white hover:text-rose-100"
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Registered Email or WhatsApp Mobile</span>
                  <span className="text-[10px] text-brand-400 font-normal">ईमेल या मोबाइल नंबर</span>
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
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

            {/* Quick Demo Access Pill */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
                Quick 1-Click Demo Login
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pooja.rawat@gmail.com')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500/50 transition-all text-xs flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-indigo-400 font-bold flex items-center justify-center text-xs">
                      PR
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block group-hover:text-brand-300 transition-colors">
                        Pooja Rawat (Sample Enrolled Student)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">pooja.rawat@gmail.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-md">
                    Demo Login →
                  </span>
                </button>
              </div>
            </div>

            {/* Footer Registration link */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-400">
                Not registered yet?{' '}
                <a 
                  href="/register" 
                  className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2 ml-1"
                >
                  Enroll in a Course (₹999) →
                </a>
              </p>
            </div>

          </div>
        </main>

        {/* Helpline note */}
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900">
          Dr. Ankita Bisht Academic Academy • Student Support Helpline:{' '}
          <a href="tel:+917417268651" className="text-slate-400 hover:text-white font-mono">+91 7417268651</a>
        </footer>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. LOGGED-IN STUDENT DASHBOARD
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Student Welcome */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                {currentStudent.name ? currentStudent.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                    {currentStudent.name}
                  </h1>
                  <span className="font-mono text-[10px] font-bold bg-brand-950 text-brand-300 border border-brand-700/50 px-2 py-0.5 rounded-full">
                    {currentStudent.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                  {currentStudent.courseTitle.split('(')[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-brand-400" />
              <span>Admission Slip</span>
            </button>

            <a
              href="https://wa.me/917417268651"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 px-3 py-2 rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Faculty Helpline</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/80 border border-rose-800/60 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="Logout from Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Banner: Student Status & Overview ── */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enrolled &amp; Active Student</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-950 text-brand-300 border border-brand-700/60">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fee Paid: ₹{currentStudent.amount || 999}</span>
                </span>
                {currentStudent.timing && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{currentStudent.timing}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                {currentStudent.courseTitle}
              </h2>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentStudent.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>+91 {currentStudent.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Enrolled: {new Date(currentStudent.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions in Banner */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              {matchedBatch?.liveClassLink && (
                <a
                  href={matchedBatch.liveClassLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <Video className="w-4 h-4" />
                  <span>Join Live Class</span>
                </a>
              )}

              {matchedBatch?.whatsappGroupLink && (
                <a
                  href={matchedBatch.whatsappGroupLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Batch WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dashboard &amp; Live Batch</span>
          </button>

          <button
            onClick={() => setActiveTab('mock_tests')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap transition-all ${
              activeTab === 'mock_tests'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>CBT Mock Tests &amp; Scorecards ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('study_material')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap transition-all ${
              activeTab === 'study_material'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Notes &amp; Syllabus</span>
          </button>

          <button
            onClick={() => setShowReceiptModal(true)}
            className="md:hidden px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Fee Receipt</span>
          </button>
        </div>

        {/* ── TAB 1: DASHBOARD & LIVE BATCH ── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              
              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CBT Tests Attempted</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">{testStats.totalAttempted}</span>
                  <span className="text-xs text-slate-500">tests</span>
                </div>
                <p className="text-[11px] text-brand-400 font-medium">Real exam simulation</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Score %</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    {testStats.avgPercentage}%
                  </span>
                  <span className="text-xs text-slate-500">accuracy</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">
                  {testStats.avgPercentage >= 70 ? 'Target JRF on Track' : 'Keep Practicing'}
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highest Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {testStats.bestScore}
                  </span>
                  <span className="text-xs text-slate-500">/ {testStats.bestTotal}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Best CBT attempt</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admission Status</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-white">CONFIRMED</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">ID: {currentStudent.id}</p>
              </div>

            </div>

            {/* Grid: Live Class Card & Faculty Notice */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Batch & Class schedule (2 cols) */}
              <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-brand-400" />
                    <h3 className="font-extrabold text-base text-white">Live Classroom &amp; Batch Schedule</h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                    Active Batch
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Batch Title</span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {matchedBatch?.title || currentStudent.courseTitle}
                        </h4>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timing</span>
                        <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 sm:justify-end">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{currentStudent.timing || matchedBatch?.timing || 'Mon to Fri • 7:00 PM - 8:30 PM'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3">
                      {matchedBatch?.liveClassLink && (
                        <a
                          href={matchedBatch.liveClassLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer"
                        >
                          <Video className="w-4 h-4" />
                          <span>Enter Google Meet Live Class</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {matchedBatch?.whatsappGroupLink && (
                        <a
                          href={matchedBatch.whatsappGroupLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Join Batch WhatsApp Community</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-xs text-slate-400 space-y-2 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
                    <p className="font-bold text-slate-300">📌 Live Class Instructions / आवश्यक निर्देश:</p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                      <li>Join the Google Meet live classroom 5 minutes before class time.</li>
                      <li>Keep your notebook, paper 1 syllabus, and PYQ booklet ready.</li>
                      <li>Live doubts are answered in real-time during and after every lecture.</li>
                      <li>Class recordings and PDF notes are uploaded in the WhatsApp batch group within 2 hours.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Faculty Helpline Card (1 col) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center font-black">
                      DA
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Dr. Ankita Bisht</h4>
                      <p className="text-[11px] text-brand-300">UGC NET &amp; Ph.D. Faculty Mentor</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have any questions regarding Paper 1 strategy, research topic selection, or mock test doubts? Feel free to connect directly.
                  </p>

                  <div className="space-y-2 pt-2">
                    <a
                      href={`https://wa.me/917417268651?text=${encodeURIComponent(
                        `Namaste Dr. Ankita Bisht! I am ${currentStudent.name} (Student ID: ${currentStudent.id}), enrolled in ${currentStudent.courseTitle}. I have a doubt regarding our class.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp (+91 7417268651)</span>
                    </a>

                    <a
                      href="tel:+917417268651"
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                      <span>Call Faculty Desk</span>
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300 block mb-0.5">Faculty Office Hours:</span>
                  10:00 AM – 7:00 PM (Monday to Saturday)
                </div>
              </div>

            </div>

            {/* Quick Recent CBT Test Record Widget */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white">Recent Mock Test Attempts (CBT)</h3>
                  <p className="text-xs text-slate-400">Your latest examination performance &amp; scorecards</p>
                </div>
                <button
                  onClick={() => setActiveTab('mock_tests')}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2 cursor-pointer"
                >
                  View All ({submissions.length}) →
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 space-y-3">
                  <Target className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">You haven't attempted any CBT Mock Tests yet.</p>
                  <button
                    onClick={() => setActiveTab('mock_tests')}
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <span>Attempt Your First CBT Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submissions.slice(0, 2).map((sub) => (
                    <div key={sub.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">{sub.testTitle}</h4>
                          <span className="text-[11px] text-slate-400">
                            Attempted on {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                          sub.isPassed 
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' 
                            : 'bg-amber-950 text-amber-300 border-amber-700/60'
                        }`}>
                          {sub.score} / {sub.totalMarks} ({sub.percentage}%)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>Time: {Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s</span>
                        <button
                          onClick={() => {
                            setSelectedSubmissionForReview(sub);
                            setReviewFilter('all');
                          }}
                          className="font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Review Questions &amp; Answers</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── TAB 2: CBT MOCK TESTS & SCORECARDS ── */}
        {activeTab === 'mock_tests' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-lg sm:text-xl text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-400" />
                  <span>CBT Mock Test Performance Center</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Practice high-yield NTA UGC NET format tests with strict 35s speed timers and detailed faculty rationales.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Average Accuracy</span>
                  <span className="text-base font-black text-amber-400">{testStats.avgPercentage}%</span>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden sm:block" />
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Attempted</span>
                  <span className="text-base font-black text-white">{submissions.length}</span>
                </div>
              </div>
            </div>

            {/* Submissions History */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Your Test Attempt History ({submissions.length})</span>
              </h4>

              {submissions.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-slate-950/80 border border-slate-800 text-slate-400 text-xs">
                  No mock test submissions recorded yet for this account. Pick an active test below to start practicing!
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div 
                      key={sub.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                            {sub.id}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            sub.isPassed 
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' 
                              : 'bg-amber-950 text-amber-300 border-amber-700/60'
                          }`}>
                            {sub.isPassed ? 'PASSED' : 'NEEDS PRACTICE'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        </div>

                        <h4 className="font-bold text-sm sm:text-base text-white">
                          {sub.testTitle}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                          <div>
                            Score: <strong className="text-white font-mono">{sub.score} / {sub.totalMarks}</strong> ({sub.percentage}%)
                          </div>
                          <div>
                            Correct: <strong className="text-emerald-400 font-mono">{sub.correctCount}</strong>
                          </div>
                          <div>
                            Incorrect: <strong className="text-rose-400 font-mono">{sub.incorrectCount}</strong>
                          </div>
                          <div>
                            Time Spent: <strong className="text-slate-200 font-mono">{Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:shrink-0">
                        <button
                          onClick={() => {
                            setSelectedSubmissionForReview(sub);
                            setReviewFilter('all');
                          }}
                          className="flex-1 sm:flex-none bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>View Scorecard &amp; Explanations</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Mock Tests to Attempt */}
            <div className="space-y-4 pt-4">
              <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Available Tests to Practice Now</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTests.map((test) => (
                  <div 
                    key={test.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-brand-300 bg-brand-950 border border-brand-800/60 px-2 py-0.5 rounded">
                          {test.category}
                        </span>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTestDuration(test.questions?.length || 0)}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-white">
                        {test.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {test.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>Questions: <strong className="text-white">{test.questions?.length || 0}</strong></span>
                        <span>Total Marks: <strong className="text-white">{test.totalMarks}</strong></span>
                        <span>Marks/Q: <strong className="text-emerald-400">+{test.positiveMarks}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartTest(test.id)}
                      className="w-full bg-slate-800 hover:bg-brand-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl border border-slate-700 hover:border-brand-500 transition-all flex items-center justify-center gap-2 cursor-pointer group"
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

        {/* ── TAB 3: STUDY MATERIAL & SYLLABUS ── */}
        {activeTab === 'study_material' && (
          <div className="space-y-6">
            
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-6">
              <h3 className="font-black text-lg sm:text-xl text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-400" />
                <span>Course Syllabus &amp; Study Notes</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Official PDF resources, unit-wise notes, and formula sheets curated by Dr. Ankita Bisht.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Item 1 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800/60 text-brand-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">UGC NET Paper 1 Official Syllabus (10 Units)</h4>
                  <p className="text-xs text-slate-400">
                    Complete bilingual breakdown of Teaching Aptitude, Research, ICT, Logic, Higher Education.
                  </p>
                </div>
                <a
                  href="/resources/ugc-net-paper-1-syllabus.pdf"
                  download
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-brand-400" />
                  <span>Download Syllabus PDF</span>
                </a>
              </div>

              {/* Item 2 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/60 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Indian Logic &amp; Classical Square Cheat Sheet</h4>
                  <p className="text-xs text-slate-400">
                    Pramanas, Hetvabhasa fallacies, and Categorical Syllogism high-yield summary table.
                  </p>
                </div>
                <a
                  href="/resources/indian-logic-cheatsheet.pdf"
                  download
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Cheat Sheet</span>
                </a>
              </div>

              {/* Item 3 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Research Methodology &amp; SPSS Handbook</h4>
                  <p className="text-xs text-slate-400">
                    Hypothesis testing, parametric vs non-parametric tests, p-value decision rules.
                  </p>
                </div>
                <a
                  href="/resources/research-methodology-handbook.pdf"
                  download
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Handbook</span>
                </a>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ─────────────────────────────────────────────────────────────
          SCORECARD & QUESTION-BY-QUESTION REVIEW MODAL
      ───────────────────────────────────────────────────────────── */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {selectedSubmissionForReview.id}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    selectedSubmissionForReview.isPassed 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' 
                      : 'bg-amber-950 text-amber-300 border-amber-700/60'
                  }`}>
                    {selectedSubmissionForReview.isPassed ? 'PASSED' : 'NEEDS PRACTICE'}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white mt-1 line-clamp-1">
                  {selectedSubmissionForReview.testTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Print Scorecard"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedSubmissionForReview(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Score Summary Strip */}
            <div className="px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Score Obtained</span>
                <p className="font-black text-white text-sm">
                  {selectedSubmissionForReview.score} / {selectedSubmissionForReview.totalMarks} ({selectedSubmissionForReview.percentage}%)
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Correct Answers</span>
                <p className="font-black text-emerald-400 text-sm">
                  {selectedSubmissionForReview.correctCount} Correct
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Incorrect</span>
                <p className="font-black text-rose-400 text-sm">
                  {selectedSubmissionForReview.incorrectCount} Wrong
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Time Spent</span>
                <p className="font-black text-slate-200 text-sm">
                  {Math.floor(selectedSubmissionForReview.timeSpentSeconds / 60)}m {selectedSubmissionForReview.timeSpentSeconds % 60}s
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'all'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Questions ({reviewTestQuestions.length})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                }`}
              >
                Correct ({selectedSubmissionForReview.correctCount})
              </button>
              <button
                onClick={() => setReviewFilter('incorrect')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'incorrect'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                }`}
              >
                Incorrect ({selectedSubmissionForReview.incorrectCount})
              </button>
              <button
                onClick={() => setReviewFilter('unattempted')}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                  reviewFilter === 'unattempted'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
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
                      className={`p-5 rounded-2xl border bg-slate-950/60 space-y-4 ${
                        !isAttempted
                          ? 'border-slate-800'
                          : isCorrect
                          ? 'border-emerald-800/60 bg-emerald-950/10'
                          : 'border-rose-800/60 bg-rose-950/10'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs bg-slate-800 text-white px-2 py-0.5 rounded">
                            Q{idx + 1}
                          </span>
                          {q.subject && (
                            <span className="text-[10px] font-semibold text-brand-300 bg-brand-950 px-2 py-0.5 rounded border border-brand-800/60">
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
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              Unattempted (0 Marks)
                            </span>
                          ) : isCorrect ? (
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 border border-emerald-700/60 px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Correct (+2 Marks)
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-rose-400 bg-rose-950 border border-rose-700/60 px-2 py-0.5 rounded flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Incorrect (0 Marks)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question text */}
                      <p className="text-sm font-semibold text-white leading-relaxed">
                        {q.question}
                      </p>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isStudentPick = studentAns === optIdx;
                          const isRightAnswer = q.correctIndex === optIdx;

                          let optionStyles = 'border-slate-800 bg-slate-900/60 text-slate-300';
                          if (isRightAnswer) {
                            optionStyles = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-bold';
                          } else if (isStudentPick && !isRightAnswer) {
                            optionStyles = 'border-rose-500/80 bg-rose-950/40 text-rose-200 font-bold';
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
                                    : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              <div className="shrink-0 flex items-center gap-1.5">
                                {isRightAnswer && (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                                    ✓ Correct Answer
                                  </span>
                                )}
                                {isStudentPick && !isRightAnswer && (
                                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                                    ✗ Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Faculty Explanation / Rationale Box */}
                      {q.explanation && (
                        <div className="p-3.5 rounded-xl bg-brand-950/50 border border-brand-800/60 space-y-1">
                          <span className="text-[11px] font-bold text-brand-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Dr. Ankita Bisht's Academic Rationale (विस्तृत व्याख्या):</span>
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
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
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span>Student: {selectedSubmissionForReview.studentName} ({selectedSubmissionForReview.studentPhone})</span>
              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Close Review
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          OFFICIAL ADMISSION FEE RECEIPT MODAL
      ───────────────────────────────────────────────────────────── */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Receipt Content */}
            <div className="space-y-5 text-left text-xs">
              
              <div className="border-b border-slate-200 pb-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white mb-2 shadow">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900">Dr. Ankita Bisht Academic Academy</h3>
                <p className="text-[11px] text-slate-500">Official Student Admission &amp; Fee Receipt</p>
                <div className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-2">
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

              <div className="text-[10px] text-slate-400 space-y-1">
                <p>• Payment Reference: <span className="font-mono text-slate-600">{currentStudent.paymentId}</span></p>
                <p>• Mode: <span className="font-medium text-slate-600 uppercase">{currentStudent.paymentMode.replace('_', ' ')}</span></p>
                <p>• Faculty Desk Contact: +91 7417268651 | contact@learnwithdrankita.com</p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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

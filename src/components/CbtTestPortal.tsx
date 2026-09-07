import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Zap, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  BookOpen,
  GraduationCap,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MockTestStorage, 
  type TestSubmission 
} from '../services/mockTestService';


interface CbtTestPortalProps {
  onBackToWebsite: () => void;
  initialTestId?: string;
}

export const CbtTestPortal: React.FC<CbtTestPortalProps> = ({ 
  onBackToWebsite,
  initialTestId
}) => {
  const tests = MockTestStorage.getTests();

  // Test Selection & Registration
  const [selectedTestId, setSelectedTestId] = useState<string>(() => {
    if (initialTestId) return initialTestId;
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    if (idFromUrl && tests.some(t => t.id === idFromUrl)) {
      return idFromUrl;
    }
    return tests[0]?.id || 'test-ugc-net-paper1-cbt';
  });

  const activeTest = tests.find(t => t.id === selectedTestId) || tests[0];

  // Test Stages: 'register' | 'testing' | 'result'
  const [stage, setStage] = useState<'register' | 'testing' | 'result'>('register');

  // Student Details
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  // Live Test State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  const [visitedQuestions, setVisitedQuestions] = useState<{ [qId: string]: boolean }>({});
  const QUESTION_TIME_LIMIT = 35; // Strict 35 seconds per question
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState(QUESTION_TIME_LIMIT);
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);

  // Result State
  const [finalSubmission, setFinalSubmission] = useState<TestSubmission | null>(null);

  // Mark first question visited on start
  useEffect(() => {
    if (stage === 'testing' && activeTest?.questions[0]) {
      setVisitedQuestions(prev => ({ ...prev, [activeTest.questions[0].id]: true }));
    }
  }, [stage, activeTest]);

  // Live 35-Second Per-Question Countdown Timer (Anti-Cheating Speed Mode)
  useEffect(() => {
    if (stage !== 'testing') return;

    const timer = setInterval(() => {
      setQuestionSecondsLeft(prev => {
        if (prev <= 1) {
          // Time expired for this question: Auto advance or submit
          handleTimeUpAutoNext();
          return QUESTION_TIME_LIMIT;
        }
        return prev - 1;
      });

      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, currentQIndex, activeTest]);

  const handleTimeUpAutoNext = () => {
    if (!activeTest) return;
    if (currentQIndex < activeTest.questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setQuestionSecondsLeft(QUESTION_TIME_LIMIT);
      const nextQ = activeTest.questions[nextIdx];
      if (nextQ) {
        setVisitedQuestions(prev => ({ ...prev, [nextQ.id]: true }));
      }
    } else {
      // Last question expired: Auto-submit test
      performFinalSubmission();
    }
  };

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      alert('Please enter your Name and WhatsApp number to begin.');
      return;
    }

    if (!activeTest || !activeTest.questions || activeTest.questions.length === 0) {
      alert('This test has no questions yet. Please choose another test.');
      return;
    }

    // Strict Anti-Cheating: Single Attempt restriction
    const cleanPhone = studentPhone.replace(/\D/g, '');
    const pastSubmissions = MockTestStorage.getSubmissions();
    const alreadyTaken = pastSubmissions.some(
      s => s.testId === activeTest.id && s.studentPhone.replace(/\D/g, '') === cleanPhone
    );
    if (alreadyTaken) {
      alert(`⚠️ Attempt Restricted: Aapne yeh test (${activeTest.title}) pehle hi submit kar diya hai.\n\nLeaderboard par fair ranking aur nakal rokne ke liye ek student sirf 1 baar exam de sakta hai. Restart ki anumati nahi hai.`);
      window.location.href = `/results?test=${encodeURIComponent(activeTest.id)}`;
      return;
    }

    setSecondsRemaining(activeTest.questions.length * QUESTION_TIME_LIMIT);
    setQuestionSecondsLeft(QUESTION_TIME_LIMIT);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({ [activeTest.questions[0].id]: true });
    setCurrentQIndex(0);
    setStage('testing');
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = activeTest.questions[currentQIndex];
    if (!currentQ) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleClearResponse = () => {
    const currentQ = activeTest.questions[currentQIndex];
    if (!currentQ) return;
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleMarkForReviewAndNext = () => {
    const currentQ = activeTest.questions[currentQIndex];
    if (currentQ) {
      setMarkedForReview(prev => ({
        ...prev,
        [currentQ.id]: true
      }));
    }
    handleNextQuestion();
  };

  const handleSaveAndNext = () => {
    const currentQ = activeTest.questions[currentQIndex];
    if (currentQ) {
      // Unmark from review if explicitly saved
      setMarkedForReview(prev => {
        const copy = { ...prev };
        delete copy[currentQ.id];
        return copy;
      });
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQIndex < activeTest.questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setQuestionSecondsLeft(QUESTION_TIME_LIMIT);
      const nextQ = activeTest.questions[nextIdx];
      if (nextQ) {
        setVisitedQuestions(prev => ({ ...prev, [nextQ.id]: true }));
      }
    } else {
      setIsSubmitConfirmOpen(true);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index < currentQIndex) {
      alert('🔒 Anti-Cheating Protocol: Past questions cannot be re-opened once time has passed or you have moved forward.');
      return;
    }
    if (index > currentQIndex + 1) {
      alert('🔒 Anti-Cheating Mode: Questions must be attempted in sequence.');
      return;
    }
    setCurrentQIndex(index);
    setQuestionSecondsLeft(QUESTION_TIME_LIMIT);
    const targetQ = activeTest.questions[index];
    if (targetQ) {
      setVisitedQuestions(prev => ({ ...prev, [targetQ.id]: true }));
    }
  };


  const performFinalSubmission = async () => {
    if (!activeTest) return;

    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    activeTest.questions.forEach(q => {
      const chosen = answers[q.id];
      if (chosen === undefined || chosen === -1) {
        unattemptedCount++;
      } else if (chosen === q.correctIndex) {
        correctCount++;
        score += activeTest.positiveMarks;
      } else {
        incorrectCount++;
        score -= activeTest.negativeMarks;
      }
    });

    const totalPossibleMarks = activeTest.questions.length * activeTest.positiveMarks;
    const finalScore = Math.max(0, Math.round(score * 10) / 10);
    const percentage = totalPossibleMarks > 0 
      ? Math.round((finalScore / totalPossibleMarks) * 100) 
      : 0;
    const isPassed = percentage >= activeTest.passingPercentage;
    const timeSpent = (activeTest.durationMinutes * 60) - secondsRemaining;

    const submissionData = {
      testId: activeTest.id,
      testTitle: activeTest.title,
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail.trim() || `${studentPhone}@student.com`,
      score: finalScore,
      totalMarks: totalPossibleMarks,
      percentage,
      isPassed,
      correctCount,
      incorrectCount,
      unattemptedCount,
      timeSpentSeconds: Math.max(10, timeSpent),
      answers,
      reviewStatus: markedForReview
    };

    const saved = await MockTestStorage.saveSubmission(submissionData);
    setFinalSubmission(saved);
    setIsSubmitConfirmOpen(false);
    setStage('result');

    try {
      if (isPassed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {}
  };

  // Timer formatting
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Question counts for palette
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.keys(markedForReview).length;
  const unattemptedCount = activeTest ? activeTest.questions.length - answeredCount : 0;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Universal Examination Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (stage === 'testing') {
                  if (confirm('Are you sure you want to leave? Your test progress will be lost.')) {
                    onBackToWebsite();
                  }
                } else {
                  onBackToWebsite();
                }
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>

            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="font-extrabold text-xs sm:text-sm text-white font-display leading-tight">
                  Dr. Ankita Bisht Academic Academy
                </div>
                <div className="text-[10px] text-slate-400 leading-none">
                  NTA CBT Computer-Based Examination System
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-3">
            {stage === 'testing' && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black border transition-all ${
                  questionSecondsLeft <= 10 
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/30 ring-2 ring-rose-400' 
                    : questionSecondsLeft <= 20 
                      ? 'bg-amber-400 text-slate-950 border-amber-500' 
                      : 'bg-emerald-600 text-white border-emerald-500'
                }`}>
                  <Zap className="w-4 h-4" />
                  <span>Q-Timer: {questionSecondsLeft}s</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Total: {formatTimer(secondsRemaining)}</span>
                </div>
              </div>
            )}

            {stage === 'register' && (
              <div className="text-xs text-emerald-400 font-bold hidden sm:flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>NTA Anti-Cheating Speed Engine Active</span>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* STAGE 1: PRE-TEST REGISTRATION & INSTRUCTIONS */}
      {stage === 'register' && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-100">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Official NTA CBT Mock Test Series 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Online Computer-Based Diagnostic Test
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Attempt authentic questions with real countdown timer, question palette, and instant detailed logic breakdown by Dr. Ankita Bisht.
              </p>
            </div>

            {/* Test Selection Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Test Paper:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tests.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTestId(t.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTestId === t.id
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-indigo-700 uppercase">
                      {t.category}
                    </div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1 line-clamp-2">
                      {t.title}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{t.questions.length} Qs</span>
                      <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">⚡ 35s / Q</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Test Details Box */}
            {activeTest && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{activeTest.title}</h3>
                    <p className="text-xs text-slate-500">{activeTest.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                    <span className="bg-indigo-100 text-indigo-900 px-2.5 py-1 rounded-lg">
                      {activeTest.questions.length} Questions
                    </span>
                    <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                      ⚡ 35s / Q
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg">
                      +{activeTest.positiveMarks} Marks
                    </span>
                  </div>
                </div>

                {/* Anti-Cheating Speed & Single Attempt Protocol */}
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>⚡ Anti-Cheating Speed Test Protocol (35 Seconds/Question)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950 font-medium">
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">•</span>
                      <span><strong>35s / Question:</strong> Har question ke liye 35 seconds ka live timer hai. Time khatam hote hi agla question automatically load hoga.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">•</span>
                      <span><strong>No Nakal / Past Qs Locked:</strong> Ek baar aage badhne ke baad pichhle questions reopen nahi honge.</span>
                    </div>
                    <div className="flex items-start gap-1.5 sm:col-span-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span><strong>🚫 Single Attempt Only:</strong> Exam ko restart ya dobara attempt karne ki anumati nahi hai. Har student ka score seedhe Live Leaderboard par submit hoga.</span>
                    </div>
                  </div>
                </div>

                {/* NTA Palette Legend & Rules */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Exam Instructions &amp; Question Palette Color Codes:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">✓</span>
                      <span className="text-slate-700 font-medium">Answered</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">?</span>
                      <span className="text-slate-700 font-medium">Not Answered</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">🔖</span>
                      <span className="text-slate-700 font-medium">Marked for Review</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-lg bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center">0</span>
                      <span className="text-slate-700 font-medium">Not Visited</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Student Registration Form */}
            <form onSubmit={handleStartTest} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your candidate name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="10-digit mobile number for scorecard"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-700 to-brand-700 hover:from-indigo-800 hover:to-brand-800 text-white font-black text-sm py-4 rounded-2xl shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>🚀 Start NTA CBT Mock Test Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Free • Authentic NTA Pattern • Instant Result &amp; Solutions</span>
              </div>
            </form>

          </div>
        </main>
      )}

      {/* STAGE 2: LIVE CBT TEST TAKING SCREEN */}
      {stage === 'testing' && activeTest && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left / Center Area: Main Question & Options (8 Cols) */}
          <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-md space-y-5">
              
              {/* Question Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-900 text-white font-extrabold text-xs px-3 py-1 rounded-xl">
                    Question {currentQIndex + 1} of {activeTest.questions.length}
                  </span>
                  {activeTest.questions[currentQIndex]?.topic && (
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md hidden sm:inline">
                      {activeTest.questions[currentQIndex].topic}
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <span className="text-emerald-700">+{activeTest.positiveMarks}.0</span>
                  <span>/</span>
                  <span className="text-rose-600">-{activeTest.negativeMarks}.0</span>
                </div>
              </div>

              {/* Question 35s Live Speed Countdown Bar */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      questionSecondsLeft <= 10 ? 'bg-rose-500 animate-ping' : questionSecondsLeft <= 20 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`} />
                    <span className="font-extrabold text-slate-800">
                      35s Question Timer:
                    </span>
                    <span className={`font-mono text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-lg transition-colors ${
                      questionSecondsLeft <= 10 
                        ? 'bg-rose-500 text-white animate-pulse shadow-sm shadow-rose-500/50' 
                        : questionSecondsLeft <= 20 
                          ? 'bg-amber-400 text-slate-950 font-black' 
                          : 'bg-emerald-100 text-emerald-800 font-black'
                    }`}>
                      {questionSecondsLeft}s remaining
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto-advances at 0s</span>
                  </span>
                </div>

                {/* Visual Animated Countdown Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300/60">
                  <div 
                    className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                      questionSecondsLeft <= 10 
                        ? 'bg-rose-500' 
                        : questionSecondsLeft <= 20 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(questionSecondsLeft / 35) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-display">
                {activeTest.questions[currentQIndex]?.question}
              </div>

              {/* 4 Options Grid */}
              <div className="space-y-3 pt-2">
                {activeTest.questions[currentQIndex]?.options.map((opt, optIdx) => {
                  const isSelected = answers[activeTest.questions[currentQIndex].id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-600/20'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <div className="text-xs sm:text-sm leading-relaxed flex-1">
                        {opt}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Bottom Test Navigation Actions */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearResponse}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  🧹 Clear Response
                </button>
                <button
                  type="button"
                  onClick={handleMarkForReviewAndNext}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  🔖 Mark for Review &amp; Next
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-200">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Past Qs Locked (No Nakal)</span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <span>{currentQIndex === activeTest.questions.length - 1 ? 'Finish & Submit Test' : 'Save & Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Area: NTA Question Palette & Candidate Profile (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Candidate Info Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Candidate:</div>
                <div className="font-bold text-slate-900 text-sm">{studentName}</div>
                <div className="text-[11px] text-slate-500">{studentPhone}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm">
                {studentName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Question Palette Matrix */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  NTA Question Palette
                </h4>
                <span className="text-[11px] text-indigo-600 font-bold">
                  {activeTest.questions.length} Total
                </span>
              </div>

              {/* Grid of question buttons */}
              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                {activeTest.questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isMarked = markedForReview[q.id];
                  const isCurrent = currentQIndex === idx;
                  const isVisited = visitedQuestions[q.id];

                  let btnBg = 'bg-slate-200 text-slate-700 hover:bg-slate-300'; // Not visited
                  if (isMarked) {
                    btnBg = 'bg-purple-600 text-white shadow-xs';
                  } else if (isAnswered) {
                    btnBg = 'bg-emerald-500 text-white shadow-xs';
                  } else if (isVisited) {
                    btnBg = 'bg-rose-500 text-white shadow-xs';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${btnBg} ${
                        isCurrent ? 'ring-3 ring-indigo-900 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Live Count Summary */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Answered: {answeredCount}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Unanswered: {unattemptedCount}</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-800 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span>Marked Review: {markedCount}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span>Total: {activeTest.questions.length}</span>
                </div>
              </div>

              {/* Submit Final Test Button */}
              <button
                type="button"
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit CBT Test</span>
              </button>
            </div>

          </div>
        </main>
      )}

      {/* SUBMISSION CONFIRMATION MODAL */}
      {isSubmitConfirmOpen && activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Are you ready to submit your test?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Once submitted, you will immediately see your score, percentile, and question-by-question solutions.
              </p>
            </div>

            {/* Summary counts */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Total Questions:</span>
                <span className="font-bold">{activeTest.questions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Answered:</span>
                <span>{answeredCount}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-bold">
                <span>Unanswered:</span>
                <span>{unattemptedCount}</span>
              </div>
              <div className="flex justify-between text-purple-700 font-bold">
                <span>Marked for Review:</span>
                <span>{markedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={performFinalSubmission}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Yes, Final Submit ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: RESULT & SCORECARD WITH EXPLANATIONS */}
      {stage === 'result' && finalSubmission && activeTest && (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top Scorecard Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full mx-auto bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                finalSubmission.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {finalSubmission.isPassed ? '🏆 Qualified & Passed' : '💡 Needs More Practice'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-2">
                {finalSubmission.studentName}’s Performance Scorecard
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {finalSubmission.testTitle} • Attempted on {new Date(finalSubmission.submittedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Your Score</div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-950 mt-1 font-display">
                  {finalSubmission.score} <span className="text-xs text-slate-400 font-normal">/ {finalSubmission.totalMarks}</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Percentage</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-display">
                  {finalSubmission.percentage}%
                </div>
              </div>

              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Correct / Wrong</div>
                <div className="text-sm font-black text-slate-800 mt-2">
                  <span className="text-emerald-700">{finalSubmission.correctCount} Correct</span> • <span className="text-rose-600">{finalSubmission.incorrectCount} Wrong</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Time Taken</div>
                <div className="text-xl font-black text-slate-800 mt-1">
                  {Math.round(finalSubmission.timeSpentSeconds / 60)} Mins
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Scorecard</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🎯 I scored ${finalSubmission.score}/${finalSubmission.totalMarks} (${finalSubmission.percentage}%) on Dr. Ankita Bisht's UGC NET CBT Mock Test! Try this free test here: https://learnwithdrankita.com/test?id=${encodeURIComponent(activeTest.id)}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              <a
                href={`/results?test=${encodeURIComponent(activeTest.id)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>🏆</span>
                <span>View Live Ranklist</span>
              </a>

              <button
                onClick={onBackToWebsite}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Back to Website</span>
              </button>
            </div>

            {/* Single Attempt Anti-Cheating Banner */}
            <div className="text-center text-[11px] text-amber-800 bg-amber-50 border border-amber-200 py-2 px-3 rounded-xl font-bold">
              🔒 Official Attempt Recorded: In accordance with Anti-Cheating Speed Protocol, exam restart/retake is strictly disabled.
            </div>

          </div>

          {/* Question-by-Question Solution Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 font-display">
                Detailed Question Solutions &amp; Conceptual Explanations
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Curated by Dr. Ankita Bisht
              </span>
            </div>

            <div className="space-y-4">
              {activeTest.questions.map((q, idx) => {
                const studentAns = finalSubmission.answers[q.id];
                const isCorrect = studentAns === q.correctIndex;
                const isUnanswered = studentAns === undefined || studentAns === -1;

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl p-5 sm:p-6 border shadow-xs space-y-3.5 ${
                      isCorrect 
                        ? 'border-emerald-200 bg-emerald-50/10' 
                        : isUnanswered 
                        ? 'border-slate-200' 
                        : 'border-rose-200 bg-rose-50/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Question #{idx + 1}</span>
                        {q.topic && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{q.topic}</span>}
                      </div>

                      <div>
                        {isCorrect ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct (+{activeTest.positiveMarks})</span>
                          </span>
                        ) : isUnanswered ? (
                          <span className="text-slate-500 font-semibold flex items-center gap-1">
                            <HelpCircle className="w-4 h-4" />
                            <span>Not Attempted (0)</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            <span>Incorrect (-{activeTest.negativeMarks})</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm font-bold text-slate-900">
                      {q.question}
                    </div>

                    {/* Options list with highlight */}
                    <div className="space-y-1.5 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = studentAns === optIdx;
                        const isRight = q.correctIndex === optIdx;

                        let optStyle = 'bg-slate-50 text-slate-700 border-slate-200';
                        if (isRight) {
                          optStyle = 'bg-emerald-100/90 text-emerald-950 font-bold border-emerald-400';
                        } else if (isChosen && !isRight) {
                          optStyle = 'bg-rose-100 text-rose-950 font-bold border-rose-300';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${optStyle}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                            </div>

                            <div className="text-[11px] font-bold shrink-0">
                              {isRight && <span className="text-emerald-800">✓ Correct Answer</span>}
                              {isChosen && !isRight && <span className="text-rose-700">✗ Your Choice</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-Step Logic Breakdown */}
                    {q.explanation && (
                      <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1 mt-2">
                        <div className="font-bold flex items-center gap-1 text-indigo-900">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Concept Explanation by Dr. Ankita Bisht:</span>
                        </div>
                        <p className="leading-relaxed text-indigo-900/90">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </main>
      )}

    </div>
  );
};

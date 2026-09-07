import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Copy, 
  Check, 
  Award, 
  Users, 
  Sparkles, 
  MessageSquare, 
  Download, 
  Eye,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  MockTestStorage, 
  type MockTest, 
  type MockQuestion, 
  type TestSubmission
} from '../../services/mockTestService';

export const AdminMockTestsTab: React.FC = () => {
  const [tests, setTests] = useState<MockTest[]>(() => MockTestStorage.getTests());
  const [submissions, setSubmissions] = useState<TestSubmission[]>(() => MockTestStorage.getSubmissions());
  const [activeSubTab, setActiveSubTab] = useState<'tests' | 'submissions' | 'leaderboard'>('tests');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Test Modal State (Create / Edit)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);

  // Question Editor State
  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<MockTest | null>(null);

  // Submission Detail Modal
  const [selectedSubmission, setSelectedSubmission] = useState<TestSubmission | null>(null);

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAllData = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      setTests(MockTestStorage.getTests());
      const cloudSubs = await MockTestStorage.fetchSubmissionsFromCloud();
      setSubmissions(cloudSubs);
    } catch (e) {
      console.warn('Could not sync cloud submissions', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData(false);
  }, []);

  const handleCopyTestLink = (testId: string) => {
    const url = `https://learnwithdrankita.com/test?id=${encodeURIComponent(testId)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(testId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareWhatsAppInvite = (test: MockTest) => {
    const url = `https://learnwithdrankita.com/test?id=${encodeURIComponent(test.id)}`;
    const text = `🎯 *Online NTA CBT Mock Test - Dr. Ankita Bisht Academy*\n\n📝 *Test Name:* ${test.title}\n⏱️ *Duration:* ${test.durationMinutes} Minutes | *Total Marks:* ${test.totalMarks}\n📊 *Subject:* ${test.category}\n\n👉 *Click to Attempt CBT Mock Test Now:* \n${url}\n\n_Instant Answer Evaluation with Step-by-Step Logic Breakdown by Dr. Ankita Bisht._`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendStudentScorecardWhatsApp = (sub: TestSubmission) => {
    const text = `🎉 *Mock Test Scorecard - Dr. Ankita Bisht Academy*\n\nDear *${sub.studentName}*,\nHere is your performance report for *${sub.testTitle}*:\n\n📊 *Your Score:* ${sub.score} / ${sub.totalMarks} (${sub.percentage}%)\n✅ *Correct Answers:* ${sub.correctCount}\n❌ *Incorrect Answers:* ${sub.incorrectCount}\n⏱️ *Time Taken:* ${Math.round(sub.timeSpentSeconds / 60)} Mins\n🏆 *Status:* ${sub.isPassed ? 'PASSED 🌟' : 'NEEDS REVISION 💡'}\n\nKeep learning and practicing!\n~ Dr. Ankita Bisht (Ph.D., Asst. Professor HNBGU)`;
    const phone = sub.studentPhone.replace(/\D/g, '');
    const fullPhone = phone.startsWith('91') ? phone : `91${phone}`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDeleteTest = async (testId: string) => {
    if (confirm('Are you sure you want to delete this Mock Test?')) {
      await MockTestStorage.deleteTest(testId);
      setTests(MockTestStorage.getTests());
    }
  };

  const handleDeleteSubmission = async (subId: string, studentName: string) => {
    if (confirm(`Delete submission by "${studentName}"? This cannot be undone.`)) {
      await MockTestStorage.deleteSubmission(subId);
      setSubmissions(MockTestStorage.getSubmissions());
    }
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;

    await MockTestStorage.saveTest(editingTest);
    setTests(MockTestStorage.getTests());
    setIsTestModalOpen(false);
    setEditingTest(null);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleExportSubmissionsCsv = () => {
    if (submissions.length === 0) {
      alert('No test submissions available to export.');
      return;
    }
    const headers = ['Submission ID', 'Student Name', 'Phone', 'Email', 'Test Title', 'Score', 'Total Marks', 'Percentage', 'Status', 'Time (Mins)', 'Date'];
    const rows = submissions.map(s => [
      s.id,
      `"${s.studentName}"`,
      s.studentPhone,
      s.studentEmail,
      `"${s.testTitle}"`,
      s.score,
      s.totalMarks,
      `${s.percentage}%`,
      s.isPassed ? 'Passed' : 'Failed',
      Math.round(s.timeSpentSeconds / 60),
      new Date(s.submittedAt).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MockTest_Results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalTestsCount = tests.length;
  const activeTestsCount = tests.filter(t => t.status === 'active').length;
  const totalSubmissionsCount = submissions.length;
  const avgScore = submissions.length > 0 
    ? Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / submissions.length)
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 1. Header Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-indigo-800/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
            <FileCheck className="w-3.5 h-3.5" />
            <span>NTA CBT Mock Test Engine &amp; Quiz Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display">
            Mock Tests &amp; Online Examination System
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl">
            Create, schedule, and conduct authentic computer-based tests (CBT) with timer, question palette, automated evaluation, and WhatsApp scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 flex-wrap">
          <button
            onClick={() => {
              const newTest: MockTest = {
                id: `test-${Date.now().toString().slice(-4)}`,
                title: 'New UGC NET Paper 1 Mock Test 2026',
                category: 'UGC NET Paper 1',
                description: 'Authentic 2026 NTA CBT speed test with bilingual explanations.',
                durationMinutes: 30,
                totalMarks: 20,
                positiveMarks: 2,
                negativeMarks: 0,
                passingPercentage: 50,
                status: 'active',
                createdAt: new Date().toISOString(),
                questions: [
                  {
                    id: 'q1',
                    question: 'Which research method is best suited to study cause-and-effect relationships under controlled conditions?',
                    options: ['Historical Method', 'Descriptive Survey', 'Experimental Method', 'Ex-Post Facto Method'],
                    correctIndex: 2,
                    explanation: 'Experimental Method manipulates the Independent Variable under controlled settings to observe its effect on the Dependent Variable.',
                    subject: 'Research Aptitude',
                    topic: 'Research Types',
                    marks: 2
                  }
                ]
              };
              setEditingTest(newTest);
              setIsTestModalOpen(true);
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Mock Test</span>
          </button>

          <a
            href="/test"
            target="_blank"
            rel="noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open CBT Portal ↗</span>
          </a>

          <a
            href="/results"
            target="_blank"
            rel="noreferrer"
            className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-amber-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>View Live Ranklist 🏆</span>
          </a>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* 2. Key Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Total Mock Tests</span>
            <BookOpen className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">{totalTestsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">{activeTestsCount} currently active live</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Tests Attempted</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-900 font-display">{totalSubmissionsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Student evaluations recorded</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Average Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-display">{avgScore}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Overall batch accuracy</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>CBT Engine Status</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NTA 2026 Ready</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Countdown &amp; auto-grading on</div>
        </div>
      </div>

      {/* 3. Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'tests'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Mock Tests ({tests.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('submissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'submissions'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Submissions ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'leaderboard'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Top Rankers &amp; Leaderboard</span>
          </button>
        </div>

        {activeSubTab === 'submissions' && (
          <button
            onClick={handleExportSubmissionsCsv}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* 4. SUBTAB 1: TESTS LIST */}
      {activeSubTab === 'tests' && (
        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {test.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      test.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {test.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {test.id}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display text-slate-900">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {test.description}
                  </p>
                </div>

                {/* Quick Stats Badges */}
                <div className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 shrink-0">
                  <div className="text-center px-2">
                    <div className="font-bold text-slate-800">{test.questions?.length || 0}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Questions</div>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center px-2">
                    <div className="font-bold text-slate-800">{test.durationMinutes}m</div>
                    <div className="text-[10px] text-slate-400 uppercase">Timer</div>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center px-2">
                    <div className="font-bold text-emerald-700">+{test.positiveMarks} / -{test.negativeMarks}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Marking</div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Copy Test Link */}
                  <button
                    onClick={() => handleCopyTestLink(test.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === test.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Test Link</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp Invite */}
                  <button
                    onClick={() => handleShareWhatsAppInvite(test)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs py-2 px-3 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Test Invite</span>
                  </button>

                  {/* Take Test in Student CBT Interface */}
                  <a
                    href={`/test?id=${encodeURIComponent(test.id)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs py-2 px-3 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch CBT Screen</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {/* Manage Questions */}
                  <button
                    onClick={() => setSelectedTestForQuestions(test)}
                    className="bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-xs py-2 px-3 rounded-xl border border-brand-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Questions ({test.questions?.length || 0})</span>
                  </button>

                  {/* Edit Test Settings */}
                  <button
                    onClick={() => {
                      setEditingTest(test);
                      setIsTestModalOpen(true);
                    }}
                    className="text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl cursor-pointer"
                    title="Edit Test Settings"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Test */}
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-2 rounded-xl cursor-pointer"
                    title="Delete Test"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 5. SUBTAB 2: STUDENT SUBMISSIONS TABLE */}
      {activeSubTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-800 text-sm">
                Live Candidate Scorecards ({submissions.length})
              </h4>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Cloud KV Synced
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadAllData(true)}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </button>
              <span className="text-xs text-slate-500 hidden sm:inline">Auto-recorded upon test completion</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Test Attempted</th>
                  <th className="px-4 py-3">Score &amp; Percentage</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Time Spent</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>{sub.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{sub.studentPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800 max-w-xs truncate">{sub.testTitle}</div>
                      <div className="text-[10px] text-slate-400">{new Date(sub.submittedAt).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold">
                      <div className="text-sm text-slate-900">{sub.score} / {sub.totalMarks}</div>
                      <div className="text-[11px] text-indigo-600 font-semibold">{sub.percentage}% Marks</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      <span className="text-emerald-700 font-bold">{sub.correctCount} Correct</span> • <span className="text-rose-600">{sub.incorrectCount} Wrong</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {Math.round(sub.timeSpentSeconds / 60)} Mins
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        sub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.isPassed ? 'PASSED ✓' : 'NEEDS PRACTICE'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer"
                        title="View Full Answer Sheet"
                      >
                        Answer Sheet
                      </button>
                      <button
                        onClick={() => handleSendStudentScorecardWhatsApp(sub)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer inline-flex items-center gap-1"
                        title="Send Scorecard on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSubmission(sub.id, sub.studentName)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 p-1.5 rounded-lg cursor-pointer"
                        title="Delete this submission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUBTAB 3: LEADERBOARD */}
      {activeSubTab === 'leaderboard' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 font-display">
                🏆 Top Performers Leaderboard
              </h4>
              <p className="text-xs text-slate-500">Highest scoring aspirants across all CBT mock test series.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {submissions
              .sort((a, b) => b.percentage - a.percentage || a.timeSpentSeconds - b.timeSpentSeconds)
              .slice(0, 6)
              .map((ranker, i) => (
                <div key={ranker.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    i === 0 ? 'bg-amber-400 text-slate-950 shadow-md' :
                    i === 1 ? 'bg-slate-300 text-slate-900' :
                    i === 2 ? 'bg-amber-700 text-white' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{ranker.studentName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{ranker.testTitle}</div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="font-black text-emerald-700">{ranker.score}/{ranker.totalMarks} ({ranker.percentage}%)</span>
                      <span className="text-slate-400 text-[10px]">{Math.round(ranker.timeSpentSeconds / 60)} mins</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 7. QUESTION BUILDER / EDITOR MODAL */}
      {selectedTestForQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <span className="text-[11px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded">
                  Question Bank Editor
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-1">
                  {selectedTestForQuestions.title} ({selectedTestForQuestions.questions.length} Questions)
                </h3>
              </div>
              <button
                onClick={() => setSelectedTestForQuestions(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4 text-xs">
              {selectedTestForQuestions.questions.map((q, qIdx) => (
                <div key={q.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 text-xs">
                      Question #{qIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedQuestions = selectedTestForQuestions.questions.filter((_, idx) => idx !== qIdx);
                        const updatedTest = { ...selectedTestForQuestions, questions: updatedQuestions };
                        setSelectedTestForQuestions(updatedTest);
                        MockTestStorage.saveTest(updatedTest);
                        setTests(MockTestStorage.getTests());
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Text */}
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...selectedTestForQuestions.questions];
                      updated[qIdx] = { ...updated[qIdx], question: e.target.value };
                      const updatedTest = { ...selectedTestForQuestions, questions: updated };
                      setSelectedTestForQuestions(updatedTest);
                      MockTestStorage.saveTest(updatedTest);
                      setTests(MockTestStorage.getTests());
                    }}
                    placeholder="Enter question text..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                  />

                  {/* 4 Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctIndex === optIdx}
                          onChange={() => {
                            const updated = [...selectedTestForQuestions.questions];
                            updated[qIdx] = { ...updated[qIdx], correctIndex: optIdx };
                            const updatedTest = { ...selectedTestForQuestions, questions: updated };
                            setSelectedTestForQuestions(updatedTest);
                            MockTestStorage.saveTest(updatedTest);
                            setTests(MockTestStorage.getTests());
                          }}
                          className="text-indigo-600 cursor-pointer"
                          title="Mark as correct answer"
                        />
                        <span className="font-bold text-slate-500">{String.fromCharCode(65 + optIdx)}.</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...selectedTestForQuestions.questions];
                            const newOpts = [...updated[qIdx].options];
                            newOpts[optIdx] = e.target.value;
                            updated[qIdx] = { ...updated[qIdx], options: newOpts };
                            const updatedTest = { ...selectedTestForQuestions, questions: updated };
                            setSelectedTestForQuestions(updatedTest);
                            MockTestStorage.saveTest(updatedTest);
                            setTests(MockTestStorage.getTests());
                          }}
                          className={`flex-1 px-2.5 py-1.5 border rounded-xl bg-white ${
                            q.correctIndex === optIdx ? 'border-emerald-500 bg-emerald-50/50 font-bold text-emerald-950' : 'border-slate-300'
                          }`}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">
                      Step-by-Step Solution &amp; Conceptual Rationale
                    </label>
                    <textarea
                      rows={2}
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [...selectedTestForQuestions.questions];
                        updated[qIdx] = { ...updated[qIdx], explanation: e.target.value };
                        const updatedTest = { ...selectedTestForQuestions, questions: updated };
                        setSelectedTestForQuestions(updatedTest);
                        MockTestStorage.saveTest(updatedTest);
                        setTests(MockTestStorage.getTests());
                      }}
                      placeholder="Dr. Ankita Bisht's step-by-step logic and concept breakdown..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl bg-white text-xs text-slate-700"
                    />
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <button
                type="button"
                onClick={() => {
                  const newQ: MockQuestion = {
                    id: `q-${Date.now().toString().slice(-4)}`,
                    question: 'New Concept Question...',
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctIndex: 0,
                    explanation: 'Step-by-step rationale for the correct answer.',
                    marks: 2
                  };
                  const updatedTest = {
                    ...selectedTestForQuestions,
                    questions: [...selectedTestForQuestions.questions, newQ]
                  };
                  setSelectedTestForQuestions(updatedTest);
                  MockTestStorage.saveTest(updatedTest);
                  setTests(MockTestStorage.getTests());
                }}
                className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-2xl border-2 border-dashed border-indigo-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Another Question</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTestForQuestions(null)}
                className="bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow"
              >
                Done Editing Questions ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CREATE / EDIT TEST SETTINGS MODAL */}
      {isTestModalOpen && editingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-lg font-bold font-display text-slate-900">
                Mock Test Configuration
              </h3>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  value={editingTest.title}
                  onChange={(e) => setEditingTest({ ...editingTest, title: e.target.value })}
                  placeholder="e.g. UGC NET Paper 1 - All India CBT Mock Test"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingTest.category}
                    onChange={(e) => setEditingTest({ ...editingTest, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="UGC NET Paper 1">UGC NET Paper 1</option>
                    <option value="Research Methodology">Research Methodology</option>
                    <option value="CDP & Pedagogy">CDP &amp; Pedagogy</option>
                    <option value="Home Science">Home Science</option>
                    <option value="Teaching Aptitude">Teaching Aptitude</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingTest.status}
                    onChange={(e) => setEditingTest({ ...editingTest, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Timer (Minutes)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={editingTest.durationMinutes}
                    onChange={(e) => setEditingTest({ ...editingTest, durationMinutes: parseInt(e.target.value, 10) || 30 })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks / Correct (+)</label>
                  <input
                    type="number"
                    required
                    value={editingTest.positiveMarks}
                    onChange={(e) => setEditingTest({ ...editingTest, positiveMarks: parseFloat(e.target.value) || 2 })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Negative (-) Marks</label>
                  <input
                    type="number"
                    step="0.25"
                    value={editingTest.negativeMarks}
                    onChange={(e) => setEditingTest({ ...editingTest, negativeMarks: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingTest.description}
                  onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                  placeholder="Test syllabus coverage and instructions..."
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl font-bold shadow cursor-pointer"
                >
                  Save Test Configuration ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. SUBMISSION ANSWER SHEET REVIEW MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Student Evaluation Report
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-1">
                  {selectedSubmission.studentName} — {selectedSubmission.testTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Score</div>
                <div className="text-xl font-black text-indigo-950 mt-0.5">{selectedSubmission.score} / {selectedSubmission.totalMarks}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Percentage</div>
                <div className="text-xl font-black text-emerald-700 mt-0.5">{selectedSubmission.percentage}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Time Taken</div>
                <div className="text-xl font-black text-slate-800 mt-0.5">{Math.round(selectedSubmission.timeSpentSeconds / 60)} Mins</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-800">Student Contact &amp; Summary:</div>
              <div className="text-slate-600">📱 Mobile: {selectedSubmission.studentPhone}</div>
              <div className="text-slate-600">✉️ Email: {selectedSubmission.studentEmail}</div>
              <div className="text-slate-600">📅 Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleSendStudentScorecardWhatsApp(selectedSubmission)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send Scorecard on WhatsApp</span>
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

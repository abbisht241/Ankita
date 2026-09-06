import React, { useState, useMemo } from 'react';
import {
  Award,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Trophy,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Sparkles,
  Filter,
  MessageSquare
} from 'lucide-react';
import { MockTestStorage } from '../services/mockTestService';

interface PublicLeaderboardPageProps {
  onBackToWebsite: () => void;
}

export const PublicLeaderboardPage: React.FC<PublicLeaderboardPageProps> = ({ onBackToWebsite }) => {
  const allSubmissions = MockTestStorage.getSubmissions();
  const allTests = MockTestStorage.getTests();

  const [selectedTestId, setSelectedTestId] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // Build unique test list from submissions
  const testOptions = useMemo(() => {
    const map: Record<string, string> = { all: '🏆 All Tests Combined' };
    allSubmissions.forEach(s => {
      map[s.testId] = s.testTitle;
    });
    return Object.entries(map);
  }, [allSubmissions]);

  // Filter + rank submissions
  const rankedSubmissions = useMemo(() => {
    const filtered = selectedTestId === 'all'
      ? allSubmissions
      : allSubmissions.filter(s => s.testId === selectedTestId);

    // Sort: highest percentage first, then faster time
    return [...filtered].sort(
      (a, b) => b.percentage - a.percentage || a.timeSpentSeconds - b.timeSpentSeconds
    );
  }, [allSubmissions, selectedTestId]);

  const topThree = rankedSubmissions.slice(0, 3);

  const avgScore = rankedSubmissions.length > 0
    ? Math.round(rankedSubmissions.reduce((acc, s) => acc + s.percentage, 0) / rankedSubmissions.length)
    : 0;
  const passedCount = rankedSubmissions.filter(s => s.isPassed).length;

  // Share link
  const shareUrl = `https://learnwithdrankita.com/results${selectedTestId !== 'all' ? `?test=${encodeURIComponent(selectedTestId)}` : ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const topRankers = topThree
      .map((s, i) => `${['🥇', '🥈', '🥉'][i]} *Rank #${i + 1}* — ${s.studentName}: ${s.score}/${s.totalMarks} (${s.percentage}%)`)
      .join('\n');

    const testName = selectedTestId === 'all'
      ? 'All India NTA CBT Mock Test'
      : (allTests.find(t => t.id === selectedTestId)?.title || 'NTA CBT Mock Test');

    const msg = `🏆 *Live Leaderboard — Dr. Ankita Bisht Academy*\n\n📝 *${testName}*\n👥 *Total Aspirants:* ${rankedSubmissions.length}\n📊 *Avg Score:* ${avgScore}%\n\n${topRankers || 'Be the first to attempt!'}\n\n👉 *View Full Live Ranklist:*\n${shareUrl}\n\n_Attempt Free NTA CBT Mock Test:_\nhttps://learnwithdrankita.com/test`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const medalColors: Record<number, { ring: string; badge: string; crown: string; text: string }> = {
    0: { ring: 'ring-4 ring-amber-400 shadow-amber-300/60 shadow-xl', badge: 'from-amber-400 to-yellow-500', crown: '👑', text: 'text-amber-700' },
    1: { ring: 'ring-4 ring-slate-400 shadow-slate-300/60 shadow-xl', badge: 'from-slate-400 to-slate-500', crown: '🥈', text: 'text-slate-600' },
    2: { ring: 'ring-4 ring-amber-700 shadow-amber-700/30 shadow-xl', badge: 'from-amber-600 to-amber-700', crown: '🥉', text: 'text-amber-800' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 font-sans text-white selection:bg-indigo-600">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </button>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <div className="leading-tight">
                <div className="font-bold text-xs sm:text-sm text-white">Dr. Ankita Bisht Academy</div>
                <div className="text-[10px] text-slate-400">Live Mock Test Leaderboard</div>
              </div>
            </div>
          </div>

          {/* Share Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-xl shadow transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative py-12 sm:py-16 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-brand-600/20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/30">
            <Trophy className="w-4 h-4" />
            <span>Live All India Ranklist</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display leading-tight">
            UGC NET Mock Test<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">
              Leaderboard 2026
            </span>
          </h1>
          <p className="text-slate-400 text-sm">
            Dr. Ankita Bisht Academy · NTA CBT Series · Real-time student rankings
          </p>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 mt-8 max-w-2xl mx-auto grid grid-cols-3 gap-4">
          {[
            { icon: Users, val: rankedSubmissions.length, label: 'Total Attempts' },
            { icon: TrendingUp, val: `${avgScore}%`, label: 'Avg Score' },
            { icon: CheckCircle2, val: passedCount, label: 'Qualified' },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <Icon className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <div className="text-xl sm:text-2xl font-black text-white">{val}</div>
              <div className="text-[11px] text-slate-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Test:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {testOptions.map(([id, title]) => (
              <button
                key={id}
                onClick={() => setSelectedTestId(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTestId === id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {title.length > 40 ? title.slice(0, 40) + '...' : title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 space-y-8">

        {/* Empty State */}
        {rankedSubmissions.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-xl font-bold text-white">No attempts yet for this test</h3>
            <p className="text-slate-400 text-sm">Be the first to attempt and claim Rank #1!</p>
            <a
              href="/test"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Attempt CBT Mock Test Now</span>
            </a>
          </div>
        )}

        {/* TOP 3 PODIUM */}
        {topThree.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-xl font-extrabold text-white font-display">🏆 Top Performers Podium</h2>
              <p className="text-slate-400 text-xs mt-1">Highest scorers • fastest solvers</p>
            </div>

            {/* Podium Flex (2nd | 1st | 3rd) */}
            <div className="flex items-end justify-center gap-3 sm:gap-5">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center gap-3 flex-1 max-w-[180px]">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl font-black bg-gradient-to-br ${medalColors[1].badge} ${medalColors[1].ring}`}>
                    {topThree[1].studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm truncate max-w-[140px]">{topThree[1].studentName}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[140px]">{topThree[1].testTitle.split('-')[0].trim()}</div>
                    <div className="text-sm font-black text-slate-200 mt-1">{topThree[1].score}/{topThree[1].totalMarks}</div>
                    <div className={`font-black text-lg ${medalColors[1].text.replace('text-', 'text-')}`}>{topThree[1].percentage}%</div>
                  </div>
                  <div className={`w-full bg-gradient-to-t from-slate-400/40 to-slate-400/20 rounded-t-2xl border border-white/10 flex items-center justify-center py-4`} style={{ height: '80px' }}>
                    <span className="text-3xl">🥈</span>
                  </div>
                </div>
              )}

              {/* 1st Place — tallest */}
              {topThree[0] && (
                <div className="flex flex-col items-center gap-3 flex-1 max-w-[200px]">
                  <div className="text-2xl animate-bounce">👑</div>
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl font-black bg-gradient-to-br ${medalColors[0].badge} ${medalColors[0].ring}`}>
                    {topThree[0].studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm sm:text-base truncate max-w-[160px]">{topThree[0].studentName}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[160px]">{topThree[0].testTitle.split('-')[0].trim()}</div>
                    <div className="text-base font-black text-white mt-1">{topThree[0].score}/{topThree[0].totalMarks}</div>
                    <div className="font-black text-2xl text-amber-400">{topThree[0].percentage}%</div>
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-500/40 to-amber-500/20 rounded-t-2xl border border-amber-500/20 flex items-center justify-center py-4" style={{ height: '120px' }}>
                    <span className="text-4xl">🥇</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center gap-3 flex-1 max-w-[180px]">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl font-black bg-gradient-to-br ${medalColors[2].badge} ${medalColors[2].ring}`}>
                    {topThree[2].studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm truncate max-w-[140px]">{topThree[2].studentName}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[140px]">{topThree[2].testTitle.split('-')[0].trim()}</div>
                    <div className="text-sm font-black text-slate-200 mt-1">{topThree[2].score}/{topThree[2].totalMarks}</div>
                    <div className="font-black text-lg text-amber-700">{topThree[2].percentage}%</div>
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-800/40 to-amber-800/20 rounded-t-2xl border border-white/10 flex items-center justify-center py-4" style={{ height: '60px' }}>
                    <span className="text-3xl">🥉</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Rank Table */}
        {rankedSubmissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-extrabold text-white font-display flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                Complete Ranklist ({rankedSubmissions.length} Students)
              </h2>
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Ranklist</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 px-4 sm:px-6 py-3 bg-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4 sm:col-span-3">Student</div>
                <div className="col-span-4 sm:col-span-3 hidden sm:block">Test</div>
                <div className="col-span-3 sm:col-span-2 text-right sm:text-center">Score</div>
                <div className="col-span-2 text-right sm:text-center hidden sm:block">Time</div>
                <div className="col-span-3 sm:col-span-2 text-right">Result</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {rankedSubmissions.map((sub, i) => {
                  const rankNum = i + 1;
                  const isTop3 = rankNum <= 3;
                  const rankEmoji = ['🥇', '🥈', '🥉'][i] || null;

                  return (
                    <div
                      key={sub.id}
                      className={`grid grid-cols-12 gap-2 px-4 sm:px-6 py-4 items-center transition-colors ${
                        isTop3
                          ? 'bg-gradient-to-r from-indigo-900/30 to-transparent'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Rank */}
                      <div className="col-span-1 flex items-center justify-center">
                        {rankEmoji ? (
                          <span className="text-xl">{rankEmoji}</span>
                        ) : (
                          <span className="w-7 h-7 rounded-lg bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center">
                            {rankNum}
                          </span>
                        )}
                      </div>

                      {/* Student Name */}
                      <div className="col-span-4 sm:col-span-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {sub.studentName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs sm:text-sm truncate">{sub.studentName}</div>
                            <div className="text-[10px] text-slate-500 truncate">{sub.studentPhone}</div>
                          </div>
                        </div>
                      </div>

                      {/* Test Name */}
                      <div className="col-span-3 min-w-0 hidden sm:block">
                        <div className="text-xs text-slate-400 truncate">{sub.testTitle.split('(')[0].trim()}</div>
                        <div className="text-[10px] text-slate-600">{new Date(sub.submittedAt).toLocaleDateString()}</div>
                      </div>

                      {/* Score */}
                      <div className="col-span-3 sm:col-span-2 text-right sm:text-center">
                        <div className="font-black text-white text-sm sm:text-base">{sub.percentage}%</div>
                        <div className="text-[11px] text-slate-400">{sub.score}/{sub.totalMarks} marks</div>
                      </div>

                      {/* Time */}
                      <div className="col-span-2 text-center hidden sm:flex items-center justify-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{Math.round(sub.timeSpentSeconds / 60)}m</span>
                      </div>

                      {/* Result Badge */}
                      <div className="col-span-3 sm:col-span-2 text-right">
                        {sub.isPassed ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-500/30">
                            <XCircle className="w-3 h-3" />
                            Practice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CTA Footer */}
        <div className="bg-gradient-to-r from-indigo-900/60 to-brand-900/60 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 text-center space-y-4">
          <div className="text-2xl">🚀</div>
          <h3 className="text-xl font-extrabold font-display text-white">
            Want to see YOUR name here?
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Attempt the free NTA CBT Mock Test and get your instant scorecard with step-by-step solutions by Dr. Ankita Bisht.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/test"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Attempt Free Mock Test</span>
            </a>
            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 px-5 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Ranklist on WhatsApp</span>
            </button>
          </div>

          {/* Share Link Box */}
          <div className="mt-4 bg-white/10 rounded-2xl border border-white/10 p-3 flex items-center gap-2 max-w-lg mx-auto">
            <div className="flex-1 text-xs text-slate-400 text-left truncate font-mono">{shareUrl}</div>
            <button
              onClick={handleCopyLink}
              className="shrink-0 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

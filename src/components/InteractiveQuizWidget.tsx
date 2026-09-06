import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { quizQuestions } from '../data/quizData';

export const InteractiveQuizWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (score >= 3) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // fallback
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-brand-200/80 shadow-premium p-6 sm:p-8 max-w-3xl mx-auto relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Live Diagnostic Practice Quiz
            </h3>
            <p className="text-xs text-slate-500">
              UGC NET Paper 1, Research &amp; CDP High-Yield Questions
            </p>
          </div>
        </div>

        {!isFinished && (
          <div className="flex items-center gap-2 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200 text-xs font-bold text-brand-800">
            <span>Question {currentIndex + 1} of {quizQuestions.length}</span>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
            <div 
              className="bg-brand-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Category & Topic Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-brand-100 text-brand-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              {currentQ.subject}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Topic: {currentQ.topic}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ml-auto ${
              currentQ.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
              currentQ.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
            {currentQ.question}
          </h4>

          {/* Options Grid */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-xs';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                } else {
                  btnStyle = 'bg-slate-50 opacity-50 border-slate-200 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isAnswered && isCorrect ? 'bg-emerald-600 text-white' :
                      isAnswered && isSelected && !isCorrect ? 'bg-rose-600 text-white' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="bg-brand-50/70 rounded-2xl p-4 border border-brand-200/80 mb-6 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-900 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Concept Breakdown &amp; Explanation:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{currentIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Final Score'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Result Screen */
        <div className="text-center py-6 space-y-6 animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-xl">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h4 className="text-2xl font-bold font-display text-slate-900">
              Quiz Completed!
            </h4>
            <p className="text-slate-600 text-sm mt-1">
              You scored <span className="font-extrabold text-brand-700 text-xl">{score} / {quizQuestions.length}</span>
            </p>
            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
              {score >= 4 
                ? '🔥 Outstanding! Your conceptual foundation is strong. Join our advance batch to lock in a top rank.'
                : score >= 2 
                ? '👍 Good attempt! You have basic clarity but need systematic coverage in Research and Pedagogy subtleties.'
                : '📚 You need structured guidance. Our concept-first classes will eliminate your negative marks.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <a
              href="#courses"
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Complete Batches</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
};

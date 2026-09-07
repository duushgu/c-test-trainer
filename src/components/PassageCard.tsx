import React, { useRef } from 'react';
import type { CTestPassage, GapToken } from '../core/cTestEngine';
import type { PassageScore } from '../core/evaluator';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface PassageCardProps {
  passage: CTestPassage;
  userAnswers: Record<string, string>;
  onAnswerChange: (gapId: string, val: string) => void;
  isSubmitted: boolean;
  score?: PassageScore;
  showHints?: boolean;
}

export const PassageCard: React.FC<PassageCardProps> = ({
  passage,
  userAnswers,
  onAnswerChange,
  isSubmitted,
  score,
  showHints = false,
}) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    gap: GapToken,
    currentIndex: number
  ) => {
    // Navigation on Backspace when empty
    if (e.key === 'Backspace' && !userAnswers[gap.id] && currentIndex > 0) {
      e.preventDefault();
      const prevGap = passage.gaps[currentIndex - 1];
      inputRefs.current[prevGap.id]?.focus();
    }

    // Arrow Right at the end of input
    if (e.key === 'ArrowRight' && currentIndex < passage.gaps.length - 1) {
      const input = e.currentTarget;
      if (input.selectionStart === input.value.length) {
        inputRefs.current[passage.gaps[currentIndex + 1].id]?.focus();
      }
    }

    // Arrow Left at the beginning of input
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      const input = e.currentTarget;
      if (input.selectionStart === 0) {
        inputRefs.current[passage.gaps[currentIndex - 1].id]?.focus();
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    gap: GapToken,
    currentIndex: number
  ) => {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
    onAnswerChange(gap.id, val);

    // Auto-advance to next gap when full word suffix length is reached
    if (val.length >= gap.gapLength && currentIndex < passage.gaps.length - 1) {
      const nextGap = passage.gaps[currentIndex + 1];
      inputRefs.current[nextGap.id]?.focus();
    }
  };

  const getEvaluation = (gapId: string) => {
    if (!score) return null;
    return score.evaluations.find((e) => e.gapId === gapId);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-all">
      {/* Passage Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {passage.domain || 'Academic'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
              {passage.difficulty || 'C1'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
            {passage.title}
          </h2>
        </div>

        {isSubmitted && score && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Score:</span>
            <span
              className={`text-sm font-bold font-mono ${
                score.percentage >= 70
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : score.percentage >= 50
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {score.correctGaps} / {score.totalGaps} ({score.percentage}%)
            </span>
          </div>
        )}
      </div>

      {/* Passage Text Body */}
      <div className="text-slate-800 dark:text-slate-200 leading-relaxed sm:leading-loose text-base sm:text-lg select-text">
        {passage.sentences.map((sentence) => (
          <span key={`s-${sentence.index}`} className="inline">
            {sentence.tokens.map((token, tIdx) => {
              if (token.type === 'plain') {
                return (
                  <span
                    key={`t-${sentence.index}-${tIdx}`}
                    className={
                      sentence.isLeadIn || sentence.isLeadOut
                        ? 'font-medium text-slate-700 dark:text-slate-300'
                        : ''
                    }
                  >
                    {token.text}
                  </span>
                );
              }

              // Gap Token
              const gap = token.gap;
              const evalResult = getEvaluation(gap.id);
              const userVal = userAnswers[gap.id] || '';

              // Dynamic width based on gap letter count (min 3ch for typing comfort)
              const widthStyle = {
                width: `${Math.max(gap.gapLength + 1, 3.2)}ch`,
              };

              return (
                <span
                  key={`gap-${gap.id}`}
                  className="inline-flex items-baseline mx-0.5 whitespace-nowrap"
                >
                  {/* Intact Prefix */}
                  <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded-l border border-r-0 border-slate-300 dark:border-slate-700 select-none">
                    {gap.prefix}
                  </span>

                  {/* Suffix Input / Reveal */}
                  {!isSubmitted ? (
                    <input
                      ref={(el) => {
                        inputRefs.current[gap.id] = el;
                      }}
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      style={widthStyle}
                      maxLength={gap.gapLength}
                      value={userVal}
                      onChange={(e) => handleChange(e, gap, gap.gapIndex)}
                      onKeyDown={(e) => handleKeyDown(e, gap, gap.gapIndex)}
                      placeholder={showHints ? gap.suffix[0] + '·'.repeat(gap.gapLength - 1) : '·'.repeat(gap.gapLength)}
                      className={`gap-input px-1 py-0.5 text-center font-mono font-bold text-base bg-white dark:bg-slate-950 border rounded-r focus:outline-none focus:ring-2 focus:z-10 transition-all ${
                        userVal.length === gap.gapLength
                          ? 'border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 ring-1 ring-blue-400/20'
                          : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-blue-500/30'
                      }`}
                    />
                  ) : (
                    // Submitted Evaluation View
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-base font-bold px-1.5 py-0.5 rounded-r border ${
                        evalResult?.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {evalResult?.isCorrect ? (
                        <>
                          <span>{gap.suffix}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 inline" />
                        </>
                      ) : (
                        <>
                          <span className="line-through text-xs opacity-70">
                            {userVal || '—'}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold underline">
                            {gap.suffix}
                          </span>
                          <XCircle className="w-3.5 h-3.5 text-rose-500 inline" />
                        </>
                      )}
                    </span>
                  )}
                </span>
              );
            })}
            {' '}
          </span>
        ))}
      </div>

      {/* Footer Instructions / Hints */}
      {!isSubmitted && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
              Tab / Arrows
            </span>
            <span>Jump between gaps</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>2nd half of every 2nd word is truncated. Lead-in & lead-out sentences are untouched.</span>
          </div>
        </div>
      )}
    </div>
  );
};

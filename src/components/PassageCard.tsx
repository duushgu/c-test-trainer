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
    <div className="bg-white dark:bg-[#1e2030] border border-slate-200 dark:border-[#363a4f] rounded-2xl p-6 sm:p-8 shadow-sm transition-all">
      {/* Passage Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-[#2e3248]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#24273a] text-slate-700 dark:text-[#b8c0e0] border border-slate-200 dark:border-[#363a4f]">
              {passage.domain || 'Academic'}
            </span>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-[#24273a] text-purple-700 dark:text-[#c6a0f6] border border-purple-200 dark:border-[#c6a0f6]/30">
              {passage.difficulty || 'C1'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#cad3f5] mt-2">
            {passage.title}
          </h2>
        </div>

        {isSubmitted && score && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#24273a] border border-slate-200 dark:border-[#363a4f]">
            <span className="text-xs font-medium text-slate-500 dark:text-[#939ab7]">Score:</span>
            <span
              className={`text-sm font-bold font-mono ${
                score.percentage >= 70
                  ? 'text-emerald-600 dark:text-[#a6da95]'
                  : score.percentage >= 50
                  ? 'text-amber-600 dark:text-[#f5a97f]'
                  : 'text-rose-600 dark:text-[#ed8796]'
              }`}
            >
              {score.correctGaps} / {score.totalGaps} ({score.percentage}%)
            </span>
          </div>
        )}
      </div>

      {/* Passage Text Body */}
      <div className="text-slate-800 dark:text-[#cad3f5] leading-relaxed sm:leading-loose text-base sm:text-lg select-text">
        {passage.sentences.map((sentence) => (
          <span key={`s-${sentence.index}`} className="inline">
            {sentence.tokens.map((token, tIdx) => {
              if (token.type === 'plain') {
                return (
                  <span
                    key={`t-${sentence.index}-${tIdx}`}
                    className={
                      sentence.isLeadIn || sentence.isLeadOut
                        ? 'font-medium text-slate-700 dark:text-[#a5adcb]'
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

              // Dynamic width based on gap letter count
              const widthStyle = {
                width: `${Math.max(gap.gapLength + 0.8, 2.8)}ch`,
              };

              return (
                <span
                  key={`gap-${gap.id}`}
                  className="inline-block mx-0.5 my-0.5 align-middle"
                >
                  {!isSubmitted ? (
                    // UNIFIED SEAMLESS PILL (No stepped offset)
                    <span
                      className={`inline-flex items-center h-8 rounded-lg border overflow-hidden font-mono text-sm sm:text-base shadow-xs transition-all focus-within:ring-2 focus-within:ring-[#b7bdf8]/40 ${
                        userVal.length === gap.gapLength
                          ? 'border-[#b7bdf8] dark:border-[#b7bdf8] bg-slate-50 dark:bg-[#24273a]'
                          : 'border-slate-300 dark:border-[#363a4f] bg-slate-50 dark:bg-[#24273a] hover:border-slate-400 dark:hover:border-[#494d64]'
                      }`}
                    >
                      {/* Intact Prefix */}
                      <span className="h-full flex items-center justify-center px-2 bg-slate-200/70 dark:bg-[#181926] text-slate-700 dark:text-[#cad3f5] font-semibold border-r border-slate-300 dark:border-[#363a4f] select-none">
                        {gap.prefix}
                      </span>

                      {/* Input Field */}
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
                        className="h-full px-1.5 text-center font-mono font-bold bg-transparent text-purple-700 dark:text-[#b7bdf8] focus:outline-none focus:ring-0 border-0 placeholder:text-slate-400 dark:placeholder:text-[#6e738d]"
                      />
                    </span>
                  ) : (
                    // SUBMITTED REVIEW PILL (Unified and perfectly aligned)
                    <span
                      className={`inline-flex items-center h-8 rounded-lg border overflow-hidden font-mono text-sm sm:text-base shadow-xs transition-all ${
                        evalResult?.isCorrect
                          ? 'border-emerald-400 dark:border-[#a6da95]/60 bg-emerald-50/40 dark:bg-[#24273a]'
                          : 'border-rose-400 dark:border-[#ed8796]/60 bg-rose-50/40 dark:bg-[#24273a]'
                      }`}
                    >
                      {/* Prefix */}
                      <span className="h-full flex items-center justify-center px-2 bg-slate-200/70 dark:bg-[#181926] text-slate-700 dark:text-[#cad3f5] font-semibold border-r border-slate-300 dark:border-[#363a4f] select-none">
                        {gap.prefix}
                      </span>

                      {/* Evaluation Answer */}
                      <span className="h-full flex items-center justify-center px-2 gap-1.5 font-bold">
                        {evalResult?.isCorrect ? (
                          <>
                            <span className="text-emerald-700 dark:text-[#a6da95]">{gap.suffix}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#a6da95]" />
                          </>
                        ) : (
                          <>
                            <span className="line-through text-xs text-rose-500 dark:text-[#ed8796]/70">
                              {userVal || '—'}
                            </span>
                            <span className="text-emerald-700 dark:text-[#a6da95] underline decoration-dotted">
                              {gap.suffix}
                            </span>
                            <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-[#ed8796]" />
                          </>
                        )}
                      </span>
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
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#2e3248] flex flex-wrap items-center justify-between text-xs text-slate-400 dark:text-[#939ab7] gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-slate-100 dark:bg-[#24273a] px-2 py-0.5 rounded text-slate-600 dark:text-[#b8c0e0] border border-slate-200 dark:border-[#363a4f]">
              Tab / Arrows
            </span>
            <span>Jump between gaps</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#939ab7]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-[#eed49f]" />
            <span>2nd half of every 2nd word is truncated. Lead-in & lead-out sentences remain untouched.</span>
          </div>
        </div>
      )}
    </div>
  );
};

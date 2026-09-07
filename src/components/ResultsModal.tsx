import React, { useEffect } from 'react';
import type { BatteryScore } from '../core/evaluator';
import type { CTestPassage } from '../core/cTestEngine';
import { buildSentenceCloze, generateAnkiExportText, downloadAnkiDeck, type AnkiCard } from '../core/ankiExporter';
import confetti from 'canvas-confetti';
import { Award, Download, RotateCcw, ArrowRight } from 'lucide-react';

interface ResultsModalProps {
  score: BatteryScore;
  passages: CTestPassage[];
  onRetry: () => void;
  onNextBattery: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  score,
  passages,
  onRetry,
  onNextBattery,
}) => {
  useEffect(() => {
    if (score.percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [score.percentage]);

  // Collect all failed gaps across all passages
  const allFailedCards: AnkiCard[] = [];
  score.passageScores.forEach((pScore) => {
    const passage = passages.find((p) => p.id === pScore.passageId);
    if (!passage) return;
    const failedGaps = pScore.evaluations.filter((e) => !e.isCorrect);
    if (failedGaps.length > 0) {
      const cards = buildSentenceCloze(passage, failedGaps);
      allFailedCards.push(...cards);
    }
  });

  const handleExportAnki = () => {
    if (allFailedCards.length === 0) return;
    const tsvContent = generateAnkiExportText(allFailedCards);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnkiDeck(`c_test_anki_mistakes_${dateStr}.txt`, tsvContent);
  };

  const getBadgeColor = (level: BatteryScore['cefrLevel']) => {
    switch (level) {
      case 'C2':
        return 'bg-purple-50 text-purple-700 dark:bg-[#24273a] dark:text-[#c6a0f6] border-purple-300 dark:border-[#c6a0f6]/40';
      case 'C1':
        return 'bg-blue-50 text-blue-700 dark:bg-[#24273a] dark:text-[#b7bdf8] border-blue-300 dark:border-[#b7bdf8]/40';
      case 'B2':
        return 'bg-emerald-50 text-emerald-700 dark:bg-[#24273a] dark:text-[#a6da95] border-emerald-300 dark:border-[#a6da95]/40';
      case 'B1':
        return 'bg-amber-50 text-amber-700 dark:bg-[#24273a] dark:text-[#f5a97f] border-amber-300 dark:border-[#f5a97f]/40';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-[#24273a] dark:text-[#cad3f5] border-slate-300 dark:border-[#363a4f]';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e2030] border border-slate-200 dark:border-[#363a4f] rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto my-8 transition-all">
      {/* Top Banner */}
      <div className="text-center pb-8 border-b border-slate-100 dark:border-[#2e3248]">
        <div className="inline-flex p-3 rounded-2xl bg-purple-50 dark:bg-[#24273a] text-purple-600 dark:text-[#c6a0f6] mb-4 border border-purple-100 dark:border-[#c6a0f6]/30">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#cad3f5]">
          C-Test Battery Evaluation
        </h2>
        <p className="text-sm text-slate-500 dark:text-[#939ab7] mt-1 max-w-lg mx-auto">
          Standardized psychometric score calculated based on the complete battery of authentic passages.
        </p>

        {/* Big Score Card */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <div className="text-center px-6 py-4 rounded-2xl bg-slate-50 dark:bg-[#24273a] border border-slate-200 dark:border-[#363a4f]">
            <span className="text-xs uppercase font-mono text-slate-400 dark:text-[#939ab7] tracking-wider">Score</span>
            <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-[#cad3f5] mt-1">
              {score.correctGaps} <span className="text-xl text-slate-400 font-normal">/ {score.totalGaps}</span>
            </div>
            <span className="text-xs font-semibold text-purple-600 dark:text-[#b7bdf8]">
              {score.percentage}% Accuracy
            </span>
          </div>

          <div className={`px-6 py-4 rounded-2xl border ${getBadgeColor(score.cefrLevel)} text-center`}>
            <span className="text-xs uppercase font-mono tracking-wider opacity-80">CEFR Benchmark</span>
            <div className="text-4xl font-extrabold font-mono mt-1">
              {score.cefrLevel}
            </div>
            <span className="text-xs font-semibold">
              {score.cefrTitle.split('(')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown per Passage */}
      <div className="mt-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-[#cad3f5]">
          Passage-by-Passage Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {score.passageScores.map((pScore, idx) => {
            const passage = passages.find((p) => p.id === pScore.passageId);
            return (
              <div
                key={pScore.passageId}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#24273a] border border-slate-200 dark:border-[#363a4f]"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400 dark:text-[#939ab7]">Passage {idx + 1}</span>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-[#cad3f5] line-clamp-1">
                    {passage?.title || pScore.passageId}
                  </h4>
                </div>
                <div className="text-right font-mono font-bold text-sm">
                  <span
                    className={
                      pScore.percentage >= 70
                        ? 'text-emerald-600 dark:text-[#a6da95]'
                        : 'text-amber-600 dark:text-[#f5a97f]'
                    }
                  >
                    {pScore.correctGaps} / {pScore.totalGaps}
                  </span>
                  <div className="text-xs font-normal text-slate-400 dark:text-[#939ab7]">
                    {pScore.percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anki Integration Section */}
      <div className="mt-8 p-6 rounded-2xl bg-purple-50/40 dark:bg-[#24273a] border border-purple-200/60 dark:border-[#c6a0f6]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-purple-600 dark:bg-[#c6a0f6] text-white dark:text-[#181926]">
              Anki SRS Bridge
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-[#cad3f5]">
              Export Mistakes as Cloze Deletions
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#b8c0e0] mt-1 max-w-md">
            {allFailedCards.length > 0
              ? `Found ${allFailedCards.length} sentences with gaps you missed. Export them directly to import into Anki with standard {{c1::...}} cloze format.`
              : 'Flawless performance! You made zero errors across this entire battery.'}
          </p>
        </div>

        {allFailedCards.length > 0 && (
          <button
            onClick={handleExportAnki}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 dark:bg-[#c6a0f6] hover:bg-purple-700 dark:hover:bg-[#b7bdf8] text-white dark:text-[#181926] font-semibold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Anki Deck ({allFailedCards.length} Cards)</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#2e3248] flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-[#363a4f] text-slate-700 dark:text-[#cad3f5] font-semibold text-xs hover:bg-slate-100 dark:hover:bg-[#24273a] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry This Battery</span>
        </button>

        <button
          onClick={onNextBattery}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-[#c6a0f6] text-white dark:text-[#181926] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span>Choose Another Battery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

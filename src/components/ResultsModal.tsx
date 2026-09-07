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
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'C1':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'B2':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'B1':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto my-8 transition-all">
      {/* Top Banner */}
      <div className="text-center pb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-900">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          C-Test Battery Evaluation
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
          Standardized psychometric score calculated based on the complete battery of authentic passages.
        </p>

        {/* Big Score Card */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <div className="text-center px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">Score</span>
            <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              {score.correctGaps} <span className="text-xl text-slate-400 font-normal">/ {score.totalGaps}</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
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
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Passage-by-Passage Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {score.passageScores.map((pScore, idx) => {
            const passage = passages.find((p) => p.id === pScore.passageId);
            return (
              <div
                key={pScore.passageId}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400">Passage {idx + 1}</span>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {passage?.title || pScore.passageId}
                  </h4>
                </div>
                <div className="text-right font-mono font-bold text-sm">
                  <span
                    className={
                      pScore.percentage >= 70
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }
                  >
                    {pScore.correctGaps} / {pScore.totalGaps}
                  </span>
                  <div className="text-xs font-normal text-slate-400">
                    {pScore.percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anki Integration Section */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-600 text-white">
              Anki SRS Bridge
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Export Mistakes as Cloze Deletions
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md">
            {allFailedCards.length > 0
              ? `Found ${allFailedCards.length} sentences with gaps you missed. Export them directly to import into Anki with standard {{c1::...}} cloze format.`
              : 'Flawless performance! You made zero errors across this entire battery.'}
          </p>
        </div>

        {allFailedCards.length > 0 && (
          <button
            onClick={handleExportAnki}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Anki Deck ({allFailedCards.length} Cards)</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry This Battery</span>
        </button>

        <button
          onClick={onNextBattery}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span>Choose Another Battery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

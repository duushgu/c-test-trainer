import React, { useState } from 'react';
import { generateCTest, type CTestPassage } from '../core/cTestEngine';
import { PassageCard } from './PassageCard';
import { evaluatePassage, type PassageScore } from '../core/evaluator';
import { buildSentenceCloze, generateAnkiExportText, downloadAnkiDeck } from '../core/ankiExporter';
import { Sparkles, Play, RotateCcw, Download, Check } from 'lucide-react';

const SAMPLE_TEXTS = [
  {
    title: 'Thermodynamics & Information',
    text: `Landauer's principle establishes a profound connection between information processing and thermodynamic physical laws. Erasing one bit of information in any computational system inevitably dissipates a minimum finite quantity of heat into the surrounding thermal reservoir. This fundamental thermodynamic threshold demonstrates that abstract mathematical computation is intrinsically bounded by physical constraints. As silicon lithography approaches atomic dimensions, managing irreversible thermodynamic heat dissipation constitutes the primary physical barrier to accelerating microelectronic clock frequencies.`,
  },
  {
    title: 'Stochastic Calculus in Markets',
    text: `Financial asset prices exhibit stochastic fluctuations driven by the continuous arrival of novel market information. Quantitative analysts construct continuous-time stochastic differential equations, commonly employing geometric Brownian motion and Ito calculus to model asset paths. Derivative pricing frameworks dynamically eliminate directional market risk through delta-hedging strategies in liquid options markets. While theoretical models assume frictionless trading and normal return distributions, extreme market dislocations reveal fat-tailed volatility clustering across macroeconomic cycles.`,
  },
];

export const CustomGeneratorView: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0].text);
  const [targetGaps, setTargetGaps] = useState(20);
  const [passage, setPassage] = useState<CTestPassage | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<PassageScore | null>(null);

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    const generated = generateCTest(inputText.trim(), {
      title: 'Custom User Passage',
      domain: 'Custom Input',
      targetGaps,
    });
    setPassage(generated);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(null);
  };

  const handleAnswerChange = (gapId: string, val: string) => {
    setUserAnswers((prev) => ({ ...prev, [gapId]: val }));
  };

  const handleSubmit = () => {
    if (!passage) return;
    const evaluated = evaluatePassage(passage, userAnswers);
    setScore(evaluated);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(null);
  };

  const handleExportAnki = () => {
    if (!passage || !score) return;
    const failedGaps = score.evaluations.filter((e) => !e.isCorrect);
    if (failedGaps.length === 0) return;
    const cards = buildSentenceCloze(passage, failedGaps);
    const tsv = generateAnkiExportText(cards);
    downloadAnkiDeck('custom_ctest_anki.txt', tsv);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Box / Generator Control */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Custom C-Test Generator
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Paste any academic excerpt, journal article, or study paragraph. The engine will instantly tokenize, isolate lead-in sentences, and generate mathematically compliant C-Test gaps.
        </p>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-400 font-medium">Load sample:</span>
          {SAMPLE_TEXTS.map((sample) => (
            <button
              key={sample.title}
              onClick={() => {
                setInputText(sample.text);
                setPassage(null);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setPassage(null);
          }}
          placeholder="Paste authentic English text here (minimum 3 sentences recommended)..."
          className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-sans"
        />

        {/* Options & Generate Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Target Gaps:
            </label>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={targetGaps}
              onChange={(e) => setTargetGaps(Number(e.target.value))}
              className="accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              {targetGaps}
            </span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!inputText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Generate C-Test</span>
          </button>
        </div>
      </div>

      {/* Generated C-Test Session */}
      {passage && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Passage generated with {passage.totalGaps} gaps.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Answers</span>
              </button>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Check Answers</span>
                </button>
              ) : (
                score &&
                score.percentage < 100 && (
                  <button
                    onClick={handleExportAnki}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Mistakes to Anki</span>
                  </button>
                )
              )}
            </div>
          </div>

          <PassageCard
            passage={passage}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            isSubmitted={isSubmitted}
            score={score || undefined}
          />
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { generateCTest, type CTestPassage } from '../core/cTestEngine';
import { PassageCard } from './PassageCard';
import { evaluatePassage, type PassageScore } from '../core/evaluator';
import { buildSentenceCloze, generateAnkiExportText, downloadAnkiDeck } from '../core/ankiExporter';
import { Sparkles, Play, RotateCcw, Download, Check } from 'lucide-react';

const SAMPLE_TEXTS = [
  {
    title: 'World History (Silk Road)',
    text: `The transcontinental caravan routes known collectively as the Silk Road linked disparate civilizations across Central Asia for millennia. Desert oasis settlements flourished by exchanging manufactured textiles, refined ceramics, metallurgical tools, and pharmacological wisdom. Beyond material merchandise, these commercial arteries served as vital conduits for religious philosophies, geographical cartography, and multilingual diplomacy. The eventual emergence of direct transoceanic navigation diminished overland profitability, initiating structural shifts in global geopolitical influence.`,
  },
  {
    title: 'Art History (Impressionism)',
    text: `The French Impressionist movement departed from academic studio traditions by capturing the transient optical sensations of natural sunlight directly en plein air. Emerging painters discarded smooth monochromatic glazing techniques in favor of applying unblended pure pigment strokes adjacent to one another across the textured canvas. Chevreul's contemporary discoveries in optical contrast demonstrated that juxtaposed complementary hues blend additively inside the human visual cortex, generating enhanced perceived chromatic brilliance. Their daring visual innovations dismantled rigid artistic conventions and inaugurated the vibrant trajectory of modern avant-garde painting.`,
  },
  {
    title: 'Thermodynamics & Information',
    text: `Landauer's principle establishes a profound connection between information processing and thermodynamic physical laws. Erasing one bit of information in any computational system inevitably dissipates a minimum finite quantity of heat into the surrounding thermal reservoir. This fundamental thermodynamic threshold demonstrates that abstract mathematical computation is intrinsically bounded by physical constraints. As silicon lithography approaches atomic dimensions, managing irreversible thermodynamic heat dissipation constitutes the primary physical barrier to accelerating microelectronic clock frequencies.`,
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
      <div className="bg-white dark:bg-[#1e2030] border border-slate-200 dark:border-[#363a4f] rounded-3xl p-6 sm:p-8 shadow-sm transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-[#c6a0f6]" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#cad3f5]">
            Custom C-Test Generator
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-[#939ab7] mb-6">
          Paste any academic excerpt, literature paragraph, or news article. The engine will tokenize, isolate lead-in sentences, and generate mathematically compliant C-Test gaps.
        </p>

        {/* Quick Samples */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 dark:text-[#939ab7] font-medium shrink-0">Sample presets:</span>
          {SAMPLE_TEXTS.map((sample) => (
            <button
              key={sample.title}
              onClick={() => {
                setInputText(sample.text);
                setPassage(null);
              }}
              className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#24273a] text-slate-700 dark:text-[#b8c0e0] hover:bg-slate-200 dark:hover:bg-[#363a4f] transition-colors border border-slate-200 dark:border-[#363a4f] shrink-0 cursor-pointer"
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
          className="w-full p-4 rounded-2xl border border-slate-300 dark:border-[#363a4f] bg-slate-50/50 dark:bg-[#181926] text-slate-900 dark:text-[#cad3f5] text-sm focus:outline-none focus:ring-2 focus:ring-[#b7bdf8]/40 transition-all font-sans"
        />

        {/* Options & Generate Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-[#cad3f5]">
              Target Gaps:
            </label>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={targetGaps}
              onChange={(e) => setTargetGaps(Number(e.target.value))}
              className="accent-[#c6a0f6] cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-[#cad3f5] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#24273a] border border-slate-200 dark:border-[#363a4f]">
              {targetGaps}
            </span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!inputText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 dark:bg-[#c6a0f6] hover:bg-purple-700 dark:hover:bg-[#b7bdf8] disabled:opacity-50 text-white dark:text-[#181926] font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Generate C-Test</span>
          </button>
        </div>
      </div>

      {/* Generated C-Test Session */}
      {passage && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#939ab7]">
              <span>Passage generated with {passage.totalGaps} gaps.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#363a4f] text-xs font-semibold text-slate-600 dark:text-[#b8c0e0] hover:bg-slate-100 dark:hover:bg-[#24273a] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Answers</span>
              </button>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 dark:bg-[#8bd5ca] hover:bg-emerald-700 dark:hover:bg-[#8bd5ca]/80 text-white dark:text-[#181926] text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Check Answers</span>
                </button>
              ) : (
                score &&
                score.percentage < 100 && (
                  <button
                    onClick={handleExportAnki}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600 dark:bg-[#c6a0f6] hover:bg-purple-700 dark:hover:bg-[#b7bdf8] text-white dark:text-[#181926] text-xs font-bold shadow-xs cursor-pointer"
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

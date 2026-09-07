import React, { useState, useEffect, useMemo } from 'react';
import { PRESET_BATTERIES, RAW_PASSAGES } from '../data/passages';
import { generateCTest, type CTestPassage } from '../core/cTestEngine';
import { evaluateBattery, type BatteryScore } from '../core/evaluator';
import { PassageCard } from './PassageCard';
import { ResultsModal } from './ResultsModal';
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';

export const TestBatteryView: React.FC = () => {
  // Battery Selection
  const [selectedBatteryId, setSelectedBatteryId] = useState<string>('battery-1');
  const [activePassageIndex, setActivePassageIndex] = useState<number>(0);

  // User Answers state: { [passageId]: { [gapId]: answer } }
  const [allAnswers, setAllAnswers] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('ctest_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Submission & Evaluation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [batteryScore, setBatteryScore] = useState<BatteryScore | null>(null);

  // Timer State (25 minutes = 1500 seconds for a full 5-passage battery)
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);

  // Convert raw passage data into full C-Test objects
  const batteryPassages: CTestPassage[] = useMemo(() => {
    const rawList = RAW_PASSAGES.filter((p) => p.batteryId === selectedBatteryId);
    return rawList.map((raw) =>
      generateCTest(raw.rawText, {
        id: raw.id,
        title: raw.title,
        domain: raw.domain,
        difficulty: raw.difficulty,
        targetGaps: 20,
      })
    );
  }, [selectedBatteryId]);

  // Persist answers in local storage
  useEffect(() => {
    try {
      localStorage.setItem('ctest_answers', JSON.stringify(allAnswers));
    } catch {
      // Ignore storage quota
    }
  }, [allAnswers]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerActive && timeLeft > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto submit on time out
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft, isSubmitted]);

  const currentPassage = batteryPassages[activePassageIndex];
  const currentAnswers = currentPassage ? allAnswers[currentPassage.id] || {} : {};

  const handleAnswerChange = (gapId: string, val: string) => {
    if (!currentPassage || isSubmitted) return;
    setAllAnswers((prev) => ({
      ...prev,
      [currentPassage.id]: {
        ...(prev[currentPassage.id] || {}),
        [gapId]: val,
      },
    }));
  };

  const handleSubmit = () => {
    const score = evaluateBattery(batteryPassages, allAnswers);
    setBatteryScore(score);
    setIsSubmitted(true);
    setIsTimerActive(false);
  };

  const handleRetry = () => {
    // Clear answers for this battery
    const updated = { ...allAnswers };
    batteryPassages.forEach((p) => {
      delete updated[p.id];
    });
    setAllAnswers(updated);
    setIsSubmitted(false);
    setBatteryScore(null);
    setTimeLeft(25 * 60);
    setActivePassageIndex(0);
  };

  const handleSelectBattery = (batteryId: string) => {
    setSelectedBatteryId(batteryId);
    setActivePassageIndex(0);
    setIsSubmitted(false);
    setBatteryScore(null);
    setTimeLeft(25 * 60);
    setIsTimerActive(false);
  };

  // Compute completed gaps counter
  const totalGapsCount = batteryPassages.reduce((acc, p) => acc + p.totalGaps, 0);
  const filledGapsCount = batteryPassages.reduce((acc, p) => {
    const pAns = allAnswers[p.id] || {};
    return acc + Object.values(pAns).filter((v) => v.trim().length > 0).length;
  }, 0);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Battery Selector Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRESET_BATTERIES.map((battery) => {
          const isSelected = battery.id === selectedBatteryId;
          return (
            <button
              key={battery.id}
              onClick={() => handleSelectBattery(battery.id)}
              className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {battery.difficulty}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {battery.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {battery.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Progress, Timer, Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Passage Tabs (1 to 5) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {batteryPassages.map((p, idx) => {
            const pAns = allAnswers[p.id] || {};
            const filledInThis = Object.values(pAns).filter((v) => v.trim().length > 0).length;
            const isCurrent = idx === activePassageIndex;
            const pScore = batteryScore?.passageScores.find((s) => s.passageId === p.id);

            return (
              <button
                key={p.id}
                onClick={() => setActivePassageIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>Text {idx + 1}</span>
                {isSubmitted && pScore ? (
                  <span className="text-[10px] opacity-90 font-mono">
                    {pScore.correctGaps}/{pScore.totalGaps}
                  </span>
                ) : (
                  <span className="text-[10px] opacity-70 font-mono">
                    {filledInThis}/{p.totalGaps}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: Timer & Actions */}
        <div className="flex items-center gap-3">
          {/* Exam Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className={timeLeft < 300 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-800 dark:text-slate-200'}>
              {formatTime(timeLeft)}
            </span>
            {!isSubmitted && (
              <button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="ml-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isTimerActive ? 'Pause' : 'Start'}
              </button>
            )}
          </div>

          {/* Submit Button */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Battery ({filledGapsCount}/{totalGapsCount})</span>
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Reset Answers
            </button>
          )}
        </div>
      </div>

      {/* Active Passage Card */}
      {currentPassage && (
        <PassageCard
          passage={currentPassage}
          userAnswers={currentAnswers}
          onAnswerChange={handleAnswerChange}
          isSubmitted={isSubmitted}
          score={batteryScore?.passageScores.find((s) => s.passageId === currentPassage.id)}
        />
      )}

      {/* Prev / Next Passage Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActivePassageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={activePassageIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Text</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">
          Text {activePassageIndex + 1} of {batteryPassages.length}
        </span>

        <button
          onClick={() =>
            setActivePassageIndex((prev) => Math.min(prev + 1, batteryPassages.length - 1))
          }
          disabled={activePassageIndex === batteryPassages.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span>Next Text</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Score Modal if submitted */}
      {isSubmitted && batteryScore && (
        <ResultsModal
          score={batteryScore}
          passages={batteryPassages}
          onRetry={handleRetry}
          onNextBattery={() => {
            const nextIdx =
              (PRESET_BATTERIES.findIndex((b) => b.id === selectedBatteryId) + 1) %
              PRESET_BATTERIES.length;
            handleSelectBattery(PRESET_BATTERIES[nextIdx].id);
          }}
        />
      )}
    </div>
  );
};

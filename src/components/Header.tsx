import React from 'react';
import { BookOpen, Sparkles, Moon, Sun, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: 'battery' | 'generator';
  onSelectTab: (tab: 'battery' | 'generator') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  batteryStats?: { completed: number; total: number };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  batteryStats,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <span className="font-mono font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 leading-none">
              C-Test Trainer
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
                C1 / C2 Academic
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Standardized Klein-Braley & Raatz C-Principle
            </p>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => onSelectTab('battery')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'battery'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Batteries</span>
          </button>
          <button
            onClick={() => onSelectTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Generator</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {batteryStats && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800">
              <Award className="w-3.5 h-3.5" />
              <span>{batteryStats.completed}/{batteryStats.total} Solved</span>
            </div>
          )}

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

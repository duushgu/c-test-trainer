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
    <header className="border-b border-slate-200 dark:border-[#2e3248] bg-white/90 dark:bg-[#181926]/90 backdrop-blur sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand with Fusion & Macchiato Aesthetic */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c6a0f6] via-[#b7bdf8] to-[#8bd5ca] p-[1px] shadow-sm shadow-[#c6a0f6]/20">
            <div className="w-full h-full rounded-[11px] bg-[#181926] flex items-center justify-center text-white">
              <span className="font-mono font-bold text-base bg-gradient-to-tr from-[#c6a0f6] to-[#8bd5ca] bg-clip-text text-transparent">
                C
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#cad3f5] flex items-center gap-2 leading-none">
              C-Test Trainer
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-[#24273a] dark:text-[#c6a0f6] border border-purple-200 dark:border-[#c6a0f6]/30 font-semibold">
                C1 / C2 Multi-Domain
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#939ab7] mt-0.5">
              Standardized Psycholinguistic Testing &bull; 7 Thematic Batteries
            </p>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center p-1 bg-slate-100 dark:bg-[#1e2030] rounded-xl border border-slate-200/60 dark:border-[#363a4f]/60">
          <button
            onClick={() => onSelectTab('battery')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'battery'
                ? 'bg-white dark:bg-[#24273a] text-purple-700 dark:text-[#b7bdf8] shadow-xs border border-slate-200 dark:border-[#494d64]'
                : 'text-slate-600 dark:text-[#939ab7] hover:text-slate-900 dark:hover:text-[#cad3f5]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Batteries</span>
          </button>
          <button
            onClick={() => onSelectTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-[#24273a] text-purple-700 dark:text-[#b7bdf8] shadow-xs border border-slate-200 dark:border-[#494d64]'
                : 'text-slate-600 dark:text-[#939ab7] hover:text-slate-900 dark:hover:text-[#cad3f5]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Generator</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {batteryStats && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-[#24273a] dark:text-[#a6da95] text-xs font-medium border border-emerald-200 dark:border-[#a6da95]/30">
              <Award className="w-3.5 h-3.5" />
              <span>{batteryStats.completed}/{batteryStats.total} Solved</span>
            </div>
          )}

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-[#939ab7] hover:bg-slate-100 dark:hover:bg-[#1e2030] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#363a4f] cursor-pointer"
            title="Toggle Eye-Comfort Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#eed49f]" /> : <Moon className="w-4 h-4 text-[#7287fd]" />}
          </button>
        </div>
      </div>
    </header>
  );
};

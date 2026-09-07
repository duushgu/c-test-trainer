import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TestBatteryView } from './components/TestBatteryView';
import { CustomGeneratorView } from './components/CustomGeneratorView';

export function App() {
  const [activeTab, setActiveTab] = useState<'battery' | 'generator'>('battery');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ctest_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ctest_theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'battery' ? <TestBatteryView /> : <CustomGeneratorView />}
      </main>

      {/* Educational & Academic Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-8 px-4 sm:px-6 transition-colors mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              English C-Test Trainer
            </span>
            <span>•</span>
            <span>Based on Klein-Braley & Raatz Psycholinguistic Measurement</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/duushgu/c-test-trainer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

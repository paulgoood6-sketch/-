import React, { useState } from 'react';
import { FerrisWheel } from './components/FerrisWheel';
import { FunctionPlotter } from './components/FunctionPlotter';
import { Tab } from './types';
import { Calculator, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.FERRIS_WHEEL);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                TrigExplorer <span className="text-slate-400 font-normal hidden sm:inline">| 数学可视化实验室</span>
              </h1>
            </div>
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab(Tab.FERRIS_WHEEL)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === Tab.FERRIS_WHEEL
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-4 h-4" />
                摩天轮演示
              </button>
              <button
                onClick={() => setActiveTab(Tab.FUNCTION_PLOTTER)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === Tab.FUNCTION_PLOTTER
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-4 h-4" />
                图像变换
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
          {activeTab === Tab.FERRIS_WHEEL ? <FerrisWheel /> : <FunctionPlotter />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 TrigExplorer. 用于辅助高中三角函数教学。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
import React from 'react';
import { Award, PlusCircle, Settings } from 'lucide-react';

export type ActiveTab = 'input' | 'daftar' | 'master' | 'panduan';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewProposal: () => void;
  namaDaerah?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewProposal,
  namaDaerah = 'Nasional',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-14 sm:h-15">
          {/* Zone 1: Nationwide Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-teal-700 via-emerald-800 to-teal-900 text-amber-300 flex items-center justify-center font-bold shadow-md ring-2 ring-teal-500/20">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 drop-shadow-xs" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-teal-900 to-emerald-800 bg-clip-text text-transparent">
                  SI-SLKS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 truncate max-w-[150px]">
                  {namaDaerah}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block">
                Satyalancana Karya Satya Republik Indonesia
              </span>
            </div>
          </div>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'input'
                  ? 'bg-white text-teal-900 shadow-xs ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Input Usulan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('daftar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'daftar'
                  ? 'bg-white text-teal-900 shadow-xs ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Daftar & Statistik
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('master')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'master'
                  ? 'bg-white text-teal-900 shadow-xs ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-teal-700" />
              <span>Master Data</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('panduan')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'panduan'
                  ? 'bg-white text-teal-900 shadow-xs ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span>Panduan</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onNewProposal();
                setActiveTab('input');
              }}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Usul Baru</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-start py-2.5 border-t border-teal-50 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('input')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'input'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Input
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('daftar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'daftar'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Daftar & Statistik
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('master')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'master'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Master Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('panduan')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'panduan'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Panduan
          </button>
        </div>
      </div>
    </header>
  );
};

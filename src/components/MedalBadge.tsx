import React from 'react';
import { TingkatSLKS } from '../types/slks';
import { Award } from 'lucide-react';

interface MedalBadgeProps {
  tingkat: TingkatSLKS;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MedalBadge: React.FC<MedalBadgeProps> = ({ tingkat, size = 'md', showLabel = true }) => {
  const config = {
    X: {
      label: '10 Tahun',
      sub: 'Perunggu',
      romawi: 'X',
      bgGradient: 'from-amber-700/10 to-amber-900/10',
      border: 'border-amber-700/30',
      text: 'text-amber-800',
      ribbonBg: 'bg-amber-700',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    },
    XX: {
      label: '20 Tahun',
      sub: 'Perak',
      romawi: 'XX',
      bgGradient: 'from-slate-300/20 to-slate-500/20',
      border: 'border-slate-400/40',
      text: 'text-slate-700',
      ribbonBg: 'bg-slate-500',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    XXX: {
      label: '30 Tahun',
      sub: 'Emas',
      romawi: 'XXX',
      bgGradient: 'from-amber-400/20 to-yellow-500/20',
      border: 'border-amber-400/50',
      text: 'text-amber-600',
      ribbonBg: 'bg-amber-500',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
    },
  }[tingkat];

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold border ${config.badgeClass} tabular-nums whitespace-nowrap`}>
        <Award className="w-3.5 h-3.5 shrink-0" />
        <span>SLKS {config.romawi} ({config.label})</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-xl border ${config.border} bg-white shadow-xs flex items-center gap-4`}>
        <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold text-white shadow-inner ${config.ribbonBg}`}>
          <Award className="w-6 h-6" />
          <span className="text-[10px] uppercase font-mono tracking-wider">{config.romawi}</span>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Satyalancana Karya Satya</div>
          <div className="text-base font-bold text-slate-900">{config.label} ({config.sub})</div>
          <div className="text-xs text-slate-600">Pengabdian ASN tanpa putus</div>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border ${config.badgeClass} tabular-nums whitespace-nowrap`}>
      <span className={`w-2 h-2 rounded-full ${config.ribbonBg}`} />
      <span className="font-semibold">SLKS {config.romawi}</span>
      {showLabel && <span className="text-slate-600">· {config.label} ({config.sub})</span>}
    </span>
  );
};

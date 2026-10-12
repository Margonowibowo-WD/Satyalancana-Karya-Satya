import React from 'react';
import { UsulanSLKS } from '../types/slks';
import { Award, CheckCircle2, AlertTriangle, Users, Building2 } from 'lucide-react';
import { MedalBadge } from './MedalBadge';

interface DashboardStatistikProps {
  usulanList: UsulanSLKS[];
  onNavigateToForm: () => void;
  onNavigateToList: () => void;
}

export const DashboardStatistik: React.FC<DashboardStatistikProps> = ({
  usulanList,
  onNavigateToForm,
  onNavigateToList,
}) => {
  const total = usulanList.length;
  const countMS = usulanList.filter((u) => u.statusKelayakan === 'MS').length;
  const countTMS = usulanList.filter((u) => u.statusKelayakan === 'TMS').length;

  const count10 = usulanList.filter((u) => u.slksUsul === 'X').length;
  const count20 = usulanList.filter((u) => u.slksUsul === 'XX').length;
  const count30 = usulanList.filter((u) => u.slksUsul === 'XXX').length;

  const countGol4 = usulanList.filter((u) => u.pegawai.kdPangkat.startsWith('IV')).length;
  const countGol3 = usulanList.filter((u) => u.pegawai.kdPangkat.startsWith('III')).length;
  const countGol2 = usulanList.filter((u) => u.pegawai.kdPangkat.startsWith('II')).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>BKPSDM KABUPATEN MUKOMUKO · ANALITIK PENGUSULAN</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              STATISTIK PENGUSULAN SATYALANCANA KARYA SATYA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ringkasan kelayakan administrasi, sebaran jenjang tanda kehormatan, dan kepatuhan PP No. 35 Tahun 2010.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onNavigateToForm}
              className="px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              + Usul Pegawai Baru
            </button>
            <button
              type="button"
              onClick={onNavigateToList}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Lihat Daftar Usulan
            </button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Usulan</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {total}
            </div>
            <p className="text-[11px] text-slate-500">PNS terdaftar dalam sistem</p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 uppercase">Memenuhi Syarat (MS)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 font-mono tabular-nums">
              {countMS}
            </div>
            <p className="text-[11px] text-emerald-700">
              {total ? Math.round((countMS / total) * 100) : 0}% kelayakan administrasi
            </p>
          </div>

          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 uppercase">Tidak Memenuhi (TMS)</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-900 font-mono tabular-nums">
              {countTMS}
            </div>
            <p className="text-[11px] text-rose-700">Terkendala masa kerja/hukdis</p>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 uppercase">SLKS Emas (30 Th)</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-950 font-mono tabular-nums">
              {count30}
            </div>
            <p className="text-[11px] text-amber-800">Jenjang pengabdian puncak</p>
          </div>
        </div>
      </div>

      {/* Grid: Distribusi Kategori Medali & Golongan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribusi Medali */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              DISTRIBUSI JENJANG TANDA KEHORMATAN
            </h2>
            <span className="text-xs text-slate-500">Masa Pengabdian</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* 10 Tahun */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-700" />
                  SLKS 10 Tahun (Perunggu)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {count10} Usulan ({total ? Math.round((count10 / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-700 h-2.5 rounded-full"
                  style={{ width: `${total ? (count10 / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 20 Tahun */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  SLKS 20 Tahun (Perak)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {count20} Usulan ({total ? Math.round((count20 / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-slate-500 h-2.5 rounded-full"
                  style={{ width: `${total ? (count20 / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 30 Tahun */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  SLKS 30 Tahun (Emas)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {count30} Usulan ({total ? Math.round((count30 / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-2.5 rounded-full"
                  style={{ width: `${total ? (count30 / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Distribusi Golongan Ruang */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              DISTRIBUSI GOLONGAN RUANG PEGAWAI
            </h2>
            <span className="text-xs text-slate-500">Pangkat ASN</span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Golongan IV */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
                  Golongan IV (Pembina)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {countGol4} Pegawai
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-800 h-2.5 rounded-full"
                  style={{ width: `${total ? (countGol4 / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Golongan III */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Golongan III (Penata)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {countGol3} Pegawai
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full"
                  style={{ width: `${total ? (countGol3 / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Golongan II */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Golongan II (Pengatur)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {countGol2} Pegawai
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-2.5 rounded-full"
                  style={{ width: `${total ? (countGol2 / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regulasi & Dasar Hukum Reference */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs text-slate-700 space-y-2">
        <h3 className="font-bold uppercase tracking-wider text-slate-900 text-sm">
          Dasar Regulasi & Ketentuan Pemberian Tanda Kehormatan:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
          <li>
            <strong>UU No. 20 Tahun 2009:</strong> Tentang Gelar, Tanda Jasa, dan Tanda Kehormatan Republik Indonesia.
          </li>
          <li>
            <strong>PP No. 35 Tahun 2010:</strong> Tentang Pelaksanaan UU No. 20 Tahun 2009, khususnya Pasal 22 mengenai syarat kesetiaan, pengabdian, kejujuran, dan disiplin tanpa cela.
          </li>
          <li>
            <strong>Syarat Khusus:</strong> PNS yang diusulkan wajib telah mengabdi sekurang-kurangnya 10, 20, atau 30 tahun secara terus-menerus dan tidak pernah dijatuhi hukuman disiplin tingkat sedang atau berat.
          </li>
        </ul>
      </div>
    </div>
  );
};

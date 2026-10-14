import React, { useState, useMemo } from 'react';
import { UsulanSLKS, TingkatSLKS, StatusKelayakan, PengaturanInstansi } from '../types/slks';
import { MedalBadge } from './MedalBadge';
import { getPangkatName } from '../data/pangkatData';
import { formatNIP } from '../utils/nipParser';
import { exportToCSV10Kolom, prepareBKNRows } from '../utils/exportBKN';
import { sortUsulanList } from '../utils/storage';
import {
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  FileSpreadsheet,
  Award,
  Users,
  ShieldCheck,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface TabelDaftarUsulanProps {
  usulanList: UsulanSLKS[];
  onEditUsulan: (usulan: UsulanSLKS) => void;
  onDeleteUsulan: (id: string) => void;
  onCetakUsulan: (usulan: UsulanSLKS) => void;
  onUpdateStatusWorkflow?: (
    id: string,
    status: UsulanSLKS['statusUsulan'],
    noKeppres?: string,
    tglKeppres?: string
  ) => void;
  pengaturan?: PengaturanInstansi;
  onExportBackup?: () => void;
  onNavigateToInput?: () => void;
}

export const TabelDaftarUsulan: React.FC<TabelDaftarUsulanProps> = ({
  usulanList,
  onEditUsulan,
  onDeleteUsulan,
  onCetakUsulan,
  onUpdateStatusWorkflow,
  pengaturan,
  onExportBackup,
  onNavigateToInput,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelayakan, setFilterKelayakan] = useState<StatusKelayakan | 'ALL'>('ALL');
  const [filterTingkat, setFilterTingkat] = useState<TingkatSLKS | 'ALL'>('ALL');
  const [detailModalUsulan, setDetailModalUsulan] = useState<UsulanSLKS | null>(null);

  // Modal Update Status Keppres
  const [keppresModalUsulan, setKeppresModalUsulan] = useState<UsulanSLKS | null>(null);
  const [inputNoKeppres, setInputNoKeppres] = useState('');
  const [inputTglKeppres, setInputTglKeppres] = useState('');

  // Perhitungan Statistik Real-time
  const total = usulanList.length;
  const countMS = usulanList.filter((u) => u.statusKelayakan === 'MS').length;
  const countTMS = usulanList.filter((u) => u.statusKelayakan === 'TMS').length;
  const count10 = usulanList.filter((u) => u.slksUsul === 'X').length;
  const count20 = usulanList.filter((u) => u.slksUsul === 'XX').length;
  const count30 = usulanList.filter((u) => u.slksUsul === 'XXX').length;
  const msPercentage = total > 0 ? Math.round((countMS / total) * 100) : 0;

  // Filtering Logic dengan pengurutan otomatis: 1. SLKS 30>10, 2. Pangkat tertinggi>terendah, 3. Umur tertua>termuda
  const filteredList = useMemo(() => {
    const list = usulanList.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        item.pegawai.nama.toLowerCase().includes(q) ||
        item.pegawai.nip.includes(q) ||
        (item.pegawai.unitKerja && item.pegawai.unitKerja.toLowerCase().includes(q)) ||
        (item.pegawai.jabatan && item.pegawai.jabatan.toLowerCase().includes(q));

      const matchKelayakan =
        filterKelayakan === 'ALL' || item.statusKelayakan === filterKelayakan;

      const matchTingkat = filterTingkat === 'ALL' || item.slksUsul === filterTingkat;

      return matchSearch && matchKelayakan && matchTingkat;
    });

    return sortUsulanList(list);
  }, [usulanList, searchTerm, filterKelayakan, filterTingkat]);

  // Ekspor 10 Kolom Format Resmi BKN dengan perlindungan format Teks (NIP tidak berubah ke notasi ilmiah)
  const handleExportCSV10Kolom = () => {
    const rows = prepareBKNRows(filteredList, pengaturan);
    exportToCSV10Kolom(
      rows,
      `Nominatif_SLKS_10_Kolom_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const handleSimpanKeppres = () => {
    if (!keppresModalUsulan || !onUpdateStatusWorkflow) return;
    onUpdateStatusWorkflow(
      keppresModalUsulan.id,
      'Keppres Terbit',
      inputNoKeppres,
      inputTglKeppres
    );
    setKeppresModalUsulan(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ============================================================== */}
      {/* 1. BAGIAN STATISTIK & HEADER EKSEKUTIF (GABUNGAN & DESAIN SEGAR) */}
      {/* ============================================================== */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                {pengaturan?.namaInstansi || 'Sistem Nasional RI'}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-500 font-medium">
                Rekapitulasi & Statistik Terpadu
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              DAFTAR USULAN & STATISTIK SATYALANCANA
            </h1>
          </div>

          {/* Action Buttons Toolbar: Ekspor CSV 10 Kolom & Cadangkan Data */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV10Kolom}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
              title="Unduh file CSV 10 kolom BKN dengan pengunci teks NIP (formula =NIP)"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV (10 Kolom)</span>
            </button>

            {onExportBackup && (
              <button
                type="button"
                onClick={onExportBackup}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Cadangkan seluruh basis data ke file JSON agar tidak hilang"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Cadangkan Data (JSON)</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* KARTU STATISTIK METRIK BERSIH, MODERN & INTERAKTIF              */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {/* Metrik 1: Total Usulan */}
          <div
            onClick={() => {
              setFilterKelayakan('ALL');
              setFilterTingkat('ALL');
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterKelayakan === 'ALL' && filterTingkat === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-800/20'
                : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                filterKelayakan === 'ALL' && filterTingkat === 'ALL' ? 'text-slate-300' : 'text-slate-500'
              }`}>
                Total Usulan
              </span>
              <Users className={`w-4 h-4 ${
                filterKelayakan === 'ALL' && filterTingkat === 'ALL' ? 'text-teal-400' : 'text-slate-400'
              }`} />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums mt-1.5">
              {total} <span className="text-xs font-normal opacity-80">PNS</span>
            </div>
            <p className={`text-[11px] mt-1 ${
              filterKelayakan === 'ALL' && filterTingkat === 'ALL' ? 'text-slate-300' : 'text-slate-500'
            }`}>
              Klik untuk tampilkan semua
            </p>
          </div>

          {/* Metrik 2: Memenuhi Syarat (MS) */}
          <div
            onClick={() => setFilterKelayakan('MS')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterKelayakan === 'MS'
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                filterKelayakan === 'MS' ? 'text-emerald-200' : 'text-emerald-800'
              }`}>
                Memenuhi Syarat (MS)
              </span>
              <CheckCircle2 className={`w-4 h-4 ${
                filterKelayakan === 'MS' ? 'text-emerald-300' : 'text-emerald-600'
              }`} />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums mt-1.5">
              {countMS} <span className="text-xs font-normal opacity-85">({msPercentage}%)</span>
            </div>
            {/* Progress bar visual */}
            <div className="w-full bg-emerald-200/50 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${filterKelayakan === 'MS' ? 'bg-emerald-300' : 'bg-emerald-600'}`}
                style={{ width: `${msPercentage}%` }}
              />
            </div>
          </div>

          {/* Metrik 3: Tidak Memenuhi Syarat (TMS) */}
          <div
            onClick={() => setFilterKelayakan('TMS')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              filterKelayakan === 'TMS'
                ? 'bg-rose-900 text-white border-rose-900 shadow-md ring-2 ring-rose-500/20'
                : 'bg-rose-50/80 hover:bg-rose-100/80 text-rose-950 border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                filterKelayakan === 'TMS' ? 'text-rose-200' : 'text-rose-800'
              }`}>
                Tidak Memenuhi (TMS)
              </span>
              <AlertCircle className={`w-4 h-4 ${
                filterKelayakan === 'TMS' ? 'text-rose-300' : 'text-rose-600'
              }`} />
            </div>
            <div className="text-2xl font-black font-mono tabular-nums mt-1.5">
              {countTMS} <span className="text-xs font-normal opacity-80">PNS</span>
            </div>
            <p className={`text-[11px] mt-1 ${
              filterKelayakan === 'TMS' ? 'text-rose-200' : 'text-rose-700'
            }`}>
              {countTMS > 0 ? 'Klik untuk tinjau alasan TMS' : 'Nihil (Semua Memenuhi)'}
            </p>
          </div>

          {/* Metrik 4: Distribusi Jenjang Tanda Kehormatan (10, 20, 30 Thn) */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Jenjang Tanda Kehormatan
              </span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setFilterTingkat(filterTingkat === 'X' ? 'ALL' : 'X')}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  filterTingkat === 'X'
                    ? 'bg-amber-700 text-white font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-white text-amber-950 border border-amber-200'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-75">10 Th (X)</div>
                <div className="text-base font-extrabold font-mono">{count10}</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterTingkat(filterTingkat === 'XX' ? 'ALL' : 'XX')}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  filterTingkat === 'XX'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-300'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-75">20 Th (XX)</div>
                <div className="text-base font-extrabold font-mono">{count20}</div>
              </button>

              <button
                type="button"
                onClick={() => setFilterTingkat(filterTingkat === 'XXX' ? 'ALL' : 'XXX')}
                className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  filterTingkat === 'XXX'
                    ? 'bg-yellow-600 text-white font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-white text-yellow-950 border border-yellow-300'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-75">30 Th (XXX)</div>
                <div className="text-base font-extrabold font-mono">{count30}</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Offline Reassurance Banner (Menghilangkan Kecemasan Data Hilang) */}
        <div className="flex items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-teal-50/70 via-emerald-50/50 to-slate-50 border border-teal-200/80 rounded-xl text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-teal-950">
                Penyimpanan Data Permanen di Perangkat Ini
              </span>
              <span className="hidden sm:inline text-slate-500 ml-1.5">
                · Data tersimpan otomatis di browser laptop Anda, tidak akan hilang saat browser ditutup, offline, atau laptop dimatikan.
              </span>
            </div>
          </div>
          {onExportBackup && (
            <button
              type="button"
              onClick={onExportBackup}
              className="text-xs font-bold text-teal-800 hover:text-teal-950 underline shrink-0 cursor-pointer"
            >
              Simpan Cadangan File (.json)
            </button>
          )}
        </div>

        {/* ============================================================== */}
        {/* PENCARIAN & KONTROL FILTER TABEL                               */}
        {/* ============================================================== */}
        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Nama Pegawai, NIP, Jabatan, atau Unit Kerja..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/90 border border-slate-200 focus:bg-white focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter Pills & Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Kelayakan Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFilterKelayakan('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterKelayakan === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({total})
              </button>
              <button
                type="button"
                onClick={() => setFilterKelayakan('MS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterKelayakan === 'MS'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                MS ({countMS})
              </button>
              <button
                type="button"
                onClick={() => setFilterKelayakan('TMS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filterKelayakan === 'TMS'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-rose-800 hover:bg-rose-50'
                }`}
              >
                TMS ({countTMS})
              </button>
            </div>

            {/* Filter Tingkat Select */}
            <select
              value={filterTingkat}
              onChange={(e) => setFilterTingkat(e.target.value as any)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 outline-none font-semibold cursor-pointer shadow-2xs"
            >
              <option value="ALL">Semua Kategori (10, 20, 30 Th)</option>
              <option value="X">SLKS X (10 Tahun)</option>
              <option value="XX">SLKS XX (20 Tahun)</option>
              <option value="XXX">SLKS XXX (30 Tahun)</option>
            </select>

            {(searchTerm || filterKelayakan !== 'ALL' || filterTingkat !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterKelayakan('ALL');
                  setFilterTingkat('ALL');
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Bersihkan semua filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TABEL DAFTAR USULAN PEGAWAI                                 */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-slate-50/90 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-3.5 py-3 text-center w-12">
                  No
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Pegawai (Nama & NIP)
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Pangkat
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Jabatan & Unit Kerja
                </th>
                <th scope="col" className="px-3.5 py-3 text-center">
                  Masa Kerja
                </th>
                <th scope="col" className="px-3.5 py-3 text-center">
                  SLKS Usulan
                </th>
                <th scope="col" className="px-3.5 py-3 text-center">
                  Kelayakan
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Tidak ada data usulan yang cocok</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coba ubah kata kunci pencarian atau sesuaikan filter status kelayakan.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-teal-50/30 transition-colors">
                    {/* No */}
                    <td className="px-3.5 py-3 text-center text-slate-500 font-mono text-xs tabular-nums">
                      {idx + 1}
                    </td>

                    {/* Pegawai */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{item.pegawai.nama}</div>
                      <div className="text-xs text-slate-500 font-mono tracking-wider mt-0.5">
                        {formatNIP(item.pegawai.nip)}
                      </div>
                    </td>

                    {/* Pangkat (Hanya Pangkat Tanpa Dobel Golongan) */}
                    <td className="px-4 py-3 text-xs">
                      <div className="font-bold text-teal-900">
                        {getPangkatName(item.pegawai.kdPangkat, item.pegawai.namaPangkat)}
                      </div>
                    </td>

                    {/* Jabatan & Unit Kerja */}
                    <td className="px-4 py-3 text-xs">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-xs" title={item.pegawai.jabatan}>
                        {item.pegawai.jabatan}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.pegawai.unitKerja || 'Instansi Induk'}
                      </div>
                    </td>

                    {/* Masa Kerja */}
                    <td className="px-3.5 py-3 text-center">
                      <span className="font-mono font-bold text-slate-900 text-xs tabular-nums">
                        {item.mkPnsTahun} Th {item.mkPnsBulan} Bl
                      </span>
                      {item.pegawai.noSkHukdis && (
                        <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                          Ada SK Hukdis
                        </div>
                      )}
                    </td>

                    {/* Usulan SLKS */}
                    <td className="px-3.5 py-3 text-center">
                      <MedalBadge tingkat={item.slksUsul} size="sm" />
                    </td>

                    {/* Kelayakan MS / TMS */}
                    <td className="px-3.5 py-3 text-center">
                      {item.statusKelayakan === 'MS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          MS
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 cursor-help"
                          title={item.keteranganTms}
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          TMS
                        </span>
                      )}
                    </td>

                    {/* Aksi (Hanya Hapus dan Edit Saja Sesuai Permintaan) */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <button
                          type="button"
                          onClick={() => onEditUsulan(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                          title="Edit / Koreksi Usulan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus usulan untuk ${item.pegawai.nama}?`)) {
                              onDeleteUsulan(item.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          title="Hapus Usulan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MODAL DETAIL USULAN PEGAWAI                                 */}
      {/* ============================================================== */}
      {detailModalUsulan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  Rincian Profil Usulan Tanda Kehormatan
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {detailModalUsulan.pegawai.nama}
                </h2>
                <p className="text-xs font-mono text-slate-500">
                  NIP: {detailModalUsulan.pegawai.nip}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalUsulan(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Pangkat:</span>
                <p className="font-bold text-teal-900">
                  {getPangkatName(detailModalUsulan.pegawai.kdPangkat, detailModalUsulan.pegawai.namaPangkat)}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Golongan Ruang: {detailModalUsulan.pegawai.kdPangkat}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Jabatan & Unit Kerja:</span>
                <p className="font-bold text-slate-900">
                  {detailModalUsulan.pegawai.jabatan}
                </p>
                <p className="text-slate-600">{detailModalUsulan.pegawai.unitKerja}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Masa Kerja Riil:</span>
                <p className="font-bold text-slate-900 font-mono">
                  {detailModalUsulan.mkPnsTahun} Tahun {detailModalUsulan.mkPnsBulan} Bulan
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Tanda Kehormatan Diusul:</span>
                <div className="pt-1">
                  <MedalBadge tingkat={detailModalUsulan.slksUsul} size="md" />
                </div>
              </div>
            </div>

            {/* Evaluasi Kelayakan */}
            <div className={`p-4 rounded-xl border text-xs space-y-1 ${
              detailModalUsulan.statusKelayakan === 'MS'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <span className="font-bold block flex items-center gap-1.5">
                {detailModalUsulan.statusKelayakan === 'MS' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Status: MEMENUHI SYARAT (MS)
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Status: TIDAK MEMENUHI SYARAT (TMS)
                  </>
                )}
              </span>
              <p className="leading-relaxed">
                {detailModalUsulan.statusKelayakan === 'MS'
                  ? 'Masa kerja mencukupi sesuai PP No. 35/2010 dan tidak ada catatan hukuman disiplin sedang/berat.'
                  : `Catatan Kendala: ${detailModalUsulan.keteranganTms || 'Masa kerja belum mencapai target atau ada catatan hukuman disiplin.'}`}
              </p>
            </div>

            {/* Riwayat Keppres Lama / Terbit */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-800 block">Riwayat Keputusan Presiden (Keppres):</span>
              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>
                  <span className="text-[11px] text-slate-400 block">SLKS Lama:</span>
                  <span className="font-semibold text-slate-800">
                    {detailModalUsulan.slksLamaTingkat ? `SLKS ${detailModalUsulan.slksLamaTingkat}` : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Nomor & Tanggal Keppres Lama:</span>
                  <span className="font-semibold text-slate-800">
                    {detailModalUsulan.slksLamaNoKeppres || '-'} ({detailModalUsulan.slksLamaTglKeppres || '-'})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onCetakUsulan(detailModalUsulan);
                  setDetailModalUsulan(null);
                }}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cetak Blanko F-01
              </button>
              <button
                type="button"
                onClick={() => setDetailModalUsulan(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

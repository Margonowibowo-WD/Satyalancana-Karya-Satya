import React, { useState, useMemo } from 'react';
import { UsulanSLKS, TingkatSLKS, StatusKelayakan } from '../types/slks';
import { MedalBadge } from './MedalBadge';
import { formatNIP } from '../utils/nipParser';
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
}

export const TabelDaftarUsulan: React.FC<TabelDaftarUsulanProps> = ({
  usulanList,
  onEditUsulan,
  onDeleteUsulan,
  onCetakUsulan,
  onUpdateStatusWorkflow,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelayakan, setFilterKelayakan] = useState<StatusKelayakan | 'ALL'>('ALL');
  const [filterTingkat, setFilterTingkat] = useState<TingkatSLKS | 'ALL'>('ALL');
  const [detailModalUsulan, setDetailModalUsulan] = useState<UsulanSLKS | null>(null);

  // Modal Update Status Keppres
  const [keppresModalUsulan, setKeppresModalUsulan] = useState<UsulanSLKS | null>(null);
  const [inputNoKeppres, setInputNoKeppres] = useState('');
  const [inputTglKeppres, setInputTglKeppres] = useState('');

  // Filtering Logic
  const filteredList = useMemo(() => {
    return usulanList.filter((item) => {
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
  }, [usulanList, searchTerm, filterKelayakan, filterTingkat]);

  // Ekspor ke CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'NIP',
      'Nama Pegawai',
      'Pangkat/Golongan',
      'Jabatan',
      'Unit Kerja',
      'Instansi',
      'Masa Kerja Tahun',
      'Masa Kerja Bulan',
      'SLKS Usulan',
      'Periode Usulan',
      'Status Kelayakan (MS/TMS)',
      'Keterangan TMS',
      'Status Usulan',
      'No Keppres',
    ];

    const rows = filteredList.map((item, idx) => [
      idx + 1,
      `'${item.pegawai.nip}`,
      `"${item.pegawai.nama.replace(/"/g, '""')}"`,
      `"${item.pegawai.kdPangkat} - ${item.pegawai.namaPangkat}"`,
      `"${item.pegawai.jabatan.replace(/"/g, '""')}"`,
      `"${(item.pegawai.unitKerja || '').replace(/"/g, '""')}"`,
      `"${(item.pegawai.instansi || '').replace(/"/g, '""')}"`,
      item.mkPnsTahun,
      item.mkPnsBulan,
      item.slksUsul === 'X' ? '10 Tahun' : item.slksUsul === 'XX' ? '20 Tahun' : '30 Tahun',
      `${item.bulanPengusulan}/${item.tahunPengusulan}`,
      item.statusKelayakan,
      `"${(item.keteranganTms || '').replace(/"/g, '""')}"`,
      `"${item.statusUsulan}"`,
      `"${item.noKeppres || '-'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Daftar_Nominatif_SLKS_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Hitung stats
  const total = usulanList.length;
  const countMS = usulanList.filter((u) => u.statusKelayakan === 'MS').length;
  const countTMS = usulanList.filter((u) => u.statusKelayakan === 'TMS').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header and Quick Stats */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <span>BKPSDM KABUPATEN MUKOMUKO</span>
              <span>·</span>
              <span>Rekapitulasi Usulan Resmi</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              DAFTAR NOMINATIF USULAN SATYALANCANA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Data rekap pengusulan tanda kehormatan ASN, status verifikasi administrasi (MS / TMS), dan pemantauan SK Presiden.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-teal-900 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
              <span>Unduh CSV / Excel</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Strip & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
              Total Diusulkan
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
              {total} Pegawai
            </span>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-3.5">
            <span className="text-[10px] font-bold text-teal-800 block uppercase tracking-wider">
              Memenuhi Syarat (MS)
            </span>
            <span className="text-xl font-extrabold text-teal-950 font-mono tabular-nums">
              {countMS} ({total ? Math.round((countMS / total) * 100) : 0}%)
            </span>
          </div>

          <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5">
            <span className="text-[10px] font-bold text-rose-800 block uppercase tracking-wider">
              Tidak Memenuhi (TMS)
            </span>
            <span className="text-xl font-extrabold text-rose-950 font-mono tabular-nums">
              {countTMS} Pegawai
            </span>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5">
            <span className="text-[10px] font-bold text-amber-900 block uppercase tracking-wider">
              SLKS Emas (30 Th)
            </span>
            <span className="text-xl font-extrabold text-amber-950 font-mono tabular-nums">
              {usulanList.filter((u) => u.slksUsul === 'XXX').length} Pegawai
            </span>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Nama, NIP, atau Unit Kerja..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 rounded-xl text-xs sm:text-sm text-slate-800 outline-none"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Kelayakan */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFilterKelayakan('ALL')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
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
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterKelayakan === 'MS'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MS ({countMS})
              </button>
              <button
                type="button"
                onClick={() => setFilterKelayakan('TMS')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterKelayakan === 'TMS'
                    ? 'bg-white text-rose-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                TMS ({countTMS})
              </button>
            </div>

            {/* Filter Tingkat */}
            <select
              value={filterTingkat}
              onChange={(e) => setFilterTingkat(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 outline-none font-medium"
            >
              <option value="ALL">Semua Tingkat SLKS</option>
              <option value="X">SLKS X (10 Tahun)</option>
              <option value="XX">SLKS XX (20 Tahun)</option>
              <option value="XXX">SLKS XXX (30 Tahun)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 font-semibold text-slate-700 text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3 text-left w-12">
                  No
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Pegawai (Nama & NIP)
                </th>
                <th scope="col" className="px-4 py-3 text-left">
                  Pangkat & Jabatan
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Masa Kerja
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Usulan SLKS
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Kelayakan
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Tahapan Usulan
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">Tidak ada data usulan yang cocok</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coba ubah kata kunci pencarian atau filter status.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* No */}
                    <td className="px-4 py-3.5 text-xs text-slate-500 font-mono tabular-nums">
                      {idx + 1}
                    </td>

                    {/* Pegawai */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{item.pegawai.nama}</div>
                      <div className="text-xs text-slate-500 font-mono tracking-wider">
                        {formatNIP(item.pegawai.nip)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.pegawai.unitKerja} · {item.pegawai.kabKota || item.pegawai.provinsi}
                      </div>
                    </td>

                    {/* Pangkat & Jabatan */}
                    <td className="px-4 py-3.5 text-xs">
                      <div className="font-medium text-slate-800">
                        Gol. {item.pegawai.kdPangkat} ({item.pegawai.namaPangkat})
                      </div>
                      <div className="text-slate-500 line-clamp-1 max-w-xs" title={item.pegawai.jabatan}>
                        {item.pegawai.jabatan}
                      </div>
                    </td>

                    {/* Masa Kerja */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-mono font-bold text-slate-900 text-xs tabular-nums">
                        {item.mkPnsTahun} Thn {item.mkPnsBulan} Bln
                      </span>
                      {item.pegawai.noSkHukdis && (
                        <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                          Ada SK Hukdis
                        </div>
                      )}
                    </td>

                    {/* Usulan SLKS */}
                    <td className="px-4 py-3.5 text-center">
                      <MedalBadge tingkat={item.slksUsul} size="sm" />
                    </td>

                    {/* Kelayakan MS / TMS */}
                    <td className="px-4 py-3.5 text-center">
                      {item.statusKelayakan === 'MS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          MS
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300"
                          title={item.keteranganTms}
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          TMS
                        </span>
                      )}
                    </td>

                    {/* Tahapan Usulan */}
                    <td className="px-4 py-3.5 text-center text-xs">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {item.statusUsulan}
                      </span>
                      {item.noKeppres && (
                        <div className="text-[10px] font-mono text-emerald-700 font-semibold mt-1">
                          SK: {item.noKeppres}
                        </div>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailModalUsulan(item)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Lihat Detail Profil & Riwayat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onCetakUsulan(item)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                          title="Cetak Berkas Usulan (Portofolio F-01)"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditUsulan(item)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                          title="Edit Formulir"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus usulan atas nama ${item.pegawai.nama}?`)) {
                              onDeleteUsulan(item.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Hapus Usulan"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Detail Usulan & Verifikasi */}
      {detailModalUsulan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Detail Profil Usulan Satyalancana
                </span>
                <h3 className="text-lg font-bold text-slate-900">{detailModalUsulan.pegawai.nama}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalUsulan(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">NIP (BKN)</span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {formatNIP(detailModalUsulan.pegawai.nip)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">Pangkat & Golongan</span>
                <span className="text-sm font-bold text-slate-900">
                  {detailModalUsulan.pegawai.kdPangkat} - {detailModalUsulan.pegawai.namaPangkat}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jabatan:</span>
                <span className="font-medium text-slate-900">{detailModalUsulan.pegawai.jabatan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Unit Kerja & Instansi:</span>
                <span className="font-medium text-slate-900">
                  {detailModalUsulan.pegawai.unitKerja} ({detailModalUsulan.pegawai.instansi})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">TMT CPNS:</span>
                <span className="font-mono text-slate-900">{detailModalUsulan.pegawai.tmtCpns}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Masa Kerja Nyata (mkpns):</span>
                <span className="font-mono font-bold text-slate-900">
                  {detailModalUsulan.mkPnsTahun} Tahun {detailModalUsulan.mkPnsBulan} Bulan
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tanda Kehormatan Diusulkan:</span>
                <MedalBadge tingkat={detailModalUsulan.slksUsul} size="sm" />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status Kelayakan:</span>
                <span
                  className={`font-bold ${
                    detailModalUsulan.statusKelayakan === 'MS'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {detailModalUsulan.statusKelayakan === 'MS'
                    ? 'MS (Memenuhi Syarat)'
                    : 'TMS (Tidak Memenuhi Syarat)'}
                </span>
              </div>
            </div>

            {/* Riwayat Sebelumnya */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase block mb-1.5">
                Riwayat Satyalancana Sebelumnya:
              </span>
              {detailModalUsulan.pegawai.riwayatSlks &&
              detailModalUsulan.pegawai.riwayatSlks.length > 0 ? (
                <div className="space-y-1 text-xs">
                  {detailModalUsulan.pegawai.riwayatSlks.map((rw) => (
                    <div key={rw.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <MedalBadge tingkat={rw.tingkat} size="sm" />
                      <span className="font-mono text-slate-700">SK: {rw.noKeppres} ({rw.tglKeppres})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">Belum pernah memperoleh penghargaan.</span>
              )}
            </div>

            {/* Jika TMS */}
            {detailModalUsulan.statusKelayakan === 'TMS' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                <span className="font-bold block mb-1">Catatan Alasan TMS:</span>
                <p>{detailModalUsulan.keteranganTms || 'Tidak memenuhi kriteria masa kerja atau syarat integritas.'}</p>
              </div>
            )}

            {/* Action Buttons in Modal */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setDetailModalUsulan(null);
                  onCetakUsulan(detailModalUsulan);
                }}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Portofolio F-01
              </button>
              <button
                type="button"
                onClick={() => setDetailModalUsulan(null)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold cursor-pointer"
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

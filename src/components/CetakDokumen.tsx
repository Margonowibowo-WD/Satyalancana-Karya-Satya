import React, { useState } from 'react';
import { UsulanSLKS, PengaturanInstansi } from '../types/slks';
import { getPangkatName } from '../data/pangkatData';
import { Printer, Download, Table2 } from 'lucide-react';
import { exportToCSV10Kolom, prepareBKNRows } from '../utils/exportBKN';
import { sortUsulanList } from '../utils/storage';

interface CetakDokumenProps {
  usulanList: UsulanSLKS[];
  activeUsulanForSinglePrint?: UsulanSLKS | null;
  pengaturan?: PengaturanInstansi;
}

export const CetakDokumen: React.FC<CetakDokumenProps> = ({
  usulanList,
  pengaturan,
}) => {
  const [filterTingkatDoc, setFilterTingkatDoc] = useState<'ALL' | 'X' | 'XX' | 'XXX'>('ALL');

  // Filter usulan yang Memenuhi Syarat (MS) dengan pengurutan resmi (SLKS 30>10, Pangkat tertinggi>terendah, Umur tertua>termuda)
  const msList = sortUsulanList(
    usulanList.filter((u) => {
      const isMS = u.statusKelayakan === 'MS';
      const matchTingkat = filterTingkatDoc === 'ALL' || u.slksUsul === filterTingkatDoc;
      return isMS && matchTingkat;
    })
  );

  const handlePrint = () => {
    window.print();
  };

  // Unduh CSV 10 Kolom (dengan formula ="NIP" agar format Text terjaga di Excel)
  const handleExportCSV = () => {
    const rows = prepareBKNRows(msList, pengaturan);
    exportToCSV10Kolom(
      rows,
      `Nominatif_SLKS_10_Kolom_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Control Toolbar (Disembunyikan otomatis saat Cetak / Print PDF) */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Table2 className="w-4 h-4 text-teal-700" />
              <span>TABEL USULAN SATYALANCANA KARYA SATYA (10 KOLOM RESMI BKN)</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              CETAK TABEL USULAN & EKSPOR DATA
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Tombol Unduh CSV Format Teks */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              title="Unduh file CSV 10 kolom BKN dengan pengunci teks NIP"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Unduh CSV (10 Kolom)</span>
            </button>

            {/* Tombol Cetak Dokumen / Print PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Tabel Sekarang (PDF)</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 font-semibold">Filter Kategori SLKS:</span>
            <select
              value={filterTingkatDoc}
              onChange={(e) => setFilterTingkatDoc(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white outline-none font-semibold text-slate-800 focus:border-teal-600"
            >
              <option value="ALL">Semua Kategori (10, 20, 30 Tahun)</option>
              <option value="X">Hanya 10 Tahun (X)</option>
              <option value="XX">Hanya 20 Tahun (XX)</option>
              <option value="XXX">Hanya 30 Tahun (XXX)</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-teal-800 font-bold">{msList.length}</strong> pegawai Memenuhi Syarat (MS)
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER - HANYA TABEL MURNI SESUAI PERMINTAAN USER #7 */}
      <div className="bg-white border border-slate-300 shadow-sm rounded-2xl p-4 sm:p-6 text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0 overflow-x-auto">
        <table className="w-full text-xs border-collapse border border-slate-800 print:text-[10px]">
          <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-800">
            <tr className="border border-slate-800 text-center">
              <th className="border border-slate-800 px-2 py-2.5 w-10">No</th>
              <th className="border border-slate-800 px-3 py-2.5 text-left w-44">NIP</th>
              <th className="border border-slate-800 px-3 py-2.5 text-left w-56">Nama</th>
              <th className="border border-slate-800 px-2 py-2.5 text-center w-36">Pangkat</th>
              <th className="border border-slate-800 px-3 py-2.5 text-left">Jabatan</th>
              <th className="border border-slate-800 px-2 py-2.5 text-center w-20">SlksLama</th>
              <th className="border border-slate-800 px-2.5 py-2.5 text-left w-36">NoKeppres</th>
              <th className="border border-slate-800 px-2 py-2.5 text-center w-24">TglKeppres</th>
              <th className="border border-slate-800 px-2 py-2.5 text-center font-bold w-20">SlksUsul</th>
              <th className="border border-slate-800 px-2 py-2.5 text-center w-20">KdWil</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {msList.length === 0 ? (
              <tr>
                <td colSpan={10} className="border border-slate-800 px-4 py-8 text-center text-slate-500 italic">
                  Tidak ada usulan yang memenuhi syarat (MS) pada kategori terpilih.
                </td>
              </tr>
            ) : (
              msList.map((item, idx) => (
                <tr key={item.id} className="border border-slate-800 hover:bg-slate-50/50">
                  <td className="border border-slate-800 px-2 py-2 text-center tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-800 px-3 py-2 font-mono text-[11px] whitespace-nowrap">
                    {item.pegawai.nip}
                  </td>
                  <td className="border border-slate-800 px-3 py-2 font-semibold">
                    {item.pegawai.nama}
                  </td>
                  <td className="border border-slate-800 px-2 py-2 text-center font-medium whitespace-nowrap">
                    {getPangkatName(item.pegawai.kdPangkat, item.pegawai.namaPangkat)}
                  </td>
                  <td className="border border-slate-800 px-3 py-2">
                    <div>{item.pegawai.jabatan}</div>
                    {item.pegawai.unitKerja && (
                      <div className="text-[10px] text-slate-500">{item.pegawai.unitKerja}</div>
                    )}
                  </td>
                  <td className="border border-slate-800 px-2 py-2 text-center font-bold">
                    {item.slksLamaTingkat || item.pegawai.riwayatSlks?.[0]?.tingkat || '-'}
                  </td>
                  <td className="border border-slate-800 px-2.5 py-2 text-[11px] text-slate-700">
                    {item.slksLamaNoKeppres || item.pegawai.riwayatSlks?.[0]?.noKeppres || '-'}
                  </td>
                  <td className="border border-slate-800 px-2 py-2 text-center text-[11px] whitespace-nowrap">
                    {item.slksLamaTglKeppres || item.pegawai.riwayatSlks?.[0]?.tglKeppres || '-'}
                  </td>
                  <td className="border border-slate-800 px-2 py-2 text-center font-bold text-teal-900 bg-teal-50/30">
                    {item.slksUsul}
                  </td>
                  <td className="border border-slate-800 px-2 py-2 text-center font-mono text-[11px]">
                    {item.pegawai.kdWil || pengaturan?.kdWil || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

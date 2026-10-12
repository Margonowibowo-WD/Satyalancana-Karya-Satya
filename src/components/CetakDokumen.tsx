import React, { useState } from 'react';
import { UsulanSLKS, PengaturanInstansi } from '../types/slks';
import { formatNIP } from '../utils/nipParser';
import { Printer, FileText, CheckCircle2, Building2 } from 'lucide-react';

interface CetakDokumenProps {
  usulanList: UsulanSLKS[];
  activeUsulanForSinglePrint?: UsulanSLKS | null;
  pengaturan?: PengaturanInstansi;
}

export const CetakDokumen: React.FC<CetakDokumenProps> = ({
  usulanList,
  activeUsulanForSinglePrint,
  pengaturan,
}) => {
  const [docType, setDocType] = useState<'nominatif' | 'f01'>('nominatif');
  const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>(
    activeUsulanForSinglePrint
      ? activeUsulanForSinglePrint.id
      : usulanList[0]?.id || ''
  );
  const [filterTingkatDoc, setFilterTingkatDoc] = useState<'ALL' | 'X' | 'XX' | 'XXX'>('ALL');

  // Filter usulan yang Memenuhi Syarat (MS) untuk Lampiran Nominatif
  const msList = usulanList.filter((u) => {
    const isMS = u.statusKelayakan === 'MS';
    const matchTingkat = filterTingkatDoc === 'ALL' || u.slksUsul === filterTingkatDoc;
    return isMS && matchTingkat;
  });

  const selectedUsulan =
    usulanList.find((u) => u.id === selectedPegawaiId) || usulanList[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Control Toolbar (Hidden in Print) */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>BKPSDM KABUPATEN MUKOMUKO · PUSAT CETAK BERKAS RESMI</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              GENERATOR & CETAK DOKUMEN USULAN SLKS
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Daftar Nominatif Lampiran Keputusan Presiden RI dan Blanko Riwayat Hidup F-01 siap print / simpan PDF.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen Sekarang (PDF)</span>
            </button>
          </div>
        </div>

        {/* Format Selector Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDocType('nominatif')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                docType === 'nominatif'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Daftar Nominatif Usulan (Lampiran SK Presiden)
            </button>
            <button
              type="button"
              onClick={() => setDocType('f01')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                docType === 'f01'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Blanko Formulir Riwayat Hidup / F-01 Per Pegawai
            </button>
          </div>

          {docType === 'nominatif' ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-semibold">Filter Kategori:</span>
              <select
                value={filterTingkatDoc}
                onChange={(e) => setFilterTingkatDoc(e.target.value as any)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white outline-none font-medium"
              >
                <option value="ALL">Semua Kategori (10, 20, 30 Th)</option>
                <option value="X">Hanya 10 Tahun (X)</option>
                <option value="XX">Hanya 20 Tahun (XX)</option>
                <option value="XXX">Hanya 30 Tahun (XXX)</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-semibold">Pilih Pegawai:</span>
              <select
                value={selectedPegawaiId}
                onChange={(e) => setSelectedPegawaiId(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white max-w-xs font-semibold outline-none"
              >
                {usulanList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.pegawai.nama} ({u.pegawai.kdPangkat} - SLKS {u.slksUsul})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Styled like paper document) */}
      <div className="bg-white border border-slate-300 shadow-lg rounded-2xl max-w-5xl mx-auto p-8 sm:p-12 text-slate-900 print:shadow-none print:border-none print:p-0">
        {docType === 'nominatif' ? (
          /* =================================================== */
          /* DOKUMEN 1: DAFTAR NOMINATIF USULAN TANDA KEHORMATAN */
          /* =================================================== */
          <div className="space-y-6">
            {/* Kop Resmi Surat Pemerintah Daerah / Kementerian */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="text-sm font-serif tracking-widest uppercase font-bold text-slate-900">
                {pengaturan?.namaInstansi || 'PEMERINTAH REPUBLIK INDONESIA'}
              </div>
              <div className="text-xs font-serif tracking-wider uppercase font-semibold text-slate-800">
                {pengaturan?.kabKota ? `${pengaturan.kabKota}, PROVINSI ${pengaturan.provinsi.toUpperCase()}` : 'REPUBLIK INDONESIA'}
              </div>
              <div className="pt-2">
                <h2 className="text-base sm:text-lg font-bold font-serif uppercase tracking-wide">
                  DAFTAR NOMINATIF USULAN PENERIMA TANDA KEHORMATAN
                </h2>
                <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-slate-800">
                  SATYALANCANA KARYA SATYA TAHUN {new Date().getFullYear()}
                </h3>
              </div>
            </div>

            {/* Sub Header Metadata */}
            <div className="flex justify-between text-xs font-serif pt-1">
              <div>
                <div><strong>Instansi Pengusul:</strong> {pengaturan?.namaInstansi || 'Pemerintah Daerah'}</div>
                <div><strong>Jumlah Calon:</strong> {msList.length} Orang Memenuhi Syarat (MS)</div>
              </div>
              <div className="text-right">
                <div><strong>Lampiran Surat:</strong> 800/SLKS/{new Date().getFullYear()}</div>
                <div><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Tabel Nominatif */}
            <div className="border border-slate-900 overflow-hidden">
              <table className="min-w-full text-xs divide-y divide-slate-900 font-serif">
                <thead className="bg-slate-100 font-bold divide-y divide-slate-900">
                  <tr className="divide-x divide-slate-900 text-center">
                    <th className="px-2 py-2 w-8">NO</th>
                    <th className="px-3 py-2 text-left">NAMA LENGKAP & NIP</th>
                    <th className="px-2 py-2 text-left">PANGKAT / GOL</th>
                    <th className="px-3 py-2 text-left">JABATAN & UNIT KERJA</th>
                    <th className="px-2 py-2 w-20">MASA KERJA</th>
                    <th className="px-2 py-2 w-28">TANDA KEHORMATAN</th>
                    <th className="px-2 py-2 w-24">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {msList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                        Tidak ada usulan yang memenuhi syarat (MS) pada kategori terpilih.
                      </td>
                    </tr>
                  ) : (
                    msList.map((item, idx) => (
                      <tr key={item.id} className="divide-x divide-slate-900">
                        <td className="px-2 py-2 text-center tabular-nums">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <div className="font-bold">{item.pegawai.nama}</div>
                          <div className="font-mono text-[11px]">{formatNIP(item.pegawai.nip)}</div>
                        </td>
                        <td className="px-2 py-2">
                          <div>{item.pegawai.namaPangkat}</div>
                          <div className="font-bold">({item.pegawai.kdPangkat})</div>
                        </td>
                        <td className="px-3 py-2">
                          <div>{item.pegawai.jabatan}</div>
                          <div className="text-[11px] text-slate-600">{item.pegawai.unitKerja}</div>
                        </td>
                        <td className="px-2 py-2 text-center tabular-nums font-mono">
                          {item.mkPnsTahun} Th {item.mkPnsBulan} Bl
                        </td>
                        <td className="px-2 py-2 text-center font-bold">
                          {item.slksUsul === 'X'
                            ? '10 TAHUN (X)'
                            : item.slksUsul === 'XX'
                            ? '20 TAHUN (XX)'
                            : '30 TAHUN (XXX)'}
                        </td>
                        <td className="px-2 py-2 text-center text-[10px] font-semibold text-emerald-900">
                          MS (Memenuhi Syarat)
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Legalitas & Tanda Tangan */}
            <div className="pt-8 grid grid-cols-2 text-xs font-serif">
              <div>
                <p className="text-slate-600 italic">
                  Catatan: Seluruh calon di atas telah diverifikasi memenuhi masa kerja dan tidak pernah dijatuhi hukuman disiplin tingkat sedang atau berat.
                </p>
              </div>
              <div className="text-right space-y-1">
                <div>{pengaturan?.kabKota || 'Indonesia'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div className="font-bold pt-1 uppercase">PEJABAT PEMBINA KEPEGAWAIAN (PPK)</div>
                <div className="text-[11px] text-slate-600">Selaku Pejabat Pembina Kepegawaian</div>
                <div className="h-20" />
                <div className="font-bold underline uppercase">( ............................................................ )</div>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================== */
          /* DOKUMEN 2: BLANKO F-01 PORTOFOLIO USULAN PEGAWAI    */
          /* =================================================== */
          <div className="space-y-6">
            {/* Header Dokumen F-01 */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="text-xs font-serif uppercase tracking-widest font-semibold text-slate-700">
                PEMERINTAH KABUPATEN MUKOMUKO · BKPSDM
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif uppercase tracking-wide">
                DAFTAR RIWAYAT HIDUP CALON PENERIMA TANDA KEHORMATAN
              </h2>
              <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-slate-800">
                SATYALANCANA KARYA SATYA
              </h3>
            </div>

            {selectedUsulan ? (
              <div className="space-y-4 text-xs font-serif">
                {/* 1. DATA PRIBADI */}
                <div className="space-y-2">
                  <div className="font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-1.5 border border-slate-300">
                    I. IDENTITAS PEGAWAI NEGERI SIPIL
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="w-48 py-1.5 font-semibold">1. Nama Lengkap (dengan gelar)</td>
                        <td className="w-4 py-1.5">:</td>
                        <td className="py-1.5 font-bold">{selectedUsulan.pegawai.nama}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">2. NIP (Nomor Induk Pegawai)</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5 font-mono">{formatNIP(selectedUsulan.pegawai.nip)}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">3. Tempat, Tanggal Lahir</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5">
                          {selectedUsulan.pegawai.kabKota || 'Mukomuko'}, {selectedUsulan.pegawai.tanggalLahir}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">4. Pangkat / Golongan Ruang</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5">
                          {selectedUsulan.pegawai.namaPangkat} ({selectedUsulan.pegawai.kdPangkat})
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">5. Jabatan Terakhir</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5">{selectedUsulan.pegawai.jabatan}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">6. Unit Kerja & Instansi</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5">
                          {selectedUsulan.pegawai.unitKerja} - {selectedUsulan.pegawai.instansi}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">7. TMT CPNS</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5 font-mono font-bold">{selectedUsulan.pegawai.tmtCpns}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 2. MASA KERJA & INTEGRITAS */}
                <div className="space-y-2 pt-2">
                  <div className="font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-1.5 border border-slate-300">
                    II. MASA KERJA DAN KETERANGAN INTEGRITAS
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="w-48 py-1.5 font-semibold">1. Masa Kerja PNS Riil (mkpns)</td>
                        <td className="w-4 py-1.5">:</td>
                        <td className="py-1.5 font-bold font-mono">
                          {selectedUsulan.mkPnsTahun} Tahun {selectedUsulan.mkPnsBulan} Bulan
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">2. Hukuman Disiplin</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5">
                          {selectedUsulan.pegawai.noSkHukdis ? (
                            <span className="text-rose-700 font-bold">
                              Pernah (SK No: {selectedUsulan.pegawai.noSkHukdis})
                            </span>
                          ) : (
                            'Tidak pernah dijatuhi hukuman disiplin tingkat sedang atau berat (NIHIL)'
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-1.5 font-semibold">3. Cuti di Luar Tanggungan (CLTN)</td>
                        <td className="py-1.5">:</td>
                        <td className="py-1.5">
                          {selectedUsulan.pegawai.noSkCltn
                            ? `Pernah (SK: ${selectedUsulan.pegawai.noSkCltn})`
                            : 'Tidak pernah (NIHIL)'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 3. TANDA KEHORMATAN YANG DIUSULKAN */}
                <div className="space-y-2 pt-2">
                  <div className="font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-1.5 border border-slate-300">
                    III. PENGHARGAAN YANG DIMOHONKAN
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <div className="font-bold text-sm">
                      Tanda Kehormatan Satyalancana Karya Satya{' '}
                      {selectedUsulan.slksUsul === 'X'
                        ? '10 TAHUN (Perunggu)'
                        : selectedUsulan.slksUsul === 'XX'
                        ? '20 TAHUN (Perak)'
                        : '30 TAHUN (Emas)'}
                    </div>
                    <div className="text-slate-600 text-xs mt-1">
                      Status Evaluasi BKPSDM Mukomuko:{' '}
                      <strong
                        className={
                          selectedUsulan.statusKelayakan === 'MS'
                            ? 'text-emerald-800'
                            : 'text-rose-800'
                        }
                      >
                        {selectedUsulan.statusKelayakan === 'MS'
                          ? 'MEMENUHI SYARAT (MS)'
                          : 'TIDAK MEMENUHI SYARAT (TMS)'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Tanda Tangan Dokumen F-01 */}
                <div className="pt-8 grid grid-cols-2 text-xs font-serif">
                  <div className="text-center space-y-1">
                    <div>Mengetahui,</div>
                    <div className="font-bold">Kepala Unit Kerja / Atasan Langsung</div>
                    <div className="h-16" />
                    <div className="font-bold underline uppercase">( ................................................... )</div>
                    <div className="text-[11px]">NIP. ....................................................</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div>Mukomuko, ................................. {new Date().getFullYear()}</div>
                    <div className="font-bold">Pegawai Yang Bersangkutan</div>
                    <div className="h-16" />
                    <div className="font-bold underline uppercase">{selectedUsulan.pegawai.nama}</div>
                    <div className="text-[11px]">NIP. {formatNIP(selectedUsulan.pegawai.nip)}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

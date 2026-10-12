import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Cloud,
  HardDrive,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Download,
  Upload,
  Globe,
  Database,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface PanduanPenggunaanProps {
  onNavigateToTab: (tab: 'input' | 'daftar' | 'cetak' | 'statistik' | 'master') => void;
  onExportBackup?: () => void;
  onImportBackup?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PanduanPenggunaan: React.FC<PanduanPenggunaanProps> = ({
  onNavigateToTab,
  onExportBackup,
  onImportBackup,
}) => {
  const [activeSection, setActiveSection] = useState<'alur' | 'format' | 'arsitektur' | 'regulasi' | 'faq'>('alur');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
                Buku Petunjuk Operasional
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-500 font-medium">
                Panduan Pengelola Kepegawaian Se-Indonesia
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              PANDUAN PENGGUNAAN APLIKASI SI-SLKS
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Pelajari tata cara pengusulan Tanda Kehormatan Satyalancana Karya Satya (10, 20, dan 30 Tahun), impor data dari Google Sheets, serta penjelasan arsitektur data online tanpa tubrukan antar kabupaten.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onExportBackup && (
              <button
                type="button"
                onClick={onExportBackup}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                title="Cadangkan seluruh data ke 1 file JSON"
              >
                <Download className="w-4 h-4 text-teal-700" />
                <span>Cadangkan Data (Backup JSON)</span>
              </button>
            )}

            {onImportBackup && (
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-slate-300">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Pulihkan Cadangan (Restore)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Navigation Tabs for Guide Sections */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveSection('alur')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'alur'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Alur Kerja Cepat (5 Langkah)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('format')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'format'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Format Data Google Sheets (5 Kolom)
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('arsitektur')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'arsitektur'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Penjelasan Online, GitHub & Keamanan Data
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('regulasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'regulasi'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            4. Ketentuan PP No. 35 Tahun 2010
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('faq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSection === 'faq'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            5. Tanya Jawab (FAQ)
          </button>
        </div>
      </div>

      {/* SECTION 1: ALUR KERJA CEPAT 5 LANGKAH */}
      {activeSection === 'alur' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Atur Profil Wilayah</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buka tab <strong>Master & Pengaturan</strong>. Isi Nama Instansi, Kabupaten/Kota, Provinsi, dan Kode Wilayah BKN secara manual.
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab('master')}
                className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Buka Tab Master <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Impor Pegawai (5 Kolom)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Di tab Master, unggah file CSV hasil unduhan Google Sheets/Excel dengan 5 kolom: <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">NIP, NAMA, PANGKAT, JABATAN, UNIT_KERJA</code>.
              </p>
              <span className="text-xs text-emerald-700 font-semibold block">
                Auto-Replace & Instan
              </span>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Input Usulan Satyalancana</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buka tab <strong>Input Usulan</strong> atau klik tombol <em>"Usulkan"</em> pada tabel Master. Sistem otomatis menghitung masa kerja riil (<code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">mkpns</code>) dan status kelayakan <strong>MS / TMS</strong>.
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab('input')}
                className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Ke Input Usulan <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Cek Rekap & Status</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buka tab <strong>Daftar Usulan</strong> untuk memfilter pegawai berstatus MS/TMS, mencari nama/NIP, atau mengunduh rekapan ke spreadsheet Excel (CSV).
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab('daftar')}
                className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Lihat Daftar <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900">Cetak Dokumen Resmi</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buka tab <strong>Cetak Dokumen</strong> untuk mencetak <em>Daftar Nominatif Lampiran SK Presiden</em> atau <em>Formulir Portofolio F-01</em> per pegawai siap tanda tangan Pejabat Pembina Kepegawaian (PPK).
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab('cetak')}
                className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Cetak Dokumen <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FORMAT DATA GOOGLE SHEETS */}
      {activeSection === 'format' && (
        <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              STRUKTUR 5 KOLOM GOOGLE SHEETS / EXCEL
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sangat simpel dan praktis! Cukup sediakan 5 kolom di baris paling atas (header):
            </p>
          </div>

          <div className="border border-teal-300 rounded-xl overflow-hidden shadow-xs">
            <table className="min-w-full divide-y divide-teal-300 text-xs">
              <thead className="bg-teal-100/90 text-teal-950 font-bold">
                <tr>
                  <th className="px-3 py-2 text-left">Kolom 1</th>
                  <th className="px-3 py-2 text-left">Kolom 2</th>
                  <th className="px-3 py-2 text-left">Kolom 3</th>
                  <th className="px-3 py-2 text-left">Kolom 4</th>
                  <th className="px-3 py-2 text-left">Kolom 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-200 bg-white">
                <tr className="bg-teal-50/50 font-bold text-teal-900 font-mono">
                  <td className="px-3 py-2">NIP</td>
                  <td className="px-3 py-2">NAMA</td>
                  <td className="px-3 py-2">PANGKAT</td>
                  <td className="px-3 py-2">JABATAN</td>
                  <td className="px-3 py-2">UNIT_KERJA</td>
                </tr>
                <tr className="text-slate-700">
                  <td className="px-3 py-2 font-mono">198506142010011002</td>
                  <td className="px-3 py-2 font-medium">Budi Santoso, S.STP.</td>
                  <td className="px-3 py-2">III/c</td>
                  <td className="px-3 py-2">Kepala Subbagian Kepegawaian</td>
                  <td className="px-3 py-2">BKPSDM</td>
                </tr>
                <tr className="text-slate-700">
                  <td className="px-3 py-2 font-mono">197804121998032001</td>
                  <td className="px-3 py-2 font-medium">Dra. Hj. Siti Aminah, M.Pd.</td>
                  <td className="px-3 py-2">IV/b</td>
                  <td className="px-3 py-2">Guru Ahli Madya</td>
                  <td className="px-3 py-2">SMAN 1</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-xl space-y-1.5">
              <span className="font-bold text-teal-950 block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                Mengapa tidak perlu mengetik Tanggal Lahir dan TMT CPNS?
              </span>
              <p className="text-slate-600 leading-relaxed">
                NIP PNS standar BKN memuat 18 digit angka. Digit 1-8 adalah tanggal lahir, digit 9-14 adalah tahun dan bulan TMT pengangkatan CPNS, dan digit 15 adalah jenis kelamin. Sistem kami membaca format ini secara otomatis sehingga Anda tidak perlu mengetik ulang!
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                Cara Menyimpan File dari Google Sheets ke CSV:
              </span>
              <p className="text-slate-600 leading-relaxed">
                Di Google Sheets, klik menu <strong>File &gt; Download &gt; Comma-separated values (.csv)</strong>. Berkas tersebut langsung siap diunggah ke tab <strong>Master & Pengaturan</strong>!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PENJELASAN ONLINE, GITHUB & KEAMANAN DATA (MENJAWAB PERTANYAAN USER) */}
      {activeSection === 'arsitektur' && (
        <div className="bg-white border border-teal-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Cloud className="w-4 h-4 text-teal-700" />
              <span>JAWABAN TEKNIS: ARSITEKTUR GITHUB, LOCAL STORAGE & KEAMANAN DATA</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Apakah Data Akan Tubrukan Antar Kabupaten Jika Digunakan Online di GitHub?
            </h2>
          </div>

          {/* Jawaban Utama */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-emerald-950">
                JAWABAN: TIDAK AKAN TUBRUKAN SAMA SEKALI! 100% AMAN & TERPISAH PER KABUPATEN!
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Aplikasi ini dibangun dengan arsitektur <strong>Client-Side Single Page Application (SPA)</strong>. Artinya, data tidak disimpan di satu server pusat, melainkan di <strong>penyimpanan lokal (LocalStorage) browser komputer masing-masing instansi</strong>.
              </p>
            </div>
          </div>

          {/* 3 Penjelasan Komparasi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Globe className="w-4 h-4 text-teal-700" />
                <span>1. Hosting Gratis GitHub</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                GitHub Pages hanya bertugas mengirimkan file kode tampilan (HTML/JS/CSS) ke browser laptop Anda. GitHub <strong>tidak menyimpan data NIP pegawai</strong> sehingga:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Server GitHub sangat ringan & tidak akan pernah lemot.</li>
                <li>Bisa diakses ribuan pengguna bersamaan secara gratis.</li>
                <li>Privasi data pegawai ASN tetap terjaga.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>2. Isolasi Data Per Laptop</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ketika <strong>BKD Kab. Mukomuko</strong> membuka web ini, datanya tersimpan di laptop Mukomuko. Ketika <strong>BKD Kota Bandung</strong> membuka link yang sama, datanya tersimpan di laptop Bandung.
              </p>
              <div className="p-2 bg-emerald-100/60 rounded text-[11px] font-semibold text-emerald-900">
                ✓ Data Kabupaten A tidak akan pernah tertimpa atau melihat data Kabupaten B.
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <HardDrive className="w-4 h-4 text-amber-700" />
                <span>3. Bisa Digunakan Offline</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Jika Anda ingin bekerja tanpa internet, aplikasi ini dapat disimpan di laptop atau di-bookmark offline. Dan untuk mencegah kehilangan data jika berganti komputer, gunakan tombol <strong>"Cadangkan Data (Backup JSON)"</strong> di atas untuk menyimpan file database ke flashdisk.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: KETENTUAN PP NO. 35 TAHUN 2010 */}
      {activeSection === 'regulasi' && (
        <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              KETENTUAN HUKUM PEMBERIAN SATYALANCANA KARYA SATYA
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Berdasarkan UU No. 20 Tahun 2009 dan Peraturan Pemerintah No. 35 Tahun 2010
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-amber-50/60 border border-amber-300 rounded-xl space-y-2">
              <div className="font-extrabold text-amber-950 text-sm">SLKS 10 Tahun (Perunggu)</div>
              <p className="text-slate-700 leading-relaxed">
                Diberikan kepada PNS yang telah bekerja dengan penuh kesetiaan kepada Pancasila, UUD 1945, negara dan pemerintah selama sekurang-kurangnya <strong>10 tahun terus-menerus</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl space-y-2">
              <div className="font-extrabold text-slate-900 text-sm">SLKS 20 Tahun (Perak)</div>
              <p className="text-slate-700 leading-relaxed">
                Diberikan kepada PNS yang telah mengabdi sekurang-kurangnya <strong>20 tahun terus-menerus</strong> dengan menunjukkan kecakapan, kedisiplinan, kesetiaan dan pengabdian.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-400 rounded-xl space-y-2">
              <div className="font-extrabold text-yellow-950 text-sm">SLKS 30 Tahun (Emas)</div>
              <p className="text-slate-700 leading-relaxed">
                Jenjang penghargaan tertinggi bagi PNS yang telah mengabdi sekurang-kurangnya <strong>30 tahun terus-menerus</strong> sehingga dapat dijadikan teladan bagi setiap pegawai lainnya.
              </p>
            </div>
          </div>

          {/* Larangan Hukdis & CLTN */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
            <span className="font-bold block">Penting: Syarat Integritas & Hukuman Disiplin (Pasal 22):</span>
            <p className="leading-relaxed">
              PNS yang <strong>pernah dijatuhi hukuman disiplin tingkat sedang atau berat</strong> tidak dapat diusulkan tanda kehormatan Satyalancana Karya Satya. Sistem ini secara otomatis memberikan status <strong>TMS (Tidak Memenuhi Syarat)</strong> jika kolom SK Hukdis terisi.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 5: FAQ */}
      {activeSection === 'faq' && (
        <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              PERTANYAAN YANG SERING DIAJUKAN (FAQ)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block">
                T: Apakah jika saya ganti laptop data usulan saya akan hilang?
              </span>
              <p className="text-slate-600 leading-relaxed">
                J: Karena data tersimpan di browser laptop Anda, gunakan tombol <strong>"Cadangkan Data (Backup JSON)"</strong> sebelum berganti laptop. Di laptop baru, buka website lalu klik <strong>"Pulihkan Cadangan (Restore)"</strong>. Seluruh data Anda akan kembali seketika!
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block">
                T: Bagaimana jika dalam 1 kabupaten ada 2 staf yang ingin berbagi data?
              </span>
              <p className="text-slate-600 leading-relaxed">
                J: Cara termudah dan paling efisien adalah menggunakan <strong>1 Google Sheet bersama</strong>. Staf menginput daftar nama dan NIP di Google Sheet yang sama, lalu staf yang bertugas mencetak usulan tinggal mengunduh CSV-nya dan mengimpor ke sistem ini.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block">
                T: Apakah data yang saya impor akan menimpa data usulan yang sudah saya simpan?
              </span>
              <p className="text-slate-600 leading-relaxed">
                J: Impor data di tab Master hanya menggantikan tabel master pegawai. Usulan yang sudah Anda simpan di tab <strong>Daftar Usulan</strong> tetap aman dan tidak terhapus.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

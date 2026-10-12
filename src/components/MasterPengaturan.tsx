import React, { useState } from 'react';
import { Pegawai, PengaturanInstansi } from '../types/slks';
import { parseNIP, formatNIP } from '../utils/nipParser';
import {
  Building2,
  FileSpreadsheet,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Download,
  Search,
  Save,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface MasterPengaturanProps {
  pengaturan: PengaturanInstansi;
  onSavePengaturan: (config: PengaturanInstansi) => void;
  pegawaiList: Pegawai[];
  onImportPegawai: (imported: Pegawai[]) => { total: number };
  onDeletePegawai: (nip: string) => void;
  onSelectPegawaiForProposal: (nip: string) => void;
}

export const MasterPengaturan: React.FC<MasterPengaturanProps> = ({
  pengaturan,
  onSavePengaturan,
  pegawaiList,
  onImportPegawai,
  onDeletePegawai,
  onSelectPegawaiForProposal,
}) => {
  // Form Pengaturan Instansi - Semuanya Manual Sesuai Permintaan User #1, #2, #3
  const [namaInstansi, setNamaInstansi] = useState(pengaturan.namaInstansi || '');
  const [kabKota, setKabKota] = useState(pengaturan.kabKota || '');
  const [provinsi, setProvinsi] = useState(pengaturan.provinsi || '');
  const [kdWil, setKdWil] = useState(pengaturan.kdWil || '');

  // Tab Impor: 'file' (Upload CSV/Excel) | 'link' (Link Google Sheet)
  const [importMode, setImportMode] = useState<'file' | 'link'>('file');

  // Input Google Sheet Link
  const [googleSheetUrl, setGoogleSheetUrl] = useState(pengaturan.googleSheetUrl || '');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  // Status Notification Prominen
  const [toastNotif, setToastNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search in Master Pegawai
  const [searchPegawai, setSearchPegawai] = useState('');

  const triggerToast = (type: 'success' | 'error', message: string) => {
    setToastNotif({ type, message });
    setTimeout(() => {
      setToastNotif(null);
    }, 4500);
  };

  // Simpan Pengaturan Wilayah
  const handleSimpanWilayah = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PengaturanInstansi = {
      namaInstansi: namaInstansi.trim(),
      kabKota: kabKota.trim(),
      provinsi: provinsi.trim(),
      kdWil: kdWil.trim(),
      googleSheetUrl,
    };
    onSavePengaturan(updated);
    triggerToast('success', 'Profil instansi dan wilayah berhasil disimpan!');
  };

  /**
   * Parser data yang membaca 5 KOLOM SESUAI IMAGE.PNG:
   * Kolom 1: NIP
   * Kolom 2: NAMA
   * Kolom 3: PANGKAT
   * Kolom 4: JABATAN
   * Kolom 5: UNIT_KERJA
   */
  const parseRowsToPegawai = (content: string, separator: string = ','): Pegawai[] => {
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return [];

    let sep = separator;
    if (lines[0].includes('\t')) sep = '\t';
    else if (lines[0].includes(';') && !lines[0].includes('\t')) sep = ';';
    else if (lines[0].includes(',') && !lines[0].includes('\t')) sep = ',';

    const header = lines[0].toLowerCase().split(sep).map((h) => h.trim().replace(/^["']|["']$/g, ''));

    // Kolom mapping sesuai image.png
    let nipIdx = header.findIndex((h) => h.includes('nip'));
    let namaIdx = header.findIndex((h) => h.includes('nama'));
    let pangkatIdx = header.findIndex((h) => h.includes('pangkat') || h.includes('gol'));
    let jabatanIdx = header.findIndex((h) => h.includes('jabatan'));
    let unitIdx = header.findIndex((h) => h.includes('unit') || h.includes('kerja'));

    const startIdx = nipIdx !== -1 || namaIdx !== -1 ? 1 : 0;
    if (nipIdx === -1) nipIdx = 0;
    if (namaIdx === -1) namaIdx = 1;
    if (pangkatIdx === -1) pangkatIdx = 2;
    if (jabatanIdx === -1) jabatanIdx = 3;
    if (unitIdx === -1) unitIdx = 4;

    const result: Pegawai[] = [];

    for (let i = startIdx; i < lines.length; i++) {
      const parts = lines[i].split(sep).map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 2) continue;

      const rawNip = (parts[nipIdx] || '').replace(/\D/g, '');
      const nama = parts[namaIdx] || '';
      if (!rawNip || rawNip.length < 18 || !nama) continue;

      // Parsing otomatis NIP 18 Digit: tanggal lahir, jenis kelamin, dan TMT CPNS
      const nipInfo = parseNIP(rawNip);
      const kdPangkat = parts[pangkatIdx] || 'III/a';
      const jabatan = parts[jabatanIdx] || 'Pegawai Negeri Sipil';
      const unitKerja = parts[unitIdx] || 'Instansi Terkait';

      result.push({
        nip: rawNip,
        nama,
        kdPangkat,
        namaPangkat: 'Penata',
        jabatan,
        unitKerja,
        instansi: namaInstansi || 'Pemerintah Daerah',
        kabKota: kabKota || 'Kabupaten / Kota',
        provinsi: provinsi || 'Provinsi',
        kdWil: kdWil || '00.00',
        jenisKelamin: nipInfo.jenisKelamin || 'Laki-laki',
        tanggalLahir: nipInfo.tanggalLahir || '1985-01-01',
        tmtCpns: nipInfo.tmtCpns || '2010-01-01',
        riwayatSlks: [],
      });
    }

    return result;
  };

  // Handle Import Berkas CSV / Excel (5 Kolom sesuai image.png)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseRowsToPegawai(text, ',');
        if (parsed.length === 0) {
          triggerToast('error', 'Gagal: File tidak memuat format NIP 18 digit dan Nama yang valid.');
          return;
        }

        // Langsung REPLACE seluruh data master pegawai sesuai Permintaan User #7
        const res = onImportPegawai(parsed);
        triggerToast(
          'success',
          `Data berhasil diimpor! ${res.total} data pegawai baru langsung menggantikan data sebelumnya.`
        );
      }
    };
    reader.readAsText(file);
    // Reset file input agar bisa upload file yang sama jika diedit
    e.target.value = '';
  };

  // Handle Import dari Link Google Sheets Publik
  const handleFetchGoogleSheetLink = async () => {
    if (!googleSheetUrl.trim()) {
      triggerToast('error', 'Silakan masukkan link Google Sheet Anda terlebih dahulu.');
      return;
    }

    try {
      setIsLoadingUrl(true);
      const match = googleSheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match || !match[1]) {
        triggerToast('error', 'Tautan Google Sheet tidak valid. Salin link lengkap dari browser.');
        setIsLoadingUrl(false);
        return;
      }

      const sheetId = match[1];
      const csvExportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      const response = await fetch(csvExportUrl);
      if (!response.ok) {
        throw new Error(
          `Gagal menarik Google Sheet (Status: ${response.status}). Pastikan izin tautan disetel ke "Siapa saja yang memiliki link dapat melihat".`
        );
      }

      const csvText = await response.text();
      const parsed = parseRowsToPegawai(csvText, ',');

      if (parsed.length === 0) {
        triggerToast('error', 'Tautan terhubung, namun tidak ada baris NIP 18 digit yang valid.');
        setIsLoadingUrl(false);
        return;
      }

      // Langsung REPLACE data master dengan data baru sesuai Permintaan User #7
      const res = onImportPegawai(parsed);
      triggerToast(
        'success',
        `Sukses! ${res.total} data pegawai dari Google Sheet langsung tampil dan menggantikan data lama.`
      );
    } catch (err: any) {
      console.error(err);
      triggerToast('error', err.message || 'Gagal menarik data Google Sheet. Pastikan izin sheet publik.');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  // Unduh Template Sesuai Format Persis image.png (5 Kolom: NIP, NAMA, PANGKAT, JABATAN, UNIT_KERJA)
  const handleDownloadTemplate = () => {
    const header = ['NIP', 'NAMA', 'PANGKAT', 'JABATAN', 'UNIT_KERJA'];
    const sampleRows = [
      ['198506142010011002', 'Budi Santoso, S.STP.', 'III/c', 'Kepala Subbagian Kepegawaian', 'BKPSDM'],
      ['197804121998032001', 'Dra. Hj. Siti Aminah, M.Pd.', 'IV/b', 'Guru Ahli Madya', 'SMAN 1'],
      ['199208202015021003', 'Hendra Wijaya, S.Kom.', 'III/b', 'Pranata Komputer Ahli Muda', 'Dinas Kominfo'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [header.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Template_Pegawai_5_Kolom.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('success', 'Template 5 kolom (NIP, NAMA, PANGKAT, JABATAN, UNIT_KERJA) berhasil diunduh!');
  };

  // Filter Master Pegawai
  const filteredPegawaiList = pegawaiList.filter((p) => {
    const q = searchPegawai.toLowerCase();
    return (
      !searchPegawai ||
      p.nama.toLowerCase().includes(q) ||
      p.nip.includes(q) ||
      (p.unitKerja && p.unitKerja.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Floating Prominent Toast Notification (Sesuai Permintaan User #6) */}
      {toastNotif && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all animate-bounce ${
            toastNotif.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-500'
              : 'bg-rose-900 text-white border-rose-500'
          }`}
        >
          {toastNotif.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <div>
            <div className="font-bold text-sm">
              {toastNotif.type === 'success' ? 'Pemberitahuan Sistem' : 'Peringatan'}
            </div>
            <div className="text-xs text-slate-100">{toastNotif.message}</div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>PENGATURAN INSTANSI & IMPOR DATA PEGAWAI NASIONAL</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              MASTER DATA & PENGATURAN WILAYAH
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Isi data wilayah instansi secara manual dan impor data pegawai dengan format 5 kolom (NIP, NAMA, PANGKAT, JABATAN, UNIT_KERJA).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-teal-900 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-700" />
              <span>Unduh Template (5 Kolom Sesuai Format)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: PROFIL INSTANSI & WILAYAH (Semua Manual Sesuai Permintaan User #1, #2, #3) */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleSimpanWilayah}
            className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    PROFIL INSTANSI & WILAYAH
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Semua isian diisi secara manual
                  </span>
                </div>
              </div>
            </div>

            {/* Nama Instansi / Pemerintah Daerah (Manual) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Instansi / Pemerintah Daerah *
              </label>
              <input
                type="text"
                required
                value={namaInstansi}
                onChange={(e) => setNamaInstansi(e.target.value)}
                placeholder="Contoh: Pemerintah Kabupaten Mukomuko"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-teal-600 font-semibold"
              />
            </div>

            {/* Kabupaten / Kota (Manual) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kabupaten / Kota *
              </label>
              <input
                type="text"
                required
                value={kabKota}
                onChange={(e) => setKabKota(e.target.value)}
                placeholder="Contoh: Kab. Mukomuko"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-teal-600 font-medium"
              />
            </div>

            {/* Provinsi (Manual) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Provinsi *
              </label>
              <input
                type="text"
                required
                value={provinsi}
                onChange={(e) => setProvinsi(e.target.value)}
                placeholder="Contoh: Bengkulu"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:border-teal-600 font-medium"
              />
            </div>

            {/* Kode Wilayah (Manual) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kode Wilayah BKN *
              </label>
              <input
                type="text"
                required
                value={kdWil}
                onChange={(e) => setKdWil(e.target.value)}
                placeholder="Contoh: 17.06"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono outline-none focus:border-teal-600 font-bold"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Profil Instansi</span>
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: IMPOR DATA PEGAWAI (TEMPLATE 5 KOLOM SESUAI IMAGE.PNG & REPLACE LANGSUNG) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    IMPOR DATA PEGAWAI (GOOGLE SHEETS / EXCEL)
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Format 5 Kolom: NIP | NAMA | PANGKAT | JABATAN | UNIT_KERJA
                  </span>
                </div>
              </div>

              {/* Mode Selector (Tanpa Salin Tempel Sesuai Permintaan #4) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setImportMode('file')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    importMode === 'file'
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload File CSV
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('link')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    importMode === 'link'
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Link Google Sheet
                </button>
              </div>
            </div>

            {/* Visualisasi Template 5 Kolom Sesuai Persis dengan image.png */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">
                Format Tabel Sesuai Tangkapan Layar Anda (image.png):
              </span>
              <div className="border border-teal-300 rounded-xl overflow-hidden bg-teal-50/40 text-xs">
                <div className="grid grid-cols-5 text-center font-bold bg-teal-100/80 text-teal-950 py-2 divide-x divide-teal-300">
                  <div>NIP</div>
                  <div>NAMA</div>
                  <div>PANGKAT</div>
                  <div>JABATAN</div>
                  <div>UNIT_KERJA</div>
                </div>
                <div className="grid grid-cols-5 text-center text-slate-600 py-2 divide-x divide-teal-200 text-[11px] bg-white font-mono">
                  <div className="truncate px-1">19850614...</div>
                  <div className="truncate px-1">Nama PNS</div>
                  <div className="truncate px-1">III/c</div>
                  <div className="truncate px-1">Jabatan...</div>
                  <div className="truncate px-1">Unit Kerja...</div>
                </div>
              </div>
              <p className="text-[11px] text-teal-800">
                * Tanggal lahir, jenis kelamin, usia, dan TMT CPNS langsung dihitung otomatis oleh sistem dari NIP 18 digit!
              </p>
            </div>

            {/* Mode 1: Upload File CSV */}
            {importMode === 'file' && (
              <div className="space-y-3 pt-2">
                <div className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-teal-50/20 transition-all">
                  <Upload className="w-8 h-8 text-teal-700 mx-auto mb-2" />
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Pilih File CSV dari Komputer Anda
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Unduh Google Sheet Anda sebagai CSV (File &gt; Download &gt; Comma Separated Values .csv)
                  </p>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="inline-block text-xs text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-800 file:text-white hover:file:bg-teal-900 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Mode 2: Link Google Sheet Publik */}
            {importMode === 'link' && (
              <div className="space-y-3 text-xs pt-2">
                <p className="text-slate-600">
                  Masukkan link Google Sheet Anda (pastikan izin berbagi disetel ke <em>"Siapa saja yang memiliki link dapat melihat"</em>):
                </p>
                <div className="relative">
                  <input
                    type="url"
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit?usp=sharing"
                    className="w-full pl-3 pr-28 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:border-teal-600 outline-none"
                  />
                  <button
                    type="button"
                    disabled={isLoadingUrl}
                    onClick={handleFetchGoogleSheetLink}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingUrl ? 'Memuat...' : 'Tarik Data'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Master Pegawai yang Langsung Tampil & Auto-Replaced (Sesuai Permintaan User #7) */}
      <div className="bg-white border border-teal-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-800" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                DATA PEGAWAI HASIL IMPOR ({pegawaiList.length} ASN)
              </h2>
              <p className="text-xs text-slate-500">
                Data langsung tampil di bawah ini. Ketika mengimpor data baru, seluruh data lama akan otomatis tergantikan (*auto-replaced*).
              </p>
            </div>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchPegawai}
              onChange={(e) => setSearchPegawai(e.target.value)}
              placeholder="Cari NIP, Nama, atau Unit..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-600"
            />
          </div>
        </div>

        {/* Tabel Master Data */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2.5 text-left w-10">No</th>
                  <th className="px-3 py-2.5 text-left">NIP (18 Digit)</th>
                  <th className="px-3 py-2.5 text-left">Nama Pegawai</th>
                  <th className="px-3 py-2.5 text-left">Pangkat</th>
                  <th className="px-3 py-2.5 text-left">Jabatan</th>
                  <th className="px-3 py-2.5 text-left">Unit Kerja</th>
                  <th className="px-3 py-2.5 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredPegawaiList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                      Belum ada data pegawai. Silakan impor file CSV atau Google Sheet di atas.
                    </td>
                  </tr>
                ) : (
                  filteredPegawaiList.map((p, idx) => (
                    <tr key={p.nip} className="hover:bg-teal-50/40 transition-colors">
                      <td className="px-3 py-2 text-slate-400 font-mono tabular-nums">{idx + 1}</td>
                      <td className="px-3 py-2 font-mono font-semibold text-slate-900">{formatNIP(p.nip)}</td>
                      <td className="px-3 py-2 font-bold text-slate-800">{p.nama}</td>
                      <td className="px-3 py-2 font-semibold text-teal-800">{p.kdPangkat}</td>
                      <td className="px-3 py-2 text-slate-600 truncate max-w-xs">{p.jabatan}</td>
                      <td className="px-3 py-2 text-slate-600 truncate max-w-xs">{p.unitKerja}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectPegawaiForProposal(p.nip)}
                            className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-bold text-[11px] border border-teal-200 transition-colors cursor-pointer whitespace-nowrap"
                            title="Buat usulan Satyalancana untuk pegawai ini"
                          >
                            Usulkan
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus data ${p.nama}?`)) {
                                onDeletePegawai(p.nip);
                              }
                            }}
                            className="p-1 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>
    </div>
  );
};

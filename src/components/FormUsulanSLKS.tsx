import React, { useState, useEffect } from 'react';
import { Pegawai, UsulanSLKS, TingkatSLKS, StatusKelayakan, PengaturanInstansi } from '../types/slks';
import { DAFTAR_PANGKAT_GOLONGAN, DAFTAR_BULAN } from '../data/pangkatData';
import { parseNIP, hitungMasaKerja, evaluasiKelayakanSLKS, formatNIP } from '../utils/nipParser';
import { sendUsulanToGoogleAppsScript } from '../utils/googleSheetsSync';
import { MedalBadge } from './MedalBadge';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Building,
  MapPin,
  Sparkles,
  Lock,
  CloudUpload,
} from 'lucide-react';

interface FormUsulanSLKSProps {
  pegawaiList: Pegawai[];
  onSaveUsulan: (usulan: UsulanSLKS) => void;
  selectedUsulanForEdit?: UsulanSLKS | null;
  onClearEdit?: () => void;
  onViewPrint?: (usulan: UsulanSLKS) => void;
  pengaturan?: PengaturanInstansi;
  onNavigateToMaster?: () => void;
}

export const FormUsulanSLKS: React.FC<FormUsulanSLKSProps> = ({
  pegawaiList,
  onSaveUsulan,
  selectedUsulanForEdit,
  onClearEdit,
  onViewPrint,
  pengaturan,
  onNavigateToMaster,
}) => {
  // Input Pencarian NIP
  const [searchNip, setSearchNip] = useState('');
  const [filteredPegawai, setFilteredPegawai] = useState<Pegawai[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Form State - Biodata Pegawai
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [kdPangkat, setKdPangkat] = useState('III/a');
  const [jabatan, setJabatan] = useState('');
  const [unitKerja, setUnitKerja] = useState('');
  const [instansi, setInstansi] = useState(pengaturan?.namaInstansi || 'Pemerintah Kabupaten / Kota');
  const [kabKota, setKabKota] = useState(pengaturan?.kabKota || 'Kabupaten / Kota');
  const [provinsi, setProvinsi] = useState(pengaturan?.provinsi || 'Provinsi');
  const [kdWil, setKdWil] = useState(pengaturan?.kdWil || '00.00');

  // Update jika pengaturan instansi berubah
  useEffect(() => {
    if (pengaturan && !selectedUsulanForEdit) {
      setInstansi(pengaturan.namaInstansi);
      setKabKota(pengaturan.kabKota);
      setProvinsi(pengaturan.provinsi);
      setKdWil(pengaturan.kdWil);
      if (pengaturan.bulanPengusulan) setBulanPengusulan(pengaturan.bulanPengusulan);
      if (pengaturan.tahunPengusulan) setTahunPengusulan(pengaturan.tahunPengusulan);
    }
  }, [pengaturan, selectedUsulanForEdit]);

  // Gabungan: Data Kelahiran & TMT CPNS (bersama Masa Kerja)
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [tmtCpns, setTmtCpns] = useState('');

  // Hukdis & CLTN
  const [noSkHukdis, setNoSkHukdis] = useState('');
  const [tmtHukdis, setTmtHukdis] = useState('');
  const [jenisHukdis, setJenisHukdis] = useState('');
  const [noSkCltn, setNoSkCltn] = useState('');
  const [tmtCltn, setTmtCltn] = useState('');
  const [durasiCltnBulan, setDurasiCltnBulan] = useState(0);

  // SLKS Lama (yang sudah diperoleh sebelumnya)
  const [slksLamaTingkat, setSlksLamaTingkat] = useState<TingkatSLKS | ''>('');
  const [slksLamaNoKeppres, setSlksLamaNoKeppres] = useState('');
  const [slksLamaTglKeppres, setSlksLamaTglKeppres] = useState('');

  // SLKS yang diusulkan
  const [slksUsul, setSlksUsul] = useState<TingkatSLKS>('X');
  const [bulanPengusulan, setBulanPengusulan] = useState<number>(pengaturan?.bulanPengusulan || 8);
  const [tahunPengusulan, setTahunPengusulan] = useState<number>(pengaturan?.tahunPengusulan || 2026);

  // Status MS / TMS
  const [statusKelayakan, setStatusKelayakan] = useState<StatusKelayakan>('MS');
  const [keteranganTms, setKeteranganTms] = useState('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data jika sedang mengedit usulan
  useEffect(() => {
    if (selectedUsulanForEdit) {
      const p = selectedUsulanForEdit.pegawai;
      setNip(p.nip);
      setNama(p.nama);
      setKdPangkat(p.kdPangkat || 'III/a');
      setJabatan(p.jabatan || '');
      setUnitKerja(p.unitKerja || '');
      setInstansi(pengaturan?.namaInstansi || p.instansi || 'Pemerintah Daerah');
      setKabKota(pengaturan?.kabKota || p.kabKota || 'Kabupaten');
      setProvinsi(pengaturan?.provinsi || p.provinsi || 'Provinsi');
      setKdWil(pengaturan?.kdWil || p.kdWil || '00.00');
      setJenisKelamin(p.jenisKelamin || 'Laki-laki');
      setTanggalLahir(p.tanggalLahir || '');
      setTmtCpns(p.tmtCpns || '');
      setNoSkHukdis(p.noSkHukdis || '');
      setTmtHukdis(p.tmtHukdis || '');
      setJenisHukdis(p.jenisHukdis || '');
      setNoSkCltn(p.noSkCltn || '');
      setTmtCltn(p.tmtCltn || '');
      setDurasiCltnBulan(p.durasiCltnBulan || 0);

      setSlksLamaTingkat(selectedUsulanForEdit.slksLamaTingkat || '');
      setSlksLamaNoKeppres(selectedUsulanForEdit.slksLamaNoKeppres || '');
      setSlksLamaTglKeppres(selectedUsulanForEdit.slksLamaTglKeppres || '');

      setSlksUsul(selectedUsulanForEdit.slksUsul);
      setBulanPengusulan(selectedUsulanForEdit.bulanPengusulan);
      setTahunPengusulan(selectedUsulanForEdit.tahunPengusulan);
      setStatusKelayakan(selectedUsulanForEdit.statusKelayakan);
      setKeteranganTms(selectedUsulanForEdit.keteranganTms || '');
    }
  }, [selectedUsulanForEdit]);

  // Kalkulasi Masa Kerja
  const mkPns = hitungMasaKerja(tmtCpns, tahunPengusulan, bulanPengusulan, durasiCltnBulan);
  const mkHukdis = noSkHukdis ? { tahun: 1, bulan: 0 } : { tahun: 0, bulan: 0 };

  // Otomatis Evaluasi Kelayakan (MS / TMS) saat data berubah
  useEffect(() => {
    if (!tmtCpns) return;

    const riwayatTingkat = slksLamaTingkat ? [slksLamaTingkat] : [];
    const hasil = evaluasiKelayakanSLKS({
      tingkatUsul: slksUsul,
      masaKerjaTahun: mkPns.tahun,
      masaKerjaBulan: mkPns.bulan,
      noSkHukdis,
      jenisHukdis,
      noSkCltn,
      durasiCltnBulan,
      riwayatTingkatSebelumnya: riwayatTingkat,
    });

    setStatusKelayakan(hasil.status);
    if (hasil.status === 'TMS') {
      setKeteranganTms(hasil.alasan);
    } else {
      setKeteranganTms('');
    }
  }, [
    slksUsul,
    tmtCpns,
    mkPns.tahun,
    mkPns.bulan,
    noSkHukdis,
    jenisHukdis,
    noSkCltn,
    durasiCltnBulan,
    slksLamaTingkat,
  ]);

  // Handle Input NIP (Langsung atau dari auto-complete)
  const handleNipChange = (val: string) => {
    setNip(val);
    setSearchNip(val);

    const parsed = parseNIP(val);
    if (parsed.isValid && parsed.tmtCpns) {
      setTmtCpns(parsed.tmtCpns);
      if (parsed.tanggalLahir) setTanggalLahir(parsed.tanggalLahir);
      if (parsed.jenisKelamin) setJenisKelamin(parsed.jenisKelamin);

      // Cari apakah pegawai sudah ada di database
      const existing = pegawaiList.find((p) => p.nip === parsed.rawNip);
      if (existing) {
        fillPegawaiData(existing);
      }
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchNip(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase();
      const matches = pegawaiList.filter(
        (p) => p.nip.includes(q) || p.nama.toLowerCase().includes(q)
      );
      setFilteredPegawai(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const fillPegawaiData = (p: Pegawai) => {
    setNip(p.nip);
    setSearchNip(p.nip);
    setNama(p.nama);
    setKdPangkat(p.kdPangkat);
    setJabatan(p.jabatan);
    setUnitKerja(p.unitKerja);
    setInstansi(pengaturan?.namaInstansi || 'Pemerintah Daerah');
    setKabKota(pengaturan?.kabKota || 'Kabupaten');
    setProvinsi(pengaturan?.provinsi || 'Provinsi');
    setKdWil(pengaturan?.kdWil || '00.00');
    setJenisKelamin(p.jenisKelamin);
    setTanggalLahir(p.tanggalLahir);
    setTmtCpns(p.tmtCpns);
    setNoSkHukdis(p.noSkHukdis || '');
    setTmtHukdis(p.tmtHukdis || '');
    setJenisHukdis(p.jenisHukdis || '');
    setNoSkCltn(p.noSkCltn || '');
    setTmtCltn(p.tmtCltn || '');
    setDurasiCltnBulan(p.durasiCltnBulan || 0);

    // Set SLKS Lama dari riwayat terakhir
    if (p.riwayatSlks && p.riwayatSlks.length > 0) {
      const last = p.riwayatSlks[p.riwayatSlks.length - 1];
      setSlksLamaTingkat(last.tingkat);
      setSlksLamaNoKeppres(last.noKeppres);
      setSlksLamaTglKeppres(last.tglKeppres);

      if (last.tingkat === 'X') setSlksUsul('XX');
      else if (last.tingkat === 'XX') setSlksUsul('XXX');
    } else {
      setSlksLamaTingkat('');
      setSlksLamaNoKeppres('');
      setSlksLamaTglKeppres('');
      setSlksUsul('X');
    }

    setShowDropdown(false);
  };

  // Reset form ke kondisi awal
  const handleReset = () => {
    setSearchNip('');
    setNip('');
    setNama('');
    setKdPangkat('III/a');
    setJabatan('');
    setUnitKerja('');
    setInstansi(pengaturan?.namaInstansi || 'Pemerintah Daerah');
    setKabKota(pengaturan?.kabKota || 'Kabupaten');
    setProvinsi(pengaturan?.provinsi || 'Provinsi');
    setKdWil(pengaturan?.kdWil || '00.00');
    setTanggalLahir('');
    setTmtCpns('');
    setJenisKelamin('Laki-laki');
    setNoSkHukdis('');
    setTmtHukdis('');
    setJenisHukdis('');
    setNoSkCltn('');
    setTmtCltn('');
    setDurasiCltnBulan(0);
    setSlksLamaTingkat('');
    setSlksLamaNoKeppres('');
    setSlksLamaTglKeppres('');
    setSlksUsul('X');
    setStatusKelayakan('MS');
    setKeteranganTms('');
    if (onClearEdit) onClearEdit();
  };

  // Submit Simpan Usulan
  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nip || nip.length < 18) {
      alert('NIP Pegawai harus 18 digit.');
      return;
    }

    if (!nama.trim()) {
      alert('Nama Pegawai tidak boleh kosong.');
      return;
    }

    const pangkatObj = DAFTAR_PANGKAT_GOLONGAN.find((p) => p.kode === kdPangkat);
    const namaPangkat = pangkatObj ? pangkatObj.nama : 'Penata';

    const riwayatList = slksLamaTingkat
      ? [
          {
            id: `RW-${Date.now()}`,
            tingkat: slksLamaTingkat,
            label:
              slksLamaTingkat === 'X'
                ? '10 Tahun'
                : slksLamaTingkat === 'XX'
                ? '20 Tahun'
                : '30 Tahun',
            noKeppres: slksLamaNoKeppres || '-',
            tglKeppres: slksLamaTglKeppres || '',
          },
        ]
      : [];

    const pegawaiObj: Pegawai = {
      nip: nip.replace(/\D/g, ''),
      nama,
      kdPangkat,
      namaPangkat,
      jabatan,
      unitKerja: unitKerja || 'Unit Kerja Terkait',
      instansi: instansi || 'Pemerintah Daerah',
      kabKota: kabKota || 'Kabupaten / Kota',
      provinsi: provinsi || 'Provinsi',
      kdWil: kdWil || '00.00',
      jenisKelamin,
      tanggalLahir: tanggalLahir || '1985-01-01',
      tmtCpns: tmtCpns || '2010-01-01',
      tmtPns: tmtCpns || '2011-01-01',
      noSkHukdis: noSkHukdis || undefined,
      tmtHukdis: tmtHukdis || undefined,
      jenisHukdis: jenisHukdis || undefined,
      noSkCltn: noSkCltn || undefined,
      tmtCltn: tmtCltn || undefined,
      durasiCltnBulan: Number(durasiCltnBulan) || 0,
      riwayatSlks: riwayatList,
    };

    const usulanObj: UsulanSLKS = {
      id: selectedUsulanForEdit ? selectedUsulanForEdit.id : `USL-${Date.now()}`,
      idPegawai: pegawaiObj.nip,
      pegawai: pegawaiObj,
      mkPnsTahun: mkPns.tahun,
      mkPnsBulan: mkPns.bulan,
      mkHukdisTahun: mkHukdis.tahun,
      mkHukdisBulan: mkHukdis.bulan,
      slksLamaTingkat,
      slksLamaNoKeppres,
      slksLamaTglKeppres,
      slksUsul,
      bulanPengusulan,
      tahunPengusulan,
      statusKelayakan,
      keteranganTms: statusKelayakan === 'TMS' ? keteranganTms : '',
      statusUsulan:
        statusKelayakan === 'MS' ? 'Diusulkan ke BKN' : 'Perlu Perbaikan (TMS)',
      tanggalUsulan: new Date().toISOString().split('T')[0],
      catatanVerifikator:
        statusKelayakan === 'MS'
          ? 'Tervalidasi memenuhi kualifikasi PP 35/2010'
          : `TMS: ${keteranganTms}`,
    };

    onSaveUsulan(usulanObj);

    if (pengaturan?.googleAppsScriptUrl?.trim()) {
      sendUsulanToGoogleAppsScript(usulanObj, pengaturan).then((res) => {
        if (res.success) {
          setToastMessage(
            `Data an. ${usulanObj.pegawai.nama} berhasil disimpan ke sistem & disinkronkan ke Google Sheet (${pengaturan.targetSheetName || usulanObj.pegawai.unitKerja || 'Usulan SLKS'})!`
          );
        } else {
          setToastMessage(
            `Data an. ${usulanObj.pegawai.nama} tersimpan di sistem. Info Sheet: ${res.message}`
          );
        }
      });
    } else {
      setToastMessage(`Data usulan SLKS an. ${usulanObj.pegawai.nama} berhasil disimpan ke sistem!`);
    }
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 space-y-2.5 sm:space-y-3">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-900 to-emerald-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-teal-500/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sleek Compact Header (Tulisan Panjang Dihapus Sesuai Permintaan User #4) */}
      <div className="rounded-xl bg-gradient-to-r from-teal-800 via-teal-900 to-emerald-950 text-white px-4 py-2.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xs sm:text-sm font-extrabold tracking-tight uppercase text-white">
            INPUT DATA USUL SATYALANCANA KARYA SATYA
          </h1>
          <span className="text-teal-300/60 hidden sm:inline">·</span>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-700/60 border border-teal-500/40 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-teal-200">
            {kabKota || instansi}, Prov. {provinsi} (Kode: {kdWil})
          </span>
          {onNavigateToMaster && (
            <button
              type="button"
              onClick={onNavigateToMaster}
              className="text-[10px] text-amber-300 hover:text-amber-200 underline font-semibold ml-0.5 cursor-pointer"
            >
              (Ubah Wilayah)
            </button>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] sm:text-[11px] font-semibold text-teal-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Validasi PP No. 35/2010</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Form Grid (Rapi & Kompak: 1 Halaman Desktop Tampa Scroll Sesuai User #1) */}
      <form onSubmit={handleSimpan} className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
        {/* Kolom Kiri (Lg: 7 col): PENCARIAN NIP, BIODATA PEGAWAI & AUDIT INTEGRITAS */}
        <div className="lg:col-span-7 space-y-2.5">

          {/* Card: CARI / MUAT NIP PEGAWAI (TEPAT DI ATAS BIODATA SESUAI PERMINTAAN USER #5) */}
          <div className="bg-gradient-to-r from-teal-900 via-teal-850 to-emerald-900 text-white rounded-xl p-2.5 sm:p-3 shadow-xs border border-teal-700/50 relative">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 font-bold">
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchNip}
                  onChange={handleSearchInputChange}
                  placeholder="Ketik 18 digit NIP atau nama pegawai untuk memuat data otomatis..."
                  className="w-full pl-3 pr-8 py-1.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg text-xs sm:text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
                />
                {searchNip && (
                  <button
                    type="button"
                    onClick={() => setSearchNip('')}
                    className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleNipChange(searchNip)}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg text-xs font-extrabold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              >
                Muat Data
              </button>
            </div>

            {/* Dropdown Hasil Pencarian Auto-complete */}
            {showDropdown && filteredPegawai.length > 0 && (
              <div className="absolute z-40 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-slate-100 text-slate-800">
                {filteredPegawai.map((p) => (
                  <button
                    key={p.nip}
                    type="button"
                    onClick={() => fillPegawaiData(p)}
                    className="w-full px-3 py-2 text-left hover:bg-teal-50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.nama}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.nip} · {p.kdPangkat} · {p.jabatan}
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-bold border border-teal-200 shrink-0">
                      Pilih & Muat
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Card: BIODATA PEGAWAI */}
          <div className="bg-white border border-teal-100/80 rounded-xl p-3 sm:p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  BIODATA PEGAWAI
                </h2>
              </div>

              {nip && (
                <span className="text-[11px] font-mono text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-semibold">
                  NIP: {nip}
                </span>
              )}
            </div>

            {/* NIP & Pangkat (Ukuran Lebih Nyaman) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP (Nomor Induk Pegawai) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={18}
                  value={nip}
                  onChange={(e) => handleNipChange(e.target.value)}
                  placeholder="18 digit NIP BKN"
                  className="w-full px-3 py-2 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-lg text-sm font-mono tracking-wider outline-none bg-slate-50 focus:bg-white transition-all text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pangkat & Golongan Ruang *
                </label>
                <select
                  value={kdPangkat}
                  onChange={(e) => setKdPangkat(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-lg text-sm outline-none bg-white font-medium text-slate-800 transition-all cursor-pointer shadow-2xs"
                >
                  {DAFTAR_PANGKAT_GOLONGAN.map((item) => (
                    <option key={item.kode} value={item.kode}>
                      {item.kode} - {item.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nama Pegawai */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Pegawai (Lengkap dengan Gelar) *
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap pegawai beserta gelar"
                className="w-full px-3 py-2 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-lg text-sm outline-none font-semibold text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Jabatan (Baris Penuh, Agak Besar & Jelas) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan *
              </label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Contoh: Kepala Sub Bagian Umum dan Kepegawaian"
                className="w-full px-3 py-2 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-lg text-sm outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Unit Kerja (DI BAWAH JABATAN SESUAI PERMINTAAN USER #1 & AGAK BESAR) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unit Kerja *
              </label>
              <input
                type="text"
                required
                value={unitKerja}
                onChange={(e) => setUnitKerja(e.target.value)}
                placeholder="Contoh: Badan Kepegawaian dan Pengembangan Sumber Daya Manusia"
                className="w-full px-3 py-2 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 rounded-lg text-sm outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Wilayah Administrasi (Kabupaten, Provinsi, Kode Wilayah TERKUNCI Sesuai Permintaan User #3) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-700">Wilayah Administrasi:</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                  <Lock className="w-2.5 h-2.5 text-amber-600" /> Terkunci (Data Master)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Kabupaten</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={kabKota}
                    className="w-full px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Provinsi</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={provinsi}
                    className="w-full px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Kode Wilayah</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={kdWil}
                    className="w-full px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Audit Integritas: No. SK Hukdis & No. SK CLTN */}
            <div className="pt-1.5 border-t border-slate-100">
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-lg p-2.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Keterangan Disiplin & CLTN (PP 35/2010):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                  <div className="sm:col-span-7">
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">No. SK Hukdis:</label>
                    <input
                      type="text"
                      value={noSkHukdis}
                      onChange={(e) => setNoSkHukdis(e.target.value)}
                      placeholder="Kosongkan jika tidak ada"
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">TMT Hukdis:</label>
                    <input
                      type="date"
                      value={tmtHukdis}
                      onChange={(e) => setTmtHukdis(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs pt-1.5 border-t border-amber-200/60">
                  <div className="sm:col-span-7">
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">No. SK CLTN:</label>
                    <input
                      type="text"
                      value={noSkCltn}
                      onChange={(e) => setNoSkCltn(e.target.value)}
                      placeholder="Kosongkan jika tidak ada"
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">TMT CLTN:</label>
                    <input
                      type="date"
                      value={tmtCltn}
                      onChange={(e) => setTmtCltn(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (Lg: 5 col): PERHITUNGAN MASA KERJA (TERKUNCI), SLKS LAMA, USULAN & SIMPAN */}
        <div className="lg:col-span-5 space-y-2.5">
          {/* Card: TMT CPNS, TANGGAL LAHIR, JENIS KELAMIN & PERHITUNGAN MASA KERJA (TERKUNCI) */}
          <div className="bg-gradient-to-br from-white to-teal-50/50 border border-teal-200 rounded-xl p-3 sm:p-3.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-teal-100 pb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-teal-800 text-teal-100 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  TMT CPNS & MASA KERJA
                </h2>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                <Lock className="w-2.5 h-2.5 text-amber-600" />
                Terkunci (Otomatis dari NIP)
              </span>
            </div>

            {/* Input Tanggal Lahir & Jenis Kelamin (TIDAK PERLU DROPDOWN SESUAI PERMINTAAN USER #2) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Tanggal Lahir</label>
                <input
                  type="date"
                  readOnly
                  disabled
                  value={tanggalLahir}
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs font-mono bg-slate-100 text-slate-700 cursor-not-allowed outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Jenis Kelamin</label>
                <div className="w-full px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>{jenisKelamin || 'Laki-laki'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Dari NIP</span>
                </div>
              </div>
            </div>

            {/* Input TMT CPNS (Terkunci / Readonly) */}
            <div className="text-xs">
              <label className="block text-[11px] font-bold text-teal-900 mb-0.5 flex items-center justify-between">
                <span>TMT CPNS (Pengangkatan Awal)</span>
                <span className="text-[10px] text-teal-700 font-medium">Masa kerja dihitung sejak TMT ini</span>
              </label>
              <input
                type="date"
                readOnly
                disabled
                value={tmtCpns}
                className="w-full px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-teal-950 cursor-not-allowed outline-none"
              />
            </div>

            {/* Kotak Hasil Perhitungan Masa Kerja Otomatis */}
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2 bg-gradient-to-br from-teal-700 to-emerald-800 text-white rounded-lg shadow-xs">
                <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider block">
                  mkpns (Masa Kerja PNS)
                </span>
                <div className="text-base sm:text-lg font-extrabold font-mono mt-0.5 tabular-nums drop-shadow-xs">
                  {mkPns.tahun} Thn {mkPns.bulan} Bln
                </div>
                <span className="text-[10px] text-teal-100 font-medium">
                  Total: {mkPns.totalBulan} Bulan
                </span>
              </div>

              <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  mkhukdis (Potongan Masa)
                </span>
                <div className="text-base sm:text-lg font-bold font-mono text-slate-800 mt-0.5 tabular-nums">
                  {mkHukdis.tahun} Thn {mkHukdis.bulan} Bln
                </div>
                <span className="text-[10px] text-slate-500">
                  {noSkHukdis ? 'SK Hukdis' : 'Nihil (0 Bulan)'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: SLKS YANG SUDAH DIPEROLEH (Terakhir) */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                SLKS YANG SUDAH DIPEROLEH:
              </h2>
              <span className="text-[10px] text-slate-500">Sebelumnya</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <div className="sm:col-span-4">
                <label className="block text-[10px] text-slate-600 font-medium mb-0.5">Slks Lama:</label>
                <select
                  value={slksLamaTingkat}
                  onChange={(e) => setSlksLamaTingkat(e.target.value as any)}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs outline-none focus:bg-white"
                >
                  <option value="">Belum Ada</option>
                  <option value="X">10 Tahun (X)</option>
                  <option value="XX">20 Tahun (XX)</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[10px] text-slate-600 font-medium mb-0.5">No. Keppres:</label>
                <input
                  type="text"
                  value={slksLamaNoKeppres}
                  onChange={(e) => setSlksLamaNoKeppres(e.target.value)}
                  placeholder="Contoh: No. 42/TK/2015"
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono outline-none focus:bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] text-slate-600 font-medium mb-0.5">Tgl Keppres:</label>
                <input
                  type="date"
                  value={slksLamaTglKeppres}
                  onChange={(e) => setSlksLamaTglKeppres(e.target.value)}
                  className="w-full px-1.5 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card: SLKS YANG DIUSULKAN & KETERANGAN KELAYAKAN */}
          <div className="bg-white border border-teal-200/80 rounded-xl p-3 sm:p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-950">
                SLKS YANG DIUSULKAN:
              </h2>
              <MedalBadge tingkat={slksUsul} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">SLKS Usulan *</label>
                <select
                  value={slksUsul}
                  onChange={(e) => setSlksUsul(e.target.value as TingkatSLKS)}
                  className="w-full px-2 py-1.5 border-2 border-teal-600 rounded-lg font-bold bg-teal-50/50 text-teal-950 text-xs outline-none"
                >
                  <option value="X">10 Thn (X)</option>
                  <option value="XX">20 Thn (XX)</option>
                  <option value="XXX">30 Thn (XXX)</option>
                </select>
              </div>

              {/* Bulan Pengusulan (Terkunci dari Data Master) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Bulan Pengusulan</label>
                <div className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    {DAFTAR_BULAN.find((b) => b.value === bulanPengusulan)?.label || 'Agustus'}
                  </span>
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>

              {/* Tahun Pengusulan (Terkunci dari Data Master) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Tahun Pengusulan</label>
                <div className="w-full px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                  <span className="font-bold font-mono text-slate-800">
                    {tahunPengusulan}
                  </span>
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* NOTIFIKASI KETERANGAN STATUS KELAYAKAN (BERSIH & KOMPAK) */}
            {statusKelayakan === 'MS' ? (
              <div className="p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-300 text-emerald-950 shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Keterangan: Memenuhi Syarat (MS) - Masa Kerja {mkPns.tahun} Thn {mkPns.bulan} Bln
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-rose-50/90 border border-rose-300 text-rose-950 shadow-2xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Keterangan: Belum Memenuhi Syarat (TMS) - {keteranganTms || 'Masa kerja belum mencapai syarat.'}
                  </div>
                </div>
              </div>
            )}

            {/* Tombol SIMPAN & Reset */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="submit"
                className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>SIMPAN USULAN</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

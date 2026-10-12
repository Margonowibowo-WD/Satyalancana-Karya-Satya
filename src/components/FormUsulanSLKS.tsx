import React, { useState, useEffect } from 'react';
import { Pegawai, UsulanSLKS, TingkatSLKS, StatusKelayakan, PengaturanInstansi } from '../types/slks';
import { DAFTAR_PANGKAT_GOLONGAN, DAFTAR_BULAN } from '../data/pangkatData';
import { parseNIP, hitungMasaKerja, evaluasiKelayakanSLKS, formatNIP } from '../utils/nipParser';
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
  const [bulanPengusulan, setBulanPengusulan] = useState<number>(new Date().getMonth() + 1);
  const [tahunPengusulan, setTahunPengusulan] = useState<number>(new Date().getFullYear());

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
      setInstansi(p.instansi || 'Pemerintah Kabupaten Mukomuko');
      setKabKota(p.kabKota || 'Kab. Mukomuko');
      setProvinsi(p.provinsi || 'Bengkulu');
      setKdWil(p.kdWil || '17.06');
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
    setInstansi(p.instansi || 'Pemerintah Kabupaten Mukomuko');
    setKabKota(p.kabKota || 'Kab. Mukomuko');
    setProvinsi(p.provinsi || 'Bengkulu');
    setKdWil(p.kdWil || '17.06');
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
    setInstansi('Pemerintah Kabupaten Mukomuko');
    setKabKota('Kab. Mukomuko');
    setProvinsi('Bengkulu');
    setKdWil('17.06');
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
      unitKerja: unitKerja || 'BKPSDM Kabupaten Mukomuko',
      instansi: instansi || 'Pemerintah Kabupaten Mukomuko',
      kabKota: kabKota || 'Kab. Mukomuko',
      provinsi: provinsi || 'Bengkulu',
      kdWil: kdWil || '17.06',
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
    setToastMessage(`Data usulan SLKS an. ${usulanObj.pegawai.nama} berhasil disimpan ke sistem!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-900 to-emerald-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-teal-500/40 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Fresh Hero Header with Dynamic Nationwide Regional Identity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-800 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 shadow-md">
        {/* Subtle Decorative Elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-700/60 border border-teal-500/40 text-[11px] font-bold tracking-wider uppercase text-teal-200">
                {instansi || 'Pemerintah Daerah / Kementerian'}
              </span>
              <span className="text-teal-300/60 text-xs">·</span>
              <span className="text-xs text-teal-200 font-medium">
                {kabKota}, Prov. {provinsi} (Kode: {kdWil})
              </span>
              {onNavigateToMaster && (
                <button
                  type="button"
                  onClick={onNavigateToMaster}
                  className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold ml-1 cursor-pointer"
                >
                  (Ubah Wilayah)
                </button>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              INPUT DATA USUL SATYALANCANA KARYA SATYA
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
              Formulir terpadu pengusulan tanda kehormatan 10, 20, dan 30 Tahun bagi ASN di lingkungan {instansi} dengan penghitungan masa kerja dan validasi kelayakan otomatis.
            </p>
          </div>

          {/* NIP Search in Hero */}
          <div className="w-full md:w-80 shrink-0 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shadow-inner">
            <label className="block text-[11px] font-bold text-teal-100 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span>Cari / Muat NIP Pegawai:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchNip}
                onChange={handleSearchInputChange}
                placeholder="Ketik NIP atau Nama..."
                className="w-full pl-3 pr-20 py-2 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleNipChange(searchNip)}
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer"
              >
                Muat
              </button>
            </div>

            {/* Dropdown Hasil Pencarian */}
            {showDropdown && filteredPegawai.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 text-slate-800">
                {filteredPegawai.map((p) => (
                  <button
                    key={p.nip}
                    type="button"
                    onClick={() => fillPegawaiData(p)}
                    className="w-full px-3.5 py-2 text-left hover:bg-teal-50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.nama}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {p.nip} · {p.kdPangkat}
                      </div>
                    </div>
                    <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-semibold border border-teal-200 shrink-0">
                      Pilih
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Form Grid */}
      <form onSubmit={handleSimpan} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri (Lg: 7 col): BIODATA PEGAWAI & AUDIT INTEGRITAS */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: BIODATA PEGAWAI */}
          <div className="bg-white border border-teal-100/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    BIODATA PEGAWAI:
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    Data Kepegawaian Aparatur Sipil Negara
                  </span>
                </div>
              </div>

              {nip && (
                <span className="text-xs font-mono text-teal-900 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md font-semibold">
                  NIP: {nip}
                </span>
              )}
            </div>

            {/* NIP & Pangkat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="198501012010011001"
                  className="w-full px-3.5 py-2.5 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 rounded-xl text-sm font-mono tracking-wider outline-none bg-slate-50 focus:bg-white transition-all text-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  18 digit NIP BKN (otomatis mengisi tanggal lahir & TMT)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kd Pangkat / Golongan Ruang *
                </label>
                <select
                  value={kdPangkat}
                  onChange={(e) => setKdPangkat(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 rounded-xl text-xs sm:text-sm outline-none bg-white font-medium text-slate-800 transition-all"
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
                placeholder="Contoh: Dr. H. Ahmad Fauzi, M.Si."
                className="w-full px-3.5 py-2.5 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 rounded-xl text-sm outline-none font-semibold text-slate-900 transition-all"
              />
            </div>

            {/* Jabatan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan *
              </label>
              <textarea
                rows={2}
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Contoh: Kepala Subbagian Kepegawaian dan Umum / Guru Ahli Madya / Pranata Komputer Ahli Muda"
                className="w-full px-3.5 py-2 border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 rounded-xl text-sm outline-none resize-none transition-all text-slate-800"
              />
            </div>

            {/* Unit Kerja & Instansi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unit Kerja
                </label>
                <input
                  type="text"
                  value={unitKerja}
                  onChange={(e) => setUnitKerja(e.target.value)}
                  placeholder="Contoh: BKPSDM / Dinas Kesehatan / SMAN 1"
                  className="w-full px-3.5 py-2 border border-slate-300 focus:border-teal-600 rounded-xl text-xs sm:text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instansi
                </label>
                <input
                  type="text"
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  placeholder="Pemerintah Kabupaten Mukomuko"
                  className="w-full px-3.5 py-2 border border-slate-300 focus:border-teal-600 rounded-xl text-xs sm:text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Wilayah Administrasi (Kabkota, Provinsi, Kd Wil) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kabkota:
                </label>
                <input
                  type="text"
                  value={kabKota}
                  onChange={(e) => setKabKota(e.target.value)}
                  placeholder="Kab. Mukomuko"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provinsi:
                </label>
                <input
                  type="text"
                  value={provinsi}
                  onChange={(e) => setProvinsi(e.target.value)}
                  placeholder="Bengkulu"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kd Wil:
                </label>
                <input
                  type="text"
                  value={kdWil}
                  onChange={(e) => setKdWil(e.target.value)}
                  placeholder="17.06"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:border-teal-600"
                />
              </div>
            </div>

            {/* Audit Integritas: No SK Hukdis & No SK CLTN */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Keterangan Disiplin & CLTN (PP 35/2010 Pasal 22):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-5">
                    <label className="block font-semibold text-slate-700 mb-1">No SK Hukdis:</label>
                    <input
                      type="text"
                      value={noSkHukdis}
                      onChange={(e) => setNoSkHukdis(e.target.value)}
                      placeholder="Kosongkan jika nihil"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block font-semibold text-slate-700 mb-1">Tingkat Hukdis:</label>
                    <select
                      value={jenisHukdis}
                      onChange={(e) => setJenisHukdis(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-amber-600"
                    >
                      <option value="">- Tidak Ada -</option>
                      <option value="Ringan">Ringan (Teguran)</option>
                      <option value="Sedang">Sedang (Turun Pangkat)</option>
                      <option value="Berat">Berat (Pembebasan)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Tmt:</label>
                    <input
                      type="date"
                      value={tmtHukdis}
                      onChange={(e) => setTmtHukdis(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                {/* No SK CLTN */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs mt-3 pt-3 border-t border-amber-200/60">
                  <div className="sm:col-span-6">
                    <label className="block font-semibold text-slate-700 mb-1">No SK Cltn:</label>
                    <input
                      type="text"
                      value={noSkCltn}
                      onChange={(e) => setNoSkCltn(e.target.value)}
                      placeholder="Kosongkan jika nihil"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Tmt:</label>
                    <input
                      type="date"
                      value={tmtCltn}
                      onChange={(e) => setTmtCltn(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-700 mb-1">Potongan (Bulan):</label>
                    <input
                      type="number"
                      min={0}
                      value={durasiCltnBulan}
                      onChange={(e) => setDurasiCltnBulan(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (Lg: 5 col): PERHITUNGAN MASA KERJA (TERPADU DENGAN TMT CPNS, LAHIR, JK), SLKS LAMA, USULAN & EVALUASI */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: TMT CPNS, TANGGAL LAHIR, JENIS KELAMIN & PERHITUNGAN MASA KERJA (GABUNGAN SESUAI PERMINTAAN USER #2) */}
          <div className="bg-gradient-to-br from-white to-teal-50/50 border border-teal-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-teal-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-800 text-teal-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    TMT CPNS & PERHITUNGAN MASA KERJA
                  </h2>
                  <span className="text-[10px] text-teal-700 font-medium">
                    Kelahiran, Pengangkatan & Akumulasi Pengabdian
                  </span>
                </div>
              </div>
            </div>

            {/* Input Tanggal Lahir & Jenis Kelamin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:border-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:border-teal-600 outline-none"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Input TMT CPNS */}
            <div className="text-xs">
              <label className="block font-bold text-teal-900 mb-1 flex items-center justify-between">
                <span>TMT CPNS (Pengangkatan Awal) *</span>
                <span className="text-[10px] text-teal-700 font-normal">Masa kerja dihitung sejak TMT ini</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={tmtCpns}
                  onChange={(e) => setTmtCpns(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-teal-400 focus:ring-2 focus:ring-teal-600/20 rounded-xl text-xs sm:text-sm font-mono font-bold text-teal-950 outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Kotak Hasil Perhitungan Masa Kerja Otomatis */}
            <div className="grid grid-cols-2 gap-3 text-center pt-2">
              <div className="p-3 bg-gradient-to-br from-teal-700 to-emerald-800 text-white rounded-xl shadow-xs">
                <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider block">
                  mkpns (Masa Kerja PNS)
                </span>
                <div className="text-xl font-extrabold font-mono mt-0.5 tabular-nums drop-shadow-xs">
                  {mkPns.tahun} Thn {mkPns.bulan} Bln
                </div>
                <span className="text-[10px] text-teal-100 font-medium">
                  Total: {mkPns.totalBulan} Bulan Pengabdian
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  mkhukdis (Potongan Masa)
                </span>
                <div className="text-xl font-bold font-mono text-slate-800 mt-0.5 tabular-nums">
                  {mkHukdis.tahun} Thn {mkHukdis.bulan} Bln
                </div>
                <span className="text-[10px] text-slate-500">
                  {noSkHukdis ? 'SK Hukdis Terdaftar' : 'Nihil (0 Bulan)'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: SLKS YANG SUDAH DIPEROLEH (Terakhir) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                SLKS YANG SUDAH DIPEROLEH:
              </h2>
              <span className="text-[11px] text-slate-500">Tanda Kehormatan Sebelumnya</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <div className="sm:col-span-4">
                <label className="block text-slate-600 font-medium mb-1">Slks Lama:</label>
                <select
                  value={slksLamaTingkat}
                  onChange={(e) => setSlksLamaTingkat(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:bg-white"
                >
                  <option value="">Belum Ada</option>
                  <option value="X">10 Tahun (X)</option>
                  <option value="XX">20 Tahun (XX)</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-slate-600 font-medium mb-1">No Keppres:</label>
                <input
                  type="text"
                  value={slksLamaNoKeppres}
                  onChange={(e) => setSlksLamaNoKeppres(e.target.value)}
                  placeholder="Contoh: 42/TK/2015"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-medium mb-1">Tgl Keppres:</label>
                <input
                  type="date"
                  value={slksLamaTglKeppres}
                  onChange={(e) => setSlksLamaTglKeppres(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card: SLKS YANG DIUSULKAN & EVALUASI MS / TMS */}
          <div className="bg-white border border-teal-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-950">
                SLKS YANG DIUSULKAN:
              </h2>
              <MedalBadge tingkat={slksUsul} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Slks Usul *</label>
                <select
                  value={slksUsul}
                  onChange={(e) => setSlksUsul(e.target.value as TingkatSLKS)}
                  className="w-full px-2.5 py-2 border-2 border-teal-600 rounded-xl font-bold bg-teal-50/50 text-teal-950 text-xs outline-none"
                >
                  <option value="X">10 Tahun (X - Perunggu)</option>
                  <option value="XX">20 Tahun (XX - Perak)</option>
                  <option value="XXX">30 Tahun (XXX - Emas)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bulanp:</label>
                <select
                  value={bulanPengusulan}
                  onChange={(e) => setBulanPengusulan(Number(e.target.value))}
                  className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs bg-white outline-none"
                >
                  {DAFTAR_BULAN.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahunp:</label>
                <input
                  type="number"
                  min={2020}
                  max={2035}
                  value={tahunPengusulan}
                  onChange={(e) => setTahunPengusulan(Number(e.target.value))}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold outline-none"
                />
              </div>
            </div>

            {/* Status Ms Tms Card */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                statusKelayakan === 'MS'
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {statusKelayakan === 'MS' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ms Tms: MS (Memenuhi Syarat)
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Ms Tms: TMS (Tidak Memenuhi Syarat)
                    </>
                  )}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    statusKelayakan === 'MS'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-rose-700 text-white'
                  }`}
                >
                  {statusKelayakan}
                </span>
              </div>

              <div className="text-xs">
                <label className="block font-semibold mb-1 text-slate-700">
                  Ket Tms:
                </label>
                <textarea
                  rows={2}
                  value={keteranganTms}
                  onChange={(e) => setKeteranganTms(e.target.value)}
                  placeholder={
                    statusKelayakan === 'MS'
                      ? 'Masa kerja mencukupi & bebas catatan hukuman disiplin.'
                      : 'Keterangan alasan tidak memenuhi syarat...'
                  }
                  className={`w-full p-2.5 rounded-lg text-xs border outline-none resize-none bg-white font-sans ${
                    statusKelayakan === 'MS'
                      ? 'border-emerald-200 text-slate-800'
                      : 'border-rose-300 text-rose-900'
                  }`}
                />
              </div>
            </div>

            {/* Tombol SIMPAN & Reset */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3.5 px-4 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>SIMPAN</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Batal / Reset</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

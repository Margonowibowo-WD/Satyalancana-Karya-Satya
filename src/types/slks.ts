export type TingkatSLKS = 'X' | 'XX' | 'XXX'; // 10 Tahun (X/Perunggu), 20 Tahun (XX/Perak), 30 Tahun (XXX/Emas)

export type StatusKelayakan = 'MS' | 'TMS'; // Memenuhi Syarat | Tidak Memenuhi Syarat

export type StatusUsulan = 'Draf' | 'Diusulkan ke BKN' | 'Diverifikasi BKN' | 'Disetujui Setmilpres' | 'Keppres Terbit' | 'Perlu Perbaikan (TMS)';

export interface RiwayatSLKS {
  id: string;
  tingkat: TingkatSLKS; // 'X' | 'XX' | 'XXX'
  label: string; // '10 Tahun' | '20 Tahun' | '30 Tahun'
  noKeppres: string;
  tglKeppres: string; // YYYY-MM-DD
}

export interface Pegawai {
  nip: string; // 18 digit
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  kdPangkat: string; // e.g. "IV/a", "III/c"
  namaPangkat: string; // e.g. "Pembina", "Penata"
  jabatan: string;
  unitKerja: string;
  instansi: string;
  kabKota: string;
  provinsi: string;
  kdWil: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tanggalLahir: string;
  tmtCpns: string; // YYYY-MM-DD
  tmtPns?: string; // YYYY-MM-DD
  
  // Data Hukuman Disiplin & Cuti
  noSkHukdis?: string;
  tmtHukdis?: string;
  jenisHukdis?: string; // 'Ringan' | 'Sedang' | 'Berat'
  noSkCltn?: string; // Cuti di Luar Tanggungan Negara
  tmtCltn?: string;
  durasiCltnBulan?: number;

  // Riwayat SLKS yang pernah didapat
  riwayatSlks?: RiwayatSLKS[];
}

export interface UsulanSLKS {
  id: string;
  idPegawai: string;
  pegawai: Pegawai;
  
  // Perhitungan Masa Kerja pada saat pengusulan
  mkPnsTahun: number;
  mkPnsBulan: number;
  mkHukdisTahun: number;
  mkHukdisBulan: number;
  
  // SLKS Lama (yang sudah diperoleh)
  slksLamaTingkat?: TingkatSLKS | '';
  slksLamaNoKeppres?: string;
  slksLamaTglKeppres?: string;

  // SLKS yang diusulkan
  slksUsul: TingkatSLKS;
  bulanPengusulan: number; // 1 - 12
  tahunPengusulan: number;
  
  // Evaluasi Kelayakan
  statusKelayakan: StatusKelayakan;
  keteranganTms?: string;
  
  // Status workflow usulan
  statusUsulan: StatusUsulan;
  tanggalUsulan: string;
  catatanVerifikator?: string;
  noKeppres?: string;
  tglKeppres?: string;
}

export interface PangkatGolongan {
  kode: string;
  golongan: string;
  nama: string;
  jenjang: 'Juru' | 'Pengatur' | 'Penata' | 'Pembina';
}

export interface PengaturanInstansi {
  namaInstansi: string; // contoh: Pemerintah Kabupaten Mukomuko / Pemerintah Provinsi Jawa Barat / Kementerian Agama RI
  kabKota: string;      // contoh: Kab. Mukomuko / Kota Bandung / Jakarta Pusat
  provinsi: string;     // contoh: Bengkulu / Jawa Barat / DKI Jakarta
  kdWil: string;        // contoh: 17.06
  googleSheetUrl?: string; // Optional URL Google Sheet terhubung
  bulanPengusulan?: number; // 1 - 12 (default pengusulan)
  tahunPengusulan?: number; // e.g. 2026
}


import { TingkatSLKS, StatusKelayakan } from '../types/slks';

export interface ParsedNIP {
  isValid: boolean;
  rawNip: string;
  formattedNip: string;
  tanggalLahir?: string; // YYYY-MM-DD
  tmtCpns?: string; // YYYY-MM-DD
  jenisKelamin?: 'Laki-laki' | 'Perempuan';
  nomorUrut?: string;
  usia?: number;
  error?: string;
}

export function cleanNIP(nip: string): string {
  return nip.replace(/\D/g, '');
}

export function formatNIP(nip: string): string {
  const cleaned = cleanNIP(nip);
  if (cleaned.length !== 18) return nip;
  return `${cleaned.slice(0, 8)} ${cleaned.slice(8, 14)} ${cleaned.slice(14, 15)} ${cleaned.slice(15, 18)}`;
}

export function parseNIP(nipInput: string): ParsedNIP {
  const cleaned = cleanNIP(nipInput);
  if (cleaned.length !== 18) {
    return {
      isValid: false,
      rawNip: cleaned,
      formattedNip: nipInput,
      error: `Panjang NIP harus tepat 18 digit (saat ini ${cleaned.length} digit)`,
    };
  }

  const thnLahir = parseInt(cleaned.slice(0, 4), 10);
  const blnLahir = parseInt(cleaned.slice(4, 6), 10);
  const tglLahir = parseInt(cleaned.slice(6, 8), 10);

  const thnCpns = parseInt(cleaned.slice(8, 12), 10);
  const blnCpns = parseInt(cleaned.slice(12, 14), 10);

  const kodeJk = cleaned.slice(14, 15);
  const nomorUrut = cleaned.slice(15, 18);

  const currentYear = new Date().getFullYear();
  if (thnLahir < 1940 || thnLahir > currentYear - 17) {
    return {
      isValid: false,
      rawNip: cleaned,
      formattedNip: formatNIP(cleaned),
      error: 'Tahun lahir pada NIP tidak valid',
    };
  }

  if (blnLahir < 1 || blnLahir > 12 || tglLahir < 1 || tglLahir > 31) {
    return {
      isValid: false,
      rawNip: cleaned,
      formattedNip: formatNIP(cleaned),
      error: 'Format tanggal lahir pada NIP tidak valid',
    };
  }

  if (thnCpns < thnLahir + 17 || thnCpns > currentYear) {
    return {
      isValid: false,
      rawNip: cleaned,
      formattedNip: formatNIP(cleaned),
      error: 'Tahun TMT CPNS tidak logis dibanding tahun lahir',
    };
  }

  const tglLahirStr = `${thnLahir}-${String(blnLahir).padStart(2, '0')}-${String(tglLahir).padStart(2, '0')}`;
  const tmtCpnsStr = `${thnCpns}-${String(blnCpns).padStart(2, '0')}-01`;
  const jenisKelamin = kodeJk === '1' ? 'Laki-laki' : kodeJk === '2' ? 'Perempuan' : 'Laki-laki';

  const usia = currentYear - thnLahir;

  return {
    isValid: true,
    rawNip: cleaned,
    formattedNip: formatNIP(cleaned),
    tanggalLahir: tglLahirStr,
    tmtCpns: tmtCpnsStr,
    jenisKelamin,
    nomorUrut,
    usia,
  };
}

/**
 * Menghitung masa kerja PNS dari TMT CPNS hingga periode cut-off (bulan/tahun pengusulan)
 */
export function hitungMasaKerja(
  tmtCpnsStr: string,
  targetTahun: number = new Date().getFullYear(),
  targetBulan: number = new Date().getMonth() + 1,
  potonganBulan: number = 0
): { tahun: number; bulan: number; totalBulan: number } {
  if (!tmtCpnsStr) return { tahun: 0, bulan: 0, totalBulan: 0 };

  const [tmtThn, tmtBln] = tmtCpnsStr.split('-').map(Number);
  if (!tmtThn || !tmtBln) return { tahun: 0, bulan: 0, totalBulan: 0 };

  let totalBulan = (targetTahun - tmtThn) * 12 + (targetBulan - tmtBln);
  totalBulan = Math.max(0, totalBulan - potonganBulan);

  const tahun = Math.floor(totalBulan / 12);
  const bulan = totalBulan % 12;

  return { tahun, bulan, totalBulan };
}

export interface EvaluasiHasil {
  status: StatusKelayakan;
  alasan: string;
  rekomendasiTingkat?: TingkatSLKS;
  syaratTerpenuhi: {
    masaKerjaCukup: boolean;
    bebasHukdis: boolean;
    bebasCltn: boolean;
    kesesuaianJenjang: boolean;
  };
}

/**
 * Menilai kelayakan usulan SLKS sesuai PP No. 35 Tahun 2010 & Petunjuk Teknis BKN
 */
export function evaluasiKelayakanSLKS(params: {
  tingkatUsul: TingkatSLKS;
  masaKerjaTahun: number;
  masaKerjaBulan: number;
  noSkHukdis?: string;
  jenisHukdis?: string;
  noSkCltn?: string;
  durasiCltnBulan?: number;
  riwayatTingkatSebelumnya?: TingkatSLKS[];
}): EvaluasiHasil {
  const {
    tingkatUsul,
    masaKerjaTahun,
    noSkHukdis,
    jenisHukdis,
    noSkCltn,
    durasiCltnBulan,
    riwayatTingkatSebelumnya = [],
  } = params;

  const alasanList: string[] = [];
  let bebasHukdis = true;
  let bebasCltn = true;
  let masaKerjaCukup = true;
  let kesesuaianJenjang = true;

  // Syarat Minimal Masa Kerja
  const syaratTahun = tingkatUsul === 'X' ? 10 : tingkatUsul === 'XX' ? 20 : 30;
  if (masaKerjaTahun < syaratTahun) {
    masaKerjaCukup = false;
    alasanList.push(
      `Masa kerja PNS (${masaKerjaTahun} Tahun) belum memenuhi syarat minimal ${syaratTahun} Tahun untuk SLKS ${tingkatUsul}`
    );
  }

  // Syarat Hukuman Disiplin (PP 35/2010: PNS tidak boleh pernah dijatuhi hukuman disiplin sedang/berat)
  if (noSkHukdis && noSkHukdis.trim() !== '') {
    const isBeratAtauSedang = !jenisHukdis || jenisHukdis === 'Sedang' || jenisHukdis === 'Berat';
    if (isBeratAtauSedang) {
      bebasHukdis = false;
      alasanList.push(
        `Terdaftar memiliki SK Hukuman Disiplin (${noSkHukdis}${jenisHukdis ? ` - Tingkat ${jenisHukdis}` : ''}), melanggar syarat integritas tanda kehormatan.`
      );
    }
  }

  // Syarat CLTN
  if (noSkCltn && noSkCltn.trim() !== '' && (durasiCltnBulan || 0) > 0) {
    // CLTN mengurangi masa kerja
    alasanList.push(`Memiliki riwayat CLTN (SK: ${noSkCltn}). Pastikan masa kerja telah dipotong.`);
  }

  // Syarat Jenjang Riwayat (misal sudah punya SLKS XX, tidak bisa mengusulkan SLKS X lagi)
  if (riwayatTingkatSebelumnya.includes(tingkatUsul)) {
    kesesuaianJenjang = false;
    alasanList.push(`Pegawai sudah pernah memperoleh Tanda Kehormatan SLKS ${tingkatUsul} sebelumnya.`);
  }

  // Rekomendasi otomatis berdasarkan masa kerja
  let rekomendasiTingkat: TingkatSLKS | undefined = undefined;
  if (masaKerjaTahun >= 30 && !riwayatTingkatSebelumnya.includes('XXX')) {
    rekomendasiTingkat = 'XXX';
  } else if (masaKerjaTahun >= 20 && !riwayatTingkatSebelumnya.includes('XX')) {
    rekomendasiTingkat = 'XX';
  } else if (masaKerjaTahun >= 10 && !riwayatTingkatSebelumnya.includes('X')) {
    rekomendasiTingkat = 'X';
  }

  const isMS = masaKerjaCukup && bebasHukdis && kesesuaianJenjang;

  return {
    status: isMS ? 'MS' : 'TMS',
    alasan: isMS
      ? 'Memenuhi seluruh kriteria dan persyaratan PP No. 35 Tahun 2010 (Masa kerja mencukupi, bebas hukuman disiplin, integritas terverifikasi).'
      : alasanList.join(' | '),
    rekomendasiTingkat,
    syaratTerpenuhi: {
      masaKerjaCukup,
      bebasHukdis,
      bebasCltn,
      kesesuaianJenjang,
    },
  };
}

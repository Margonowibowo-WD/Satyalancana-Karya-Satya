import { PangkatGolongan } from '../types/slks';

export const DAFTAR_PANGKAT_GOLONGAN: PangkatGolongan[] = [
  { kode: 'I/a', golongan: 'I/a', nama: 'Juru Muda', jenjang: 'Juru' },
  { kode: 'I/b', golongan: 'I/b', nama: 'Juru Muda Tingkat I', jenjang: 'Juru' },
  { kode: 'I/c', golongan: 'I/c', nama: 'Juru', jenjang: 'Juru' },
  { kode: 'I/d', golongan: 'I/d', nama: 'Juru Tingkat I', jenjang: 'Juru' },
  
  { kode: 'II/a', golongan: 'II/a', nama: 'Pengatur Muda', jenjang: 'Pengatur' },
  { kode: 'II/b', golongan: 'II/b', nama: 'Pengatur Muda Tingkat I', jenjang: 'Pengatur' },
  { kode: 'II/c', golongan: 'II/c', nama: 'Pengatur', jenjang: 'Pengatur' },
  { kode: 'II/d', golongan: 'II/d', nama: 'Pengatur Tingkat I', jenjang: 'Pengatur' },
  
  { kode: 'III/a', golongan: 'III/a', nama: 'Penata Muda', jenjang: 'Penata' },
  { kode: 'III/b', golongan: 'III/b', nama: 'Penata Muda Tingkat I', jenjang: 'Penata' },
  { kode: 'III/c', golongan: 'III/c', nama: 'Penata', jenjang: 'Penata' },
  { kode: 'III/d', golongan: 'III/d', nama: 'Penata Tingkat I', jenjang: 'Penata' },
  
  { kode: 'IV/a', golongan: 'IV/a', nama: 'Pembina', jenjang: 'Pembina' },
  { kode: 'IV/b', golongan: 'IV/b', nama: 'Pembina Tingkat I', jenjang: 'Pembina' },
  { kode: 'IV/c', golongan: 'IV/c', nama: 'Pembina Utama Muda', jenjang: 'Pembina' },
  { kode: 'IV/d', golongan: 'IV/d', nama: 'Pembina Utama Madya', jenjang: 'Pembina' },
  { kode: 'IV/e', golongan: 'IV/e', nama: 'Pembina Utama', jenjang: 'Pembina' },
];

export const DAFTAR_BULAN = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

/**
 * Normalisasi dan resolusi data pangkat agar selalu menghasilkan
 * Nama Pangkat baku (contoh: "Penata Muda", "Pembina", "Penata Tingkat I")
 * serta kode golongannya ("III/a", "IV/a").
 */
export function resolvePangkat(input?: string): { kode: string; nama: string } {
  if (!input) return { kode: 'III/a', nama: 'Penata Muda' };

  const clean = input.trim();
  const lower = clean.toLowerCase();

  // 1. Cek langsung kecocokan persis pada nama pangkat
  const byExactName = DAFTAR_PANGKAT_GOLONGAN.find(
    (p) => p.nama.toLowerCase() === lower
  );
  if (byExactName) return { kode: byExactName.kode, nama: byExactName.nama };

  // 2. Cek kecocokan pada kode golongan (contoh: "IV/a", "iv/a", "iv.a", "4/a")
  const normalizedCode = clean
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/\./g, '/')
    .replace(/^GOL\.?/, '');

  const byCode = DAFTAR_PANGKAT_GOLONGAN.find(
    (p) => p.kode === normalizedCode || p.kode.toLowerCase() === lower
  );
  if (byCode) return { kode: byCode.kode, nama: byCode.nama };

  // 3. Cek variasi penulisan seperti "iiia", "ivb", "iiid"
  const romanMatch = lower.match(/(iv|iii|ii|i)\s*[\/\-\.]?\s*([a-e])/i);
  if (romanMatch) {
    const formattedCode = `${romanMatch[1].toUpperCase()}/${romanMatch[2].toLowerCase()}`;
    const matched = DAFTAR_PANGKAT_GOLONGAN.find((p) => p.kode === formattedCode);
    if (matched) return { kode: matched.kode, nama: matched.nama };
  }

  // 4. Cek partial match nama pangkat (misal "penata tk 1", "pembina tk.i", "pengatur")
  if (lower.includes('pembina utama madya')) return { kode: 'IV/d', nama: 'Pembina Utama Madya' };
  if (lower.includes('pembina utama muda')) return { kode: 'IV/c', nama: 'Pembina Utama Muda' };
  if (lower.includes('pembina utama')) return { kode: 'IV/e', nama: 'Pembina Utama' };
  if (lower.includes('pembina') && (lower.includes('tingkat') || lower.includes('tk')))
    return { kode: 'IV/b', nama: 'Pembina Tingkat I' };
  if (lower.includes('pembina')) return { kode: 'IV/a', nama: 'Pembina' };

  if (lower.includes('penata muda') && (lower.includes('tingkat') || lower.includes('tk')))
    return { kode: 'III/b', nama: 'Penata Muda Tingkat I' };
  if (lower.includes('penata muda')) return { kode: 'III/a', nama: 'Penata Muda' };
  if (lower.includes('penata') && (lower.includes('tingkat') || lower.includes('tk')))
    return { kode: 'III/d', nama: 'Penata Tingkat I' };
  if (lower.includes('penata')) return { kode: 'III/c', nama: 'Penata' };

  if (lower.includes('pengatur muda') && (lower.includes('tingkat') || lower.includes('tk')))
    return { kode: 'II/b', nama: 'Pengatur Muda Tingkat I' };
  if (lower.includes('pengatur muda')) return { kode: 'II/a', nama: 'Pengatur Muda' };
  if (lower.includes('pengatur') && (lower.includes('tingkat') || lower.includes('tk')))
    return { kode: 'II/d', nama: 'Pengatur Tingkat I' };
  if (lower.includes('pengatur')) return { kode: 'II/c', nama: 'Pengatur' };

  if (lower.includes('juru muda') && (lower.includes('tingkat') || lower.includes('tk')))
    return { kode: 'I/b', nama: 'Juru Muda Tingkat I' };
  if (lower.includes('juru muda')) return { kode: 'I/a', nama: 'Juru Muda' };
  if (lower.includes('juru') && (lower.includes('tingkat') || lower.includes('tk')))
    return { kode: 'I/d', nama: 'Juru Tingkat I' };
  if (lower.includes('juru')) return { kode: 'I/c', nama: 'Juru' };

  // Fallback default
  return { kode: clean || 'III/a', nama: clean || 'Penata Muda' };
}

/**
 * Mendapatkan Nama Pangkat (misal "Penata Muda", "Penata", "Pembina Tingkat I")
 * bukan kodenya ("III/a", "III/d") sesuai instruksi pengguna.
 */
export function getPangkatName(kodeOrNama?: string, existingNama?: string): string {
  if (existingNama && existingNama !== 'Penata' && !existingNama.includes('/')) {
    return existingNama;
  }
  const resolved = resolvePangkat(kodeOrNama || existingNama);
  return resolved.nama;
}

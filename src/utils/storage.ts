import { Pegawai, UsulanSLKS, PengaturanInstansi } from '../types/slks';
import { SAMPLE_PEGAWAI, INITIAL_USULAN } from '../data/samplePegawai';
import { DEFAULT_PENGATURAN_INSTANSI } from '../data/wilayahIndonesia';

const STORAGE_KEYS = {
  PEGAWAI: 'si_slks_pegawai_v1',
  USULAN: 'si_slks_usulan_v1',
  PENGATURAN: 'si_slks_pengaturan_instansi_v1',
};

export function getPengaturanInstansi(): PengaturanInstansi {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENGATURAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PENGATURAN, JSON.stringify(DEFAULT_PENGATURAN_INSTANSI));
      return DEFAULT_PENGATURAN_INSTANSI;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading pengaturan:', err);
    return DEFAULT_PENGATURAN_INSTANSI;
  }
}

export function savePengaturanInstansi(config: PengaturanInstansi): PengaturanInstansi {
  localStorage.setItem(STORAGE_KEYS.PENGATURAN, JSON.stringify(config));
  return config;
}

export function getPegawaiList(): Pegawai[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PEGAWAI);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PEGAWAI, JSON.stringify(SAMPLE_PEGAWAI));
      return SAMPLE_PEGAWAI;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading pegawai:', err);
    return SAMPLE_PEGAWAI;
  }
}

export function savePegawai(pegawai: Pegawai): Pegawai[] {
  const current = getPegawaiList();
  const idx = current.findIndex((p) => p.nip === pegawai.nip);
  let updated: Pegawai[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = pegawai;
  } else {
    updated = [pegawai, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.PEGAWAI, JSON.stringify(updated));
  return updated;
}

export function replacePegawaiList(incoming: Pegawai[]): { total: number } {
  const validList = incoming.filter((p) => p.nip && p.nip.length >= 18);
  localStorage.setItem(STORAGE_KEYS.PEGAWAI, JSON.stringify(validList));
  return { total: validList.length };
}

export function importBatchPegawai(
  incoming: Pegawai[],
  overwriteExisting: boolean = true
): { total: number; added: number; updated: number } {
  const current = getPegawaiList();
  let added = 0;
  let updated = 0;

  const currentMap = new Map<string, Pegawai>();
  current.forEach((p) => currentMap.set(p.nip, p));

  incoming.forEach((item) => {
    if (!item.nip || item.nip.length < 18) return;
    if (currentMap.has(item.nip)) {
      if (overwriteExisting) {
        currentMap.set(item.nip, { ...currentMap.get(item.nip)!, ...item });
        updated++;
      }
    } else {
      currentMap.set(item.nip, item);
      added++;
    }
  });

  const newList = Array.from(currentMap.values());
  localStorage.setItem(STORAGE_KEYS.PEGAWAI, JSON.stringify(newList));

  return {
    total: newList.length,
    added,
    updated,
  };
}

export function deletePegawai(nip: string): Pegawai[] {
  const current = getPegawaiList();
  const updated = current.filter((p) => p.nip !== nip);
  localStorage.setItem(STORAGE_KEYS.PEGAWAI, JSON.stringify(updated));
  return updated;
}

export function getPangkatRank(kdPangkat?: string): number {
  if (!kdPangkat) return 0;
  const weights: Record<string, number> = {
    'IV/e': 17, 'IV/d': 16, 'IV/c': 15, 'IV/b': 14, 'IV/a': 13,
    'III/d': 12, 'III/c': 11, 'III/b': 10, 'III/a': 9,
    'II/d': 8, 'II/c': 7, 'II/b': 6, 'II/a': 5,
    'I/d': 4, 'I/c': 3, 'I/b': 2, 'I/a': 1,
  };
  const clean = kdPangkat.trim().toUpperCase().replace(/\./g, '/');
  if (weights[clean]) return weights[clean];
  for (const k of Object.keys(weights)) {
    if (clean.includes(k)) return weights[k];
  }
  return 0;
}

export function getSlksRank(tingkat?: string): number {
  if (tingkat === 'XXX') return 3;
  if (tingkat === 'XX') return 2;
  if (tingkat === 'X') return 1;
  return 0;
}

/**
 * Urutan data yang telah diinput sesuai permintaan pengguna:
 * 1. Usulan SLKS paling atas: 30 > 20 > 10 (XXX > XX > X)
 * 2. Pangkat tertinggi > terendah (IV/e s.d I/a)
 * 3. Umur dilihat dari NIP (tertua > termuda, tanggal lahir YYYYMMDD paling awal lebih dulu)
 */
export function sortUsulanList(list: UsulanSLKS[]): UsulanSLKS[] {
  return [...list].sort((a, b) => {
    // 1. Usulan SLKS: 30 > 20 > 10
    const slksDiff = getSlksRank(b.slksUsul) - getSlksRank(a.slksUsul);
    if (slksDiff !== 0) return slksDiff;

    // 2. Pangkat tertinggi > terendah
    const rankA = getPangkatRank(a.pegawai.kdPangkat);
    const rankB = getPangkatRank(b.pegawai.kdPangkat);
    if (rankB !== rankA) return rankB - rankA;

    // 3. Umur dari 8 digit awal NIP (YYYYMMDD): tanggal lahir lebih awal = umur lebih tua
    const birthA = a.pegawai.nip ? a.pegawai.nip.replace(/\D/g, '').slice(0, 8) : '99999999';
    const birthB = b.pegawai.nip ? b.pegawai.nip.replace(/\D/g, '').slice(0, 8) : '99999999';
    const birthDiff = birthA.localeCompare(birthB);
    if (birthDiff !== 0) return birthDiff;

    // 4. Nama Pegawai (A-Z)
    return (a.pegawai.nama || '').localeCompare(b.pegawai.nama || '');
  });
}

export function getUsulanList(): UsulanSLKS[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USULAN);
    if (!raw) {
      const sortedInitial = sortUsulanList(INITIAL_USULAN);
      localStorage.setItem(STORAGE_KEYS.USULAN, JSON.stringify(sortedInitial));
      return sortedInitial;
    }
    const parsed: UsulanSLKS[] = JSON.parse(raw);
    return sortUsulanList(parsed);
  } catch (err) {
    console.error('Error loading usulan:', err);
    return sortUsulanList(INITIAL_USULAN);
  }
}

export function saveUsulan(usulan: UsulanSLKS): UsulanSLKS[] {
  const current = getUsulanList();
  const idx = current.findIndex((u) => u.id === usulan.id);
  let updated: UsulanSLKS[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = usulan;
  } else {
    updated = [usulan, ...current];
  }
  const sorted = sortUsulanList(updated);
  localStorage.setItem(STORAGE_KEYS.USULAN, JSON.stringify(sorted));

  // Also ensure pegawai is saved
  savePegawai(usulan.pegawai);

  return sorted;
}

export function deleteUsulan(id: string): UsulanSLKS[] {
  const current = getUsulanList();
  const updated = current.filter((u) => u.id !== id);
  const sorted = sortUsulanList(updated);
  localStorage.setItem(STORAGE_KEYS.USULAN, JSON.stringify(sorted));
  return sorted;
}

export function updateUsulanStatus(
  id: string,
  status: UsulanSLKS['statusUsulan'],
  catatan?: string,
  noKeppres?: string,
  tglKeppres?: string
): UsulanSLKS[] {
  const current = getUsulanList();
  const updated = current.map((u) => {
    if (u.id === id) {
      return {
        ...u,
        statusUsulan: status,
        catatanVerifikator: catatan !== undefined ? catatan : u.catatanVerifikator,
        noKeppres: noKeppres || u.noKeppres,
        tglKeppres: tglKeppres || u.tglKeppres,
      };
    }
    return u;
  });
  const sorted = sortUsulanList(updated);
  localStorage.setItem(STORAGE_KEYS.USULAN, JSON.stringify(sorted));
  return sorted;
}

export function resetToSampleData(): { pegawai: Pegawai[]; usulan: UsulanSLKS[]; pengaturan: PengaturanInstansi } {
  localStorage.setItem(STORAGE_KEYS.PEGAWAI, JSON.stringify(SAMPLE_PEGAWAI));
  localStorage.setItem(STORAGE_KEYS.USULAN, JSON.stringify(INITIAL_USULAN));
  localStorage.setItem(STORAGE_KEYS.PENGATURAN, JSON.stringify(DEFAULT_PENGATURAN_INSTANSI));
  return {
    pegawai: SAMPLE_PEGAWAI,
    usulan: INITIAL_USULAN,
    pengaturan: DEFAULT_PENGATURAN_INSTANSI,
  };
}

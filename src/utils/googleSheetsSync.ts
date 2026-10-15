import { UsulanSLKS, PengaturanInstansi } from '../types/slks';
import { getPangkatName } from '../data/pangkatData';

export interface SyncResult {
  success: boolean;
  message: string;
}

/**
 * Mengirim data satu usulan pegawai ke Web App Google Apps Script
 * Mendukung pembagian sheet per OPD/Unit Kerja ("tampilan web 1 tapi sheetnya masing-masing")
 */
export async function sendUsulanToGoogleAppsScript(
  usulan: UsulanSLKS,
  config: PengaturanInstansi
): Promise<SyncResult> {
  const scriptUrl = config.googleAppsScriptUrl?.trim();
  if (!scriptUrl) {
    return {
      success: false,
      message: 'URL Google Apps Script belum dikonfigurasi di Master Pengaturan.',
    };
  }

  // Tentukan nama sheet target: prioritas config.targetSheetName, jika kosong gunakan unit kerja pegawai, atau default 'Usulan SLKS'
  const sheetName =
    config.targetSheetName?.trim() ||
    usulan.pegawai.unitKerja?.trim() ||
    'Usulan SLKS';

  const payload = {
    action: 'tambahUsulan',
    sheetName: sheetName,
    waktuInput: new Date().toLocaleString('id-ID'),
    nip: usulan.pegawai.nip,
    nama: usulan.pegawai.nama,
    pangkat: getPangkatName(usulan.pegawai.kdPangkat, usulan.pegawai.namaPangkat),
    jabatan: usulan.pegawai.jabatan,
    unitKerja: usulan.pegawai.unitKerja,
    slksUsul: `${usulan.slksUsul} (${usulan.slksUsul === 'XXX' ? '30 Th' : usulan.slksUsul === 'XX' ? '20 Th' : '10 Th'})`,
    masaKerja: `${usulan.mkPnsTahun} Tahun ${usulan.mkPnsBulan} Bulan`,
    statusKelayakan: usulan.statusKelayakan,
    keteranganTms: usulan.keteranganTms || '-',
    slksLama: usulan.slksLamaTingkat ? `${usulan.slksLamaTingkat} (${usulan.slksLamaNoKeppres || '-'})` : 'Belum Ada',
    kabKota: config.kabKota || usulan.pegawai.kabKota,
    provinsi: config.provinsi || usulan.pegawai.provinsi,
    kdWil: config.kdWil || usulan.pegawai.kdWil,
    tahunPengusulan: usulan.tahunPengusulan,
    bulanPengusulan: usulan.bulanPengusulan,
  };

  try {
    // Mode 'no-cors' digunakan untuk Google Apps Script Web App agar tidak terblokir oleh browser CORS
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: `Tersinkronisasi ke Google Sheet (Sheet: "${sheetName}")!`,
    };
  } catch (error: any) {
    console.error('Error syncing to Google Apps Script:', error);
    return {
      success: false,
      message: `Gagal mengirim ke Google Apps Script: ${error?.message || 'Koneksi error'}`,
    };
  }
}

/**
 * Script Google Apps Script yang siap di-copy-paste ke Google Sheets
 * Mendukung multi-sheet otomatis berdasarkan OPD/Unit Kerja
 */
export function getGoogleAppsScriptTemplateCode(): string {
  return `/**
 * ==============================================================================
 * KODE GOOGLE APPS SCRIPT - SISTEM PENGUSULAN SATYALANCANA KARYA SATYA (SI-SLKS)
 * ==============================================================================
 * Petunjuk Pemasangan:
 * 1. Buka Google Sheet Anda (buat file spreadsheet baru).
 * 2. Klik menu "Ekstensi" (Extensions) -> "Apps Script".
 * 3. Hapus semua kode yang ada, lalu Paste seluruh kode di bawah ini.
 * 4. Klik tombol "Simpan" (ikon disket).
 * 5. Klik tombol "Terapkan" (Deploy) -> "Penerapan baru" (New deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: API Usulan SLKS
 *    - Jalankan sebagai: "Saya" (Me)
 *    - Siapa yang memiliki akses: "Siapa saja" (Anyone) -> SANGAT PENTING!
 * 8. Klik "Terapkan" (Deploy), berikan izin akses Google akun Anda.
 * 9. Salin URL Aplikasi Web yang diberikan, lalu tempel di menu Master Data SI-SLKS!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Kunci script selama 15 detik agar tidak bentrok saat banyak yang input bersamaan
  lock.tryLock(15000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    
    // Nama sheet otomatis sesuai OPD / Unit Kerja atau target sheet yang ditentukan
    // Ini memungkinkan: 1 TAMPILAN WEB, TAPI SHEETNYA MASING-MASING OPD!
    var sheetName = data.sheetName || 'Usulan SLKS';
    
    // Ambil sheet atau buat baru jika belum ada
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      
      // Buat Header Tabel Resmi
      var headers = [
        'No',
        'Waktu Input',
        'NIP (18 Digit)',
        'Nama Pegawai',
        'Pangkat / Golongan',
        'Jabatan',
        'Unit Kerja / OPD',
        'SLKS Diusulkan',
        'Masa Kerja PNS',
        'Kelayakan',
        'Keterangan TMS',
        'SLKS Sebelumnya',
        'Kabupaten',
        'Provinsi',
        'Kode Wilayah',
        'Tahun Usul'
      ];
      
      sheet.appendRow(headers);
      
      // Format Header Sheet Baru (Warna Hijau Teal & Teks Tebal)
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#0f766e');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    // Tentukan nomor urut berikutnya
    var lastRow = sheet.getLastRow();
    var noUrut = lastRow; // karena baris 1 header
    
    // Buat baris data
    var newRow = [
      noUrut,
      data.waktuInput || new Date().toLocaleString('id-ID'),
      "'" + String(data.nip), // Petik satu agar NIP diperlakukan sebagai teks murni (tidak diubah angka)
      data.nama,
      data.pangkat,
      data.jabatan,
      data.unitKerja,
      data.slksUsul,
      data.masaKerja,
      data.statusKelayakan,
      data.keteranganTms || '-',
      data.slksLama || '-',
      data.kabKota || '-',
      data.provinsi || '-',
      data.kdWil || '-',
      data.tahunPengusulan || new Date().getFullYear()
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      sheet: sheetName,
      row: lastRow + 1
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'SI-SLKS Web App Receiver Active!'
  })).setMimeType(ContentService.MimeType.JSON);
}
`;
}

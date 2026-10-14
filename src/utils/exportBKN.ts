import { UsulanSLKS, PengaturanInstansi } from '../types/slks';
import { getPangkatName } from '../data/pangkatData';

export interface BKNRowData {
  no: number;
  nip: string;
  nama: string;
  pangkat: string;
  jabatan: string;
  slksLama: string;
  noKeppres: string;
  tglKeppres: string;
  slksUsul: string;
  kdWil: string;
}

export function prepareBKNRows(
  usulanList: UsulanSLKS[],
  pengaturan?: PengaturanInstansi
): BKNRowData[] {
  return usulanList.map((item, idx) => {
    const namaPangkat = getPangkatName(item.pegawai.kdPangkat, item.pegawai.namaPangkat);
    return {
      no: idx + 1,
      nip: item.pegawai.nip,
      nama: item.pegawai.nama,
      pangkat: namaPangkat,
      jabatan: item.pegawai.jabatan,
      slksLama: item.slksLamaTingkat || item.pegawai.riwayatSlks?.[0]?.tingkat || '-',
      noKeppres: item.slksLamaNoKeppres || item.pegawai.riwayatSlks?.[0]?.noKeppres || '-',
      tglKeppres: item.slksLamaTglKeppres || item.pegawai.riwayatSlks?.[0]?.tglKeppres || '-',
      slksUsul: item.slksUsul,
      kdWil: item.pegawai.kdWil || pengaturan?.kdWil || '-',
    };
  });
}

/**
 * Ekspor ke file CSV 10 Kolom dengan format Text untuk NIP
 * Menggunakan formula ="NIP" agar Microsoft Excel TIDAK mengubah 18 digit NIP menjadi notasi ilmiah (scientific notation) seperti 1.98E+17.
 */
export function exportToCSV10Kolom(
  rows: BKNRowData[],
  fileName = `Nominatif_SLKS_10_Kolom_${new Date().toISOString().slice(0, 10)}.csv`
) {
  const headers = [
    'No',
    'NIP',
    'Nama',
    'Pangkat',
    'Jabatan',
    'SlksLama',
    'NoKeppres',
    'TglKeppres',
    'SlksUsul',
    'KdWil',
  ];

  const escapeCSV = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvBody = rows.map((r) => {
    // KUNCI: ="NIP" memastikan Excel membacanya sebagai teks murni tanpa notasi ilmiah
    const nipCell = `="` + r.nip + `"`;
    return [
      r.no,
      nipCell,
      escapeCSV(r.nama),
      escapeCSV(r.pangkat),
      escapeCSV(r.jabatan),
      escapeCSV(r.slksLama),
      escapeCSV(r.noKeppres),
      escapeCSV(r.tglKeppres),
      escapeCSV(r.slksUsul),
      escapeCSV(r.kdWil),
    ].join(',');
  });

  const content = ['sep=,', headers.join(','), ...csvBody].join('\r\n');

  // Menambahkan UTF-8 BOM (\uFEFF) agar terbaca sempurna di seluruh versi Excel & LibreOffice
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ekspor ke file Excel (.xls) berformat Spreadsheet MSO
 * Menggunakan style mso-number-format:"\@" pada kolom NIP sehingga Excel secara absolut
 * mengunci tipe sel sebagai TEXT (Teks) dan tidak merubah angka NIP.
 */
export function exportToExcel10Kolom(
  rows: BKNRowData[],
  fileName = `Nominatif_SLKS_10_Kolom_${new Date().toISOString().slice(0, 10)}.xls`
) {
  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Nominatif 10 Kolom</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
    table { border-collapse: collapse; width: 100%; }
    th {
      background-color: #0f766e;
      color: #ffffff;
      font-weight: bold;
      border: 1px solid #333333;
      padding: 8px 10px;
      text-align: center;
    }
    td {
      border: 1px solid #999999;
      padding: 6px 8px;
      vertical-align: middle;
    }
    .text-format {
      mso-number-format: "\\@"; /* KUNCI FORMAT TEKS DI EXCEL */
    }
    .center-align { text-align: center; }
    .bold-cell { font-weight: bold; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">No</th>
        <th style="width: 170px;">NIP</th>
        <th style="width: 220px;">Nama</th>
        <th style="width: 150px;">Pangkat</th>
        <th style="width: 250px;">Jabatan</th>
        <th style="width: 80px;">SlksLama</th>
        <th style="width: 160px;">NoKeppres</th>
        <th style="width: 100px;">TglKeppres</th>
        <th style="width: 80px;">SlksUsul</th>
        <th style="width: 80px;">KdWil</th>
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (r) => `
      <tr>
        <td class="center-align">${r.no}</td>
        <td class="text-format font-mono" style="mso-number-format:'\\@';">${r.nip}</td>
        <td class="bold-cell">${r.nama}</td>
        <td>${r.pangkat}</td>
        <td>${r.jabatan}</td>
        <td class="center-align bold-cell">${r.slksLama}</td>
        <td class="text-format" style="mso-number-format:'\\@';">${r.noKeppres}</td>
        <td class="center-align">${r.tglKeppres}</td>
        <td class="center-align bold-cell">${r.slksUsul}</td>
        <td class="center-align text-format" style="mso-number-format:'\\@';">${r.kdWil}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>
  `;

  const blob = new Blob(['\uFEFF' + excelHtml], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

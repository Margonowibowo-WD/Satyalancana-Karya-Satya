export interface ProvinsiIndonesia {
  kode: string;
  nama: string;
  ibuKota: string;
}

export const DAFTAR_PROVINSI_INDONESIA: ProvinsiIndonesia[] = [
  { kode: '11', nama: 'Aceh', ibuKota: 'Banda Aceh' },
  { kode: '12', nama: 'Sumatera Utara', ibuKota: 'Medan' },
  { kode: '13', nama: 'Sumatera Barat', ibuKota: 'Padang' },
  { kode: '14', nama: 'Riau', ibuKota: 'Pekanbaru' },
  { kode: '15', nama: 'Jambi', ibuKota: 'Jambi' },
  { kode: '16', nama: 'Sumatera Selatan', ibuKota: 'Palembang' },
  { kode: '17', nama: 'Bengkulu', ibuKota: 'Bengkulu' },
  { kode: '18', nama: 'Lampung', ibuKota: 'Bandar Lampung' },
  { kode: '19', nama: 'Kepulauan Bangka Belitung', ibuKota: 'Pangkalpinang' },
  { kode: '21', nama: 'Kepulauan Riau', ibuKota: 'Tanjungpinang' },
  
  { kode: '31', nama: 'DKI Jakarta', ibuKota: 'Jakarta Pusat' },
  { kode: '32', nama: 'Jawa Barat', ibuKota: 'Bandung' },
  { kode: '33', nama: 'Jawa Tengah', ibuKota: 'Semarang' },
  { kode: '34', nama: 'D.I. Yogyakarta', ibuKota: 'Yogyakarta' },
  { kode: '35', nama: 'Jawa Timur', ibuKota: 'Surabaya' },
  { kode: '36', nama: 'Banten', ibuKota: 'Serang' },
  
  { kode: '51', nama: 'Bali', ibuKota: 'Denpasar' },
  { kode: '52', nama: 'Nusa Tenggara Barat', ibuKota: 'Mataram' },
  { kode: '53', nama: 'Nusa Tenggara Timur', ibuKota: 'Kupang' },
  
  { kode: '61', nama: 'Kalimantan Barat', ibuKota: 'Pontianak' },
  { kode: '62', nama: 'Kalimantan Tengah', ibuKota: 'Palangka Raya' },
  { kode: '63', nama: 'Kalimantan Selatan', ibuKota: 'Banjarbaru' },
  { kode: '64', nama: 'Kalimantan Timur', ibuKota: 'Samarinda' },
  { kode: '65', nama: 'Kalimantan Utara', ibuKota: 'Tanjung Selor' },
  
  { kode: '71', nama: 'Sulawesi Utara', ibuKota: 'Manado' },
  { kode: '72', nama: 'Sulawesi Tengah', ibuKota: 'Palu' },
  { kode: '73', nama: 'Sulawesi Selatan', ibuKota: 'Makassar' },
  { kode: '74', nama: 'Sulawesi Tenggara', ibuKota: 'Kendari' },
  { kode: '75', nama: 'Gorontalo', ibuKota: 'Gorontalo' },
  { kode: '76', nama: 'Sulawesi Barat', ibuKota: 'Mamuju' },
  
  { kode: '81', nama: 'Maluku', ibuKota: 'Ambon' },
  { kode: '82', nama: 'Maluku Utara', ibuKota: 'Sofifi' },
  
  { kode: '91', nama: 'Papua', ibuKota: 'Jayapura' },
  { kode: '92', nama: 'Papua Barat', ibuKota: 'Manokwari' },
  { kode: '93', nama: 'Papua Selatan', ibuKota: 'Merauke' },
  { kode: '94', nama: 'Papua Tengah', ibuKota: 'Nabire' },
  { kode: '95', nama: 'Papua Pegunungan', ibuKota: 'Wamena' },
  { kode: '96', nama: 'Papua Barat Daya', ibuKota: 'Sorong' },
];

export const DEFAULT_PENGATURAN_INSTANSI = {
  namaInstansi: 'Pemerintah Kabupaten / Kota',
  kabKota: 'Kabupaten / Kota',
  provinsi: 'Provinsi',
  kdWil: '00.00',
};


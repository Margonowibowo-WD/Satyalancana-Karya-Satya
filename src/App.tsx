import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { FormUsulanSLKS } from './components/FormUsulanSLKS';
import { TabelDaftarUsulan } from './components/TabelDaftarUsulan';
import { CetakDokumen } from './components/CetakDokumen';
import { DashboardStatistik } from './components/DashboardStatistik';
import { MasterPengaturan } from './components/MasterPengaturan';
import { PanduanPenggunaan } from './components/PanduanPenggunaan';
import {
  getPegawaiList,
  getUsulanList,
  saveUsulan,
  deleteUsulan,
  updateUsulanStatus,
  resetToSampleData,
  getPengaturanInstansi,
  savePengaturanInstansi,
  replacePegawaiList,
  deletePegawai,
} from './utils/storage';
import { Pegawai, UsulanSLKS, PengaturanInstansi } from './types/slks';
import { Award, RefreshCw, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('input');
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [usulanList, setUsulanList] = useState<UsulanSLKS[]>([]);
  const [pengaturan, setPengaturan] = useState<PengaturanInstansi>(getPengaturanInstansi());
  const [selectedUsulanForEdit, setSelectedUsulanForEdit] = useState<UsulanSLKS | null>(null);
  const [activeUsulanForSinglePrint, setActiveUsulanForSinglePrint] = useState<UsulanSLKS | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    setPegawaiList(getPegawaiList());
    setUsulanList(getUsulanList());
    setPengaturan(getPengaturanInstansi());
  }, []);

  const handleSaveUsulan = (usulan: UsulanSLKS) => {
    const updated = saveUsulan(usulan);
    setUsulanList(updated);
    setPegawaiList(getPegawaiList());
    setSelectedUsulanForEdit(null);
  };

  const handleDeleteUsulan = (id: string) => {
    const updated = deleteUsulan(id);
    setUsulanList(updated);
  };

  const handleEditUsulan = (usulan: UsulanSLKS) => {
    setSelectedUsulanForEdit(usulan);
    setActiveTab('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCetakUsulan = (usulan: UsulanSLKS) => {
    setActiveUsulanForSinglePrint(usulan);
    setActiveTab('cetak');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateWorkflow = (
    id: string,
    status: UsulanSLKS['statusUsulan'],
    noKeppres?: string,
    tglKeppres?: string
  ) => {
    const updated = updateUsulanStatus(id, status, undefined, noKeppres, tglKeppres);
    setUsulanList(updated);
  };

  const handleSavePengaturan = (newConfig: PengaturanInstansi) => {
    savePengaturanInstansi(newConfig);
    setPengaturan(newConfig);
  };

  const handleImportPegawai = (incoming: Pegawai[]) => {
    const res = replacePegawaiList(incoming);
    setPegawaiList(getPegawaiList());
    return res;
  };

  const handleDeletePegawai = (nip: string) => {
    const updated = deletePegawai(nip);
    setPegawaiList(updated);
  };

  // Langsung usulkan pegawai dari daftar Master
  const handleSelectPegawaiForProposal = (nip: string) => {
    const p = pegawaiList.find((item) => item.nip === nip);
    if (p) {
      setSelectedUsulanForEdit({
        id: `USL-${Date.now()}`,
        idPegawai: p.nip,
        pegawai: p,
        mkPnsTahun: 0,
        mkPnsBulan: 0,
        mkHukdisTahun: 0,
        mkHukdisBulan: 0,
        slksUsul: 'X',
        bulanPengusulan: new Date().getMonth() + 1,
        tahunPengusulan: new Date().getFullYear(),
        statusKelayakan: 'MS',
        statusUsulan: 'Draf',
        tanggalUsulan: new Date().toISOString().split('T')[0],
      });
    }
    setActiveTab('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      instansi: pengaturan,
      pegawai: pegawaiList,
      usulan: usulanList,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeKab = (pengaturan.kabKota || 'slks').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.href = url;
    a.download = `backup_slks_${safeKab}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.instansi) {
          savePengaturanInstansi(parsed.instansi);
          setPengaturan(parsed.instansi);
        }
        if (Array.isArray(parsed.pegawai)) {
          replacePegawaiList(parsed.pegawai);
          setPegawaiList(parsed.pegawai);
        }
        if (Array.isArray(parsed.usulan)) {
          localStorage.setItem('si_slks_usulan_v1', JSON.stringify(parsed.usulan));
          setUsulanList(parsed.usulan);
        }
        alert('Data cadangan berhasil dipulihkan 100%! Data instansi, master pegawai, dan usulan kini telah aktif.');
      } catch (err) {
        alert('Gagal memulihkan file cadangan. Pastikan berkas adalah file JSON cadangan SI-SLKS yang valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetSample = () => {
    if (confirm('Kembalikan semua data ke setelan awal sistem?')) {
      const res = resetToSampleData();
      setPegawaiList(res.pegawai);
      setUsulanList(res.usulan);
      setPengaturan(res.pengaturan);
      setSelectedUsulanForEdit(null);
      alert('Data dan pengaturan berhasil diatur ulang.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 flex flex-col text-slate-800">
      {/* Top Navbar (Nasional) */}
      <div className="no-print">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewProposal={() => {
            setSelectedUsulanForEdit(null);
            setActiveTab('input');
          }}
          namaDaerah={pengaturan.kabKota || pengaturan.provinsi || 'Nasional'}
        />
      </div>

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'input' && (
          <FormUsulanSLKS
            pegawaiList={pegawaiList}
            onSaveUsulan={handleSaveUsulan}
            selectedUsulanForEdit={selectedUsulanForEdit}
            onClearEdit={() => setSelectedUsulanForEdit(null)}
            onViewPrint={handleCetakUsulan}
            pengaturan={pengaturan}
            onNavigateToMaster={() => setActiveTab('master')}
          />
        )}

        {activeTab === 'daftar' && (
          <TabelDaftarUsulan
            usulanList={usulanList}
            onEditUsulan={handleEditUsulan}
            onDeleteUsulan={handleDeleteUsulan}
            onCetakUsulan={handleCetakUsulan}
            onUpdateStatusWorkflow={handleUpdateWorkflow}
          />
        )}

        {activeTab === 'cetak' && (
          <CetakDokumen
            usulanList={usulanList}
            activeUsulanForSinglePrint={activeUsulanForSinglePrint}
            pengaturan={pengaturan}
          />
        )}

        {activeTab === 'statistik' && (
          <DashboardStatistik
            usulanList={usulanList}
            onNavigateToForm={() => setActiveTab('input')}
            onNavigateToList={() => setActiveTab('daftar')}
          />
        )}

        {activeTab === 'master' && (
          <MasterPengaturan
            pengaturan={pengaturan}
            onSavePengaturan={handleSavePengaturan}
            pegawaiList={pegawaiList}
            onImportPegawai={handleImportPegawai}
            onDeletePegawai={handleDeletePegawai}
            onSelectPegawaiForProposal={handleSelectPegawaiForProposal}
          />
        )}

        {activeTab === 'panduan' && (
          <PanduanPenggunaan
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        )}
      </main>

      {/* Modern Fresh Footer - Credit to Margono Wibowo located exclusively at the very bottom */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-teal-100 py-6 text-xs text-slate-600 no-print mt-auto shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-amber-300 flex items-center justify-center font-bold shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">
                SI-SLKS NASIONAL · Sistem Pengusulan Satyalancana Karya Satya Republik Indonesia
              </div>
              <div className="text-[11px] text-teal-800 font-medium">
                Didesain & Dikembangkan oleh <strong>Margono Wibowo</strong> (BKPSDM Kabupaten Mukomuko) untuk ASN Seluruh Indonesia
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={() => {
                setActiveTab('panduan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-teal-800 font-medium cursor-pointer"
            >
              Buku Panduan
            </button>
            <span>·</span>
            <span>PP No. 35/2010</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleResetSample}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-teal-800 transition-colors cursor-pointer"
              title="Reset data ke bawaan awal"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

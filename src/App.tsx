import React, { useState } from 'react';
import { PesantrenProvider } from './context/PesantrenContext';
import { Navbar } from './components/Navbar';
import { SantriProfileHeader } from './components/SantriProfileHeader';
import { DashboardOverview } from './components/tabs/DashboardOverview';
import { AbsensiTab } from './components/tabs/AbsensiTab';
import { KeuanganTab } from './components/tabs/KeuanganTab';
import { RaportTahfidzTab } from './components/tabs/RaportTahfidzTab';
import { PesanDanAgendaTab } from './components/tabs/PesanDanAgendaTab';
import { KeamananDataTab } from './components/tabs/KeamananDataTab';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

function PesantrenApp() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Persistent Santri Profile & Key Metrics Header */}
        <SantriProfileHeader />

        {/* Dynamic Tab Content */}
        {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
        {activeTab === 'absensi' && <AbsensiTab />}
        {activeTab === 'keuangan' && <KeuanganTab />}
        {activeTab === 'raport' && <RaportTahfidzTab />}
        {activeTab === 'pesan' && <PesanDanAgendaTab />}
        {activeTab === 'keamanan' && <KeamananDataTab />}
      </main>

      {/* Quiet, Respectful Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-12 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-stone-800">
            {/* Col 1 */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-md bg-emerald-800 text-amber-300 flex items-center justify-center font-serif font-bold text-sm">
                  ن
                </span>
                <span className="text-sm font-bold text-white tracking-tight">
                  Pondok Pesantren Hidayatun Najah
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                Mencetak generasi santri hafidz Al-Qur’an 30 Juz, mutafaqqih fiddin berakhlak mulia, berwawasan global, dan berpegang teguh pada nilai-nilai Ahlussunnah wal Jama’ah.
              </p>
              <div className="flex items-center gap-1.5 text-stone-400 text-[11px] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sistem Informasi Terenkripsi & Terintegrasi Wali Santri</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider block mb-1">
                Layanan Digital
              </span>
              <button onClick={() => setActiveTab('absensi')} className="block text-stone-400 hover:text-white transition-colors">
                Presensi 5 Waktu Santri
              </button>
              <button onClick={() => setActiveTab('keuangan')} className="block text-stone-400 hover:text-white transition-colors">
                Pembayaran SPP & E-Saku
              </button>
              <button onClick={() => setActiveTab('raport')} className="block text-stone-400 hover:text-white transition-colors">
                Raport Tahfidz & Kitab Kuning
              </button>
              <button onClick={() => setActiveTab('pesan')} className="block text-stone-400 hover:text-white transition-colors">
                Pesan Langsung & Agenda
              </button>
            </div>

            {/* Col 3 */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider block mb-1">
                Sekretariat & Bantuan
              </span>
              <div className="flex items-center gap-2 text-stone-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>(031) 8876-5432 / 0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>layanan@hidayatunnajah.sch.id</span>
              </div>
              <div className="flex items-start gap-2 text-stone-400 text-[11px] mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kompleks Kampus Pesantren, Jl. Pesantren No. 09, Jawa Timur</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
            <span>
              © {new Date().getFullYear()} Pondok Pesantren Hidayatun Najah. Hak Cipta Dilindungi Undang-Undang.
            </span>
            <span>
              Portal Digital Santri & Wali Versi 3.4 · Sinkronisasi Real-Time
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PesantrenProvider>
      <PesantrenApp />
    </PesantrenProvider>
  );
}

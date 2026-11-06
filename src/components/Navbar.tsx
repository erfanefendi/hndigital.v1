import React from 'react';
import { usePesantren } from '../context/PesantrenContext';
import { 
  ShieldCheck, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  UserCheck, 
  BookOpen, 
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { 
    activeRole, 
    setActiveRole, 
    isSyncing, 
    lastSyncTime, 
    forceSyncNow, 
    privacyMask, 
    togglePrivacyMask,
    selectedSantri 
  } = usePesantren();

  const navLinks = [
    { id: 'dashboard', label: 'Ringkasan' },
    { id: 'absensi', label: 'Absensi Santri' },
    { id: 'keuangan', label: 'SPP & Belanja' },
    { id: 'raport', label: 'Raport & Tahfidz' },
    { id: 'pesan', label: 'Pesan & Agenda' },
    { id: 'keamanan', label: 'Privasi & Data' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro-bar for real-time sync & security status */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Sinkronisasi Real-Time
          </span>
          <span className="text-stone-400 hidden sm:inline">·</span>
          <span className="text-stone-400 hidden sm:inline">
            Update: <span className="font-mono tabular-nums text-stone-200">{lastSyncTime}</span>
          </span>
          <span className="text-stone-400 hidden md:inline">·</span>
          <span className="text-stone-400 hidden md:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
            Enkripsi Sesi Aktif
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Privacy mask toggle */}
          <button
            onClick={togglePrivacyMask}
            title={privacyMask ? "Tampilkan nominal angka" : "Samarkan nominal finansial (Mode Privasi)"}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-[11px]"
          >
            {privacyMask ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{privacyMask ? 'Privasi Aktif' : 'Mode Terbuka'}</span>
          </button>

          {/* Sync now button */}
          <button
            onClick={forceSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
          </button>
        </div>
      </div>

      {/* Main Top Navigation Bar (Zone 1 - Zone 2 - Zone 3) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            ن
          </div>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors block leading-tight">
              Hidayatun Najah
            </span>
            <span className="text-[11px] font-medium text-stone-600 block">
              Portal Santri & Wali Terpadu
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-emerald-900 bg-emerald-50/80 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Role Switcher & Profile CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200/80">
            <button
              onClick={() => setActiveRole('wali')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeRole === 'wali'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Wali Santri</span>
            </button>
            <button
              onClick={() => setActiveRole('pengurus')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                activeRole === 'pengurus'
                  ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Asatidz / Pondok</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden border-t border-stone-100 px-4 py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar bg-stone-50/60">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                  : 'text-stone-600 bg-white border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

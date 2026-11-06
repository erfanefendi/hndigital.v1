import React from 'react';
import { usePesantren } from '../context/PesantrenContext';
import mosqueCampusImg from '../assets/images/pesantren_campus_mosque_1793962077880.jpg';
import { 
  Building2, 
  BookMarked, 
  User, 
  Phone, 
  ChevronDown,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const SantriProfileHeader: React.FC = () => {
  const { 
    santriList, 
    selectedSantri, 
    setSelectedSantriId, 
    activeRole, 
    absensiList, 
    tagihanList, 
    privacyMask 
  } = usePesantren();

  // Calculate attendance rate this month
  const santriAbsensi = absensiList.filter(a => a.santriId === selectedSantri.id);
  const hadirCount = santriAbsensi.filter(a => a.status === 'Hadir').length;
  const attendanceRate = santriAbsensi.length > 0 ? Math.round((hadirCount / santriAbsensi.length) * 100) : 100;

  // Unpaid bills count
  const unpaidCount = tagihanList.filter(t => t.santriId === selectedSantri.id && t.status === 'Belum_Bayar').length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/90 shadow-xs mb-6">
      {/* Background Islamic Architectural Header */}
      <div className="h-32 sm:h-40 relative w-full overflow-hidden bg-stone-900">
        <img
          src={mosqueCampusImg}
          alt="Pondok Pesantren Hidayatun Najah"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
        
        {/* Pesantren Tagline & Bismillah */}
        <div className="absolute top-3 left-4 sm:left-6 flex items-center gap-2 text-white/90 text-xs">
          <span className="font-arabic text-amber-300 text-sm tracking-wide">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <span className="text-white/40">·</span>
          <span className="font-medium tracking-wide">Pondok Pesantren Hidayatun Najah</span>
        </div>

        {/* Santri Selector Dropdown (Right side) */}
        <div className="absolute top-3 right-4 sm:right-6">
          <div className="relative">
            <select
              value={selectedSantri.id}
              onChange={(e) => setSelectedSantriId(e.target.value)}
              className="appearance-none bg-stone-900/80 backdrop-blur-md text-stone-100 text-xs font-medium pl-3 pr-8 py-1.5 rounded-lg border border-white/20 focus:outline-hidden hover:bg-stone-900 transition-colors cursor-pointer"
            >
              {santriList.map((s) => (
                <option key={s.id} value={s.id} className="bg-stone-900 text-stone-100">
                  {s.nama} ({s.nis})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-300 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Profile Bar & Key Santri Metadata */}
      <div className="px-4 sm:px-6 pb-5 pt-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
          <div className="flex items-end gap-3.5 sm:gap-4">
            {/* Santri Avatar */}
            <div className="relative">
              <img
                src={selectedSantri.avatarUrl}
                alt={selectedSantri.nama}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-4 border-white shadow-md bg-stone-100"
              />
              <span className="absolute bottom-1 right-1 p-1 bg-emerald-600 text-white rounded-full border-2 border-white" title="Status Aktif di Pesantren">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            </div>

            {/* Name & Academic Class */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {selectedSantri.nama}
                </h1>
                <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                  NIS: {selectedSantri.nis}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                {selectedSantri.kelasFormal} <span className="text-stone-300">·</span> {selectedSantri.tingkatDiniyah}
              </p>
            </div>
          </div>

          {/* Role Indicator & Musyrif Info */}
          <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200">
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span>{selectedSantri.kamar}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>Musyrif: <strong className="text-stone-700 font-medium">{selectedSantri.musyrifKamar}</strong></span>
            </div>
          </div>
        </div>

        {/* 4-Item Indicator Grid (KPI Metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-stone-100">
          {/* 1. Presensi Bulan Ini */}
          <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/60">
            <span className="text-xs text-stone-500 block">Tingkat Kehadiran</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                {attendanceRate}%
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Tertib Sholat & Madrasah</span>
            </div>
          </div>

          {/* 2. Capaian Al-Quran */}
          <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/80">
            <span className="text-xs text-emerald-900/80 block">Capaian Tahfidz</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-emerald-950 font-mono tabular-nums">
                {selectedSantri.capaianJuz} <span className="text-xs font-normal text-stone-500">/ 30 Juz</span>
              </span>
              <span className="text-[11px] text-emerald-800 font-medium">Mutqin</span>
            </div>
          </div>

          {/* 3. Saldo E-Saku Santri */}
          <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/60">
            <span className="text-xs text-stone-500 block">Saldo E-Saku (Koperasi)</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                {privacyMask ? 'Rp •••••••' : `Rp ${selectedSantri.saldoSaku.toLocaleString('id-ID')}`}
              </span>
              <span className="text-[11px] text-stone-500">
                Limit: {privacyMask ? '••••' : `Rp ${(selectedSantri.limitHarian/1000).toFixed(0)}k/hari`}
              </span>
            </div>
          </div>

          {/* 4. Tagihan SPP */}
          <div className={`p-3 rounded-xl border ${
            unpaidCount > 0 
              ? 'bg-amber-50/60 border-amber-200/80 text-amber-950' 
              : 'bg-stone-50/70 border-stone-200/60 text-stone-900'
          }`}>
            <span className="text-xs text-stone-500 block">Status Administrasi SPP</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums">
                {unpaidCount > 0 ? `${unpaidCount} Tagihan` : 'Semua Lunas'}
              </span>
              <span className={`text-[11px] font-medium ${unpaidCount > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                {unpaidCount > 0 ? 'Perlu Diselesaikan' : 'Administrasi Tertib'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { 
  Calendar, 
  CreditCard, 
  BookOpen, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Wallet, 
  Sparkles,
  ShoppingBag,
  Bell,
  Send,
  ChevronRight
} from 'lucide-react';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const { 
    selectedSantri, 
    absensiList, 
    tagihanList, 
    transaksiSakuList, 
    setoranTahfidzList, 
    pesanList, 
    agendaList,
    privacyMask 
  } = usePesantren();

  // Filter for current santri
  const santriAbsensi = absensiList.filter(a => a.santriId === selectedSantri.id);
  const latestAbsensi = santriAbsensi[0];
  
  const pendingTagihan = tagihanList.filter(t => t.santriId === selectedSantri.id && t.status === 'Belum_Bayar');
  const totalTagihanNominal = pendingTagihan.reduce((acc, t) => acc + t.nominal, 0);

  const santriTrx = transaksiSakuList.filter(t => t.santriId === selectedSantri.id);
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySpent = santriTrx
    .filter(t => t.tanggal === todayStr && t.tipe === 'Debit')
    .reduce((acc, t) => acc + t.nominal, 0);

  const latestSetoran = setoranTahfidzList.filter(s => s.santriId === selectedSantri.id)[0];
  const unreadMessages = pesanList.filter(p => p.santriId === selectedSantri.id && !p.sudahDibaca);
  const upcomingAgenda = agendaList[0];

  return (
    <div className="space-y-6">
      {/* Islamic Scholar Wisdom Banner */}
      <div className="bg-linear-to-r from-emerald-900 to-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase block mb-1">
            Motivasi Tholabul Ilmi Pesantren
          </span>
          <p className="text-base sm:text-lg font-serif italic text-stone-100 leading-relaxed mb-2">
            "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ"
          </p>
          <p className="text-xs sm:text-sm text-stone-300">
            "Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju Surga." (HR. Muslim)
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 rounded-full bg-emerald-700/20 pointer-events-none blur-2xl" />
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Presensi & Kedisiplinan Terkini */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Absensi Terakhir
              </span>
              <button 
                onClick={() => setActiveTab('absensi')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
              >
                Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latestAbsensi ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-stone-800">
                      Sesi {latestAbsensi.sesi.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {latestAbsensi.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100">
                  {latestAbsensi.keterangan}
                </p>
                <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                  <span>Waktu: <strong className="text-stone-600 font-mono">{latestAbsensi.waktu}</strong></span>
                  <span>Petugas: {latestAbsensi.petugas}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">Belum ada catatan presensi hari ini</p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('absensi')}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Buka Riwayat Absensi Lengkap</span>
          </button>
        </div>

        {/* 2. Administrasi SPP & Tagihan */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                SPP & Administrasi
              </span>
              <button 
                onClick={() => setActiveTab('keuangan')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
              >
                Rincian <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingTagihan.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs text-stone-500 block">Total Menunggu Pembayaran:</span>
                <p className="text-2xl font-bold font-mono tabular-nums text-amber-900">
                  {privacyMask ? 'Rp ••••••••' : `Rp ${totalTagihanNominal.toLocaleString('id-ID')}`}
                </p>
                <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Ada <strong>{pendingTagihan.length} tagihan</strong> (SPP & Katering). Jatuh tempo {pendingTagihan[0].jatuhTempo}.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-3 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-semibold text-stone-800">Semua Tagihan Lunas</p>
                <p className="text-xs text-stone-500">Syukran katsiran atas kedisiplinan wali santri</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('keuangan')}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Bayar via QRIS / VA BSI</span>
          </button>
        </div>

        {/* 3. Belanja Santri & E-Saku */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                E-Saku & Koperasi Santri
              </span>
              <button 
                onClick={() => setActiveTab('keuangan')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
              >
                Kelola <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-stone-500">Saldo Tersedia:</span>
                <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                  {privacyMask ? 'Rp •••••••' : `Rp ${selectedSantri.saldoSaku.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-stone-100">
                <span>Pengeluaran Hari Ini:</span>
                <span className="font-mono tabular-nums font-semibold text-stone-800">
                  {privacyMask ? '••••' : `Rp ${todaySpent.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Limit Belanja Harian:</span>
                <span className="font-mono tabular-nums text-stone-700 font-medium">
                  {privacyMask ? '••••' : `Rp ${selectedSantri.limitHarian.toLocaleString('id-ID')} / hari`}
                </span>
              </div>

              {/* Limit usage meter */}
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden mt-1">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todaySpent / selectedSantri.limitHarian) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('keuangan')}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Top-Up Saldo E-Saku Santri</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Tahfidz Progress & Message Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Capaian Tahfidz & Kitab Kuning */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Progres Tahfidz Al-Qur'an & Kitab
              </h2>
              <p className="text-xs text-stone-500">
                Halaqah Tahfidz & Diniyah Pondok Pesantren
              </p>
            </div>
            <button
              onClick={() => setActiveTab('raport')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Raport Lengkap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar towards 30 juz */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-4">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-semibold text-stone-700">Target Hafalan 30 Juz</span>
              <span className="font-mono tabular-nums font-bold text-emerald-800">
                {selectedSantri.capaianJuz} / 30 Juz ({Math.round((selectedSantri.capaianJuz / 30) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-linear-to-r from-emerald-600 to-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${(selectedSantri.capaianJuz / 30) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              Hafalan terverifikasi Mutqin di hadapan Ustadz Penguji.
            </p>
          </div>

          {/* Latest Setoran Record */}
          {latestSetoran && (
            <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50/50">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-stone-800">
                  Setoran Terakhir: Surat {latestSetoran.surat}
                </span>
                <span className="text-emerald-800 bg-emerald-100/70 font-semibold px-2 py-0.5 rounded text-[11px]">
                  Nilai: {latestSetoran.nilai}
                </span>
              </div>
              <p className="text-xs text-stone-600 mb-2">
                {latestSetoran.ayat} ({latestSetoran.tipe}) · Juz {latestSetoran.juz}
              </p>
              <p className="text-xs text-stone-500 italic bg-white p-2 rounded border border-stone-100">
                "{latestSetoran.catatan}"
              </p>
            </div>
          )}
        </div>

        {/* Right: Direct Messages & Announcements from Pesantren */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">
                Warta & Pesan Wali Santri
              </h2>
              {unreadMessages.length > 0 && (
                <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadMessages.length} Baru
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab('pesan')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Buka Pesan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pesanList.slice(0, 3).map((pesan) => (
              <div 
                key={pesan.id}
                onClick={() => setActiveTab('pesan')}
                className={`p-3 rounded-xl border transition-all cursor-pointer hover:border-emerald-300 ${
                  !pesan.sudahDibaca 
                    ? 'bg-emerald-50/40 border-emerald-200/80' 
                    : 'bg-stone-50/60 border-stone-200/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-900">{pesan.judul}</span>
                  <span className="text-[11px] text-stone-400 font-mono">{pesan.waktu}</span>
                </div>
                <p className="text-xs text-stone-600 line-clamp-2">
                  {pesan.pesan}
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 pt-1 border-t border-stone-100">
                  <span className="font-medium text-stone-600">Dari: {pesan.pengirim}</span>
                  <span className="text-emerald-700 font-medium">Buka Percakapan →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pesantren Calendar Agenda Spotlight */}
      {upcomingAgenda && (
        <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Agenda Terdekat
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {upcomingAgenda.tanggalMasehi} ({upcomingAgenda.tanggalHijriah})
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              {upcomingAgenda.judul}
            </h3>
            <p className="text-xs text-stone-300 line-clamp-1">
              {upcomingAgenda.deskripsi}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('pesan')}
            className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Lihat Kalender Lengkap
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  FileCheck, 
  EyeOff, 
  CheckCircle2, 
  Server, 
  Smartphone, 
  Globe, 
  Database,
  AlertTriangle
} from 'lucide-react';

export const KeamananDataTab: React.FC = () => {
  const { 
    securityLogs, 
    lastSyncTime, 
    isSyncing, 
    forceSyncNow, 
    privacyMask, 
    togglePrivacyMask,
    selectedSantri,
    activeRole
  } = usePesantren();

  const [pinCurrent, setPinCurrent] = useState<string>('');
  const [pinNew, setPinNew] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCurrent !== '123456') {
      setPinError('PIN lama salah. Gunakan default: 123456');
      return;
    }
    if (pinNew.length !== 6) {
      setPinError('PIN baru harus 6 digit angka.');
      return;
    }
    setPinSuccess('PIN otorisasi wali santri berhasil diperbarui.');
    setPinCurrent('');
    setPinNew('');
    setPinError('');
    setTimeout(() => setPinSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900">
                  Pusat Keamanan Data & Privasi Terenkripsi
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  AES-256 Terlindungi
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                Menjamin kerahasiaan informasi santri, rekam medis poskestren, saldo e-saku, dan kuitansi pembayaran SPP wali santri sesuai standar perlindungan data pribadi pesantren.
              </p>
            </div>
          </div>

          <button
            onClick={forceSyncNow}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncing ? 'Sedang Menyinkronkan...' : 'Sinkronkan Data Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* 3 Grid Security Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1: Real-time Sync Engine Status */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase mb-2">
              <Server className="w-4 h-4" />
              <span>Sinkronisasi Multi-Perangkat</span>
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              Sinkronisasi Real-Time Aktif
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Data absensi, perubahan saldo, dan pesan tersinkronisasi otomatis antar HP wali santri, tablet musyrif kamar, dan komputer administrasi.
            </p>

            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">Kanal Real-time:</span>
                <span className="text-emerald-700 font-bold">Terhubung (Online)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pembaruan Terakhir:</span>
                <span className="text-stone-800 font-bold">{lastSyncTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Protokol:</span>
                <span className="text-stone-800">TLS 1.3 / SSL Verified</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Akses Kapan Saja & Di Mana Saja</span>
            <span className="text-emerald-700 font-bold">100% Siap</span>
          </div>
        </div>

        {/* Module 2: Privacy Shield Mode */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-stone-800 text-xs font-bold uppercase mb-2">
              <EyeOff className="w-4 h-4 text-emerald-800" />
              <span>Proteksi Tampilan Publik</span>
            </div>
            <h3 className="text-sm font-bold text-stone-900">
              Mode Penyamaran Angka Finansial
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Samarkan nominal SPP dan saldo santri dengan simbol (••••) saat membuka portal di tempat umum untuk menjaga privasi keuangan keluarga.
            </p>

            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Status Mode Privasi</span>
                <span className="text-[11px] text-stone-500">
                  {privacyMask ? 'Nominal tersamarkan aktif' : 'Nominal terlihat normal'}
                </span>
              </div>
              <button
                onClick={togglePrivacyMask}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  privacyMask 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                }`}
              >
                {privacyMask ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
            Tersedia tombol pintas di bilah navigasi atas.
          </div>
        </div>

        {/* Module 3: PIN Otorisasi Transaksi */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase mb-2">
            <Key className="w-4 h-4" />
            <span>PIN Otorisasi Wali Santri</span>
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Keamanan Perubahan Limit & Dana
          </h3>
          <p className="text-xs text-stone-600 mt-1 mb-3">
            PIN 6 digit diperlukan saat mengubah limit belanja harian santri atau konfirmasi pembayaran SPP.
          </p>

          <form onSubmit={handleChangePin} className="space-y-2 text-xs">
            <div>
              <label className="text-stone-600 block mb-0.5">PIN Lama:</label>
              <input
                type="password"
                maxLength={6}
                value={pinCurrent}
                onChange={(e) => setPinCurrent(e.target.value)}
                placeholder="Default: 123456"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-1.5 font-mono text-center tracking-widest text-sm"
              />
            </div>
            <div>
              <label className="text-stone-600 block mb-0.5">PIN Baru (6 Digit):</label>
              <input
                type="password"
                maxLength={6}
                value={pinNew}
                onChange={(e) => setPinNew(e.target.value)}
                placeholder="Misal: 654321"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-1.5 font-mono text-center tracking-widest text-sm"
              />
            </div>

            {pinError && <p className="text-red-600 text-[11px]">{pinError}</p>}
            {pinSuccess && <p className="text-emerald-700 text-[11px] font-medium">{pinSuccess}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold mt-1"
            >
              Ubah PIN Sekarang
            </button>
          </form>
        </div>
      </div>

      {/* Audit Security Logs Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-800" />
              <span>Log Audit Aktivitas & Keamanan Real-Time</span>
            </h3>
            <p className="text-xs text-stone-500">
              Pencatatan transparan seluruh aktivitas autentikasi, presensi, transaksi, dan perubahan data
            </p>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {securityLogs.length} Catatan Terakhir
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Waktu Transaksi</th>
                <th className="py-2.5 px-3">Aktivitas Sistem</th>
                <th className="py-2.5 px-3">Perangkat Pengakses</th>
                <th className="py-2.5 px-3">Alamat Jaringan (Masked)</th>
                <th className="py-2.5 px-3">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono text-stone-600 whitespace-nowrap text-[11px]">
                    {log.waktu}
                  </td>
                  <td className="py-3 px-3 font-semibold text-stone-900">
                    {log.aktivitas}
                  </td>
                  <td className="py-3 px-3 text-stone-600 text-[11px]">
                    {log.perangkat}
                  </td>
                  <td className="py-3 px-3 font-mono text-stone-500 text-[11px]">
                    {log.ipMasked}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { SesiAbsensi, StatusAbsensi } from '../../types/pesantren';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Filter, 
  UserPlus, 
  Send, 
  Search,
  MessageCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const AbsensiTab: React.FC = () => {
  const { 
    selectedSantri, 
    absensiList, 
    recordAbsensi, 
    activeRole, 
    santriList 
  } = usePesantren();

  const [filterSesi, setFilterSesi] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchDate, setSearchDate] = useState<string>('');

  // Form state for Pengurus / Asatidz
  const [targetSantriId, setTargetSantriId] = useState<string>(selectedSantri.id);
  const [formSesi, setFormSesi] = useState<SesiAbsensi>('Subuh');
  const [formStatus, setFormStatus] = useState<StatusAbsensi>('Hadir');
  const [formKeterangan, setFormKeterangan] = useState<string>('');
  const [formPetugas, setFormPetugas] = useState<string>('Ust. Ahmad Baihaqi');
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>('');

  // Filter attendance records
  const filteredRecords = absensiList.filter((rec) => {
    // If wali, only show for selected santri. If pengurus, also allows filtering
    if (activeRole === 'wali' && rec.santriId !== selectedSantri.id) return false;
    if (activeRole === 'pengurus' && targetSantriId && rec.santriId !== targetSantriId) {
      // allow showing all or selected
    }
    if (filterSesi !== 'all' && rec.sesi !== filterSesi) return false;
    if (filterStatus !== 'all' && rec.status !== filterStatus) return false;
    if (searchDate && rec.tanggal !== searchDate) return false;
    return true;
  });

  // Calculate statistics for selected santri
  const santriRecords = absensiList.filter(a => a.santriId === selectedSantri.id);
  const countHadir = santriRecords.filter(a => a.status === 'Hadir').length;
  const countIzin = santriRecords.filter(a => a.status === 'Izin').length;
  const countSakit = santriRecords.filter(a => a.status === 'Sakit').length;
  const countAlpa = santriRecords.filter(a => a.status === 'Alpa').length;
  const totalRecords = santriRecords.length;
  const persentaseHadir = totalRecords > 0 ? Math.round((countHadir / totalRecords) * 100) : 100;

  const handleSubmitAbsensi = (e: React.FormEvent) => {
    e.preventDefault();
    recordAbsensi({
      santriId: targetSantriId,
      sesi: formSesi,
      status: formStatus,
      keterangan: formKeterangan,
      petugas: formPetugas
    });
    setSuccessToast(`Presensi berhasil dicatat & notifikasi terkirim otomatis ke wali santri.`);
    setShowInputModal(false);
    setFormKeterangan('');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const getStatusBadge = (status: StatusAbsensi) => {
    switch (status) {
      case 'Hadir':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Hadir
          </span>
        );
      case 'Izin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5" /> Izin Resmi
          </span>
        );
      case 'Sakit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" /> Sakit (Poskestren)
          </span>
        );
      case 'Alpa':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5" /> Alpa
          </span>
        );
    }
  };

  const getSesiLabel = (sesi: SesiAbsensi) => {
    switch (sesi) {
      case 'Subuh': return 'Sholat Subuh & Wirid';
      case 'Tahfidz_Pagi': return 'Halaqah Tahfidz Pagi';
      case 'Madrasah': return 'Sekolah Formal Madrasah';
      case 'Kajian_Kitab': return 'Kajian Kitab Kuning Sore';
      case 'Isya_Malam': return 'Sholat Isya & Mudzakarah';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="font-bold text-stone-500 hover:text-stone-800">✕</button>
        </div>
      )}

      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            Absensi & Disiplin Ibadah Santri
          </h2>
          <p className="text-xs text-stone-500">
            Monitoring kehadiran 5 waktu kegiatan harian di Pondok Pesantren Hidayatun Najah
          </p>
        </div>

        {activeRole === 'pengurus' && (
          <button
            onClick={() => setShowInputModal(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Input Presensi Santri</span>
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 block">Tingkat Hadir</span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-900 block mt-0.5">
            {persentaseHadir}%
          </span>
          <span className="text-[10px] text-stone-400">Total {totalRecords} Sesi</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 block">Hadir</span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-700 block mt-0.5">
            {countHadir}
          </span>
          <span className="text-[10px] text-stone-400">Tepat Waktu</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 block">Izin Resmi</span>
          <span className="text-xl font-bold font-mono tabular-nums text-blue-700 block mt-0.5">
            {countIzin}
          </span>
          <span className="text-[10px] text-stone-400">Surat Keterangan</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <span className="text-[11px] text-stone-500 block">Sakit (Klinik)</span>
          <span className="text-xl font-bold font-mono tabular-nums text-amber-700 block mt-0.5">
            {countSakit}
          </span>
          <span className="text-[10px] text-stone-400">Rawat Poskestren</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 col-span-2 md:col-span-1">
          <span className="text-[11px] text-stone-500 block">Alpa / Tanpa Ket.</span>
          <span className="text-xl font-bold font-mono tabular-nums text-red-700 block mt-0.5">
            {countAlpa}
          </span>
          <span className="text-[10px] text-stone-400">Disiplin Terjaga</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-stone-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Sesi:</span>
          </div>
          <select
            value={filterSesi}
            onChange={(e) => setFilterSesi(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden font-medium text-stone-700"
          >
            <option value="all">Semua Sesi Harian</option>
            <option value="Subuh">Sholat Subuh</option>
            <option value="Tahfidz_Pagi">Tahfidz Pagi</option>
            <option value="Madrasah">Madrasah Formal</option>
            <option value="Kajian_Kitab">Kajian Kitab Sore</option>
            <option value="Isya_Malam">Sholat Isya & Malam</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden font-medium text-stone-700"
          >
            <option value="all">Semua Status</option>
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Alpa">Alpa</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-500">Pilih Tanggal:</span>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 focus:outline-hidden font-mono text-stone-700"
          />
          {searchDate && (
            <button
              onClick={() => setSearchDate('')}
              className="text-stone-400 hover:text-stone-700 font-bold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Sesi Kegiatan</th>
                <th className="py-3 px-4">Santri</th>
                <th className="py-3 px-4">Status Kehadiran</th>
                <th className="py-3 px-4">Keterangan & Catatan Musyrif</th>
                <th className="py-3 px-4">Petugas / Asatidz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-stone-900">{rec.tanggal}</div>
                      <div className="font-mono text-stone-400 text-[11px]">{rec.waktu}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-stone-800">
                        {getSesiLabel(rec.sesi)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-stone-900">{rec.santriNama}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(rec.status)}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 max-w-xs">
                      {rec.keterangan || '-'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 font-medium">
                      {rec.petugas}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Tidak ditemukan data presensi dengan filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Routine Daily Boarding Schedule Reference */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-800" />
          <span>Jadwal Harian Rutin Santri Pesantren Hidayatun Najah</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-mono font-bold text-emerald-800 block">03:30 - 05:00</span>
            <span className="font-semibold text-stone-800">Qiyamul Lail & Subuh</span>
            <p className="text-stone-500 text-[11px] mt-1">Tahajjud, Dzikir Pagi & Sholat Subuh Berjamaah</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-mono font-bold text-emerald-800 block">05:30 - 06:45</span>
            <span className="font-semibold text-stone-800">Halaqah Tahfidz</span>
            <p className="text-stone-500 text-[11px] mt-1">Setoran Ziyadah & Muraja'ah Al-Qur'an Pagi</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-mono font-bold text-emerald-800 block">07:15 - 14:30</span>
            <span className="font-semibold text-stone-800">Madrasah Formal</span>
            <p className="text-stone-500 text-[11px] mt-1">Pendidikan Kurikulum Kemenag (MTs & MA)</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-mono font-bold text-emerald-800 block">16:00 - 17:30</span>
            <span className="font-semibold text-stone-800">Kajian Kitab Kuning</span>
            <p className="text-stone-500 text-[11px] mt-1">Bandongan & Sorogan Nahwu, Fiqih, Akhlak</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200">
            <span className="font-mono font-bold text-emerald-800 block">19:30 - 21:30</span>
            <span className="font-semibold text-stone-800">Mudzakarah Malam</span>
            <p className="text-stone-500 text-[11px] mt-1">Belajar Mandiri Terbimbing & Muhadharah</p>
          </div>
        </div>
      </div>

      {/* Modal Input Presensi (Asatidz / Pengurus) */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Pencatatan Presensi Santri Real-Time
              </h3>
              <button
                onClick={() => setShowInputModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAbsensi} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Pilih Santri:
                </label>
                <select
                  value={targetSantriId}
                  onChange={(e) => setTargetSantriId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-hidden"
                >
                  {santriList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.nis}) - {s.kamar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Sesi Kegiatan:
                  </label>
                  <select
                    value={formSesi}
                    onChange={(e) => setFormSesi(e.target.value as SesiAbsensi)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-hidden"
                  >
                    <option value="Subuh">Sholat Subuh</option>
                    <option value="Tahfidz_Pagi">Tahfidz Pagi</option>
                    <option value="Madrasah">Madrasah Formal</option>
                    <option value="Kajian_Kitab">Kajian Kitab Sore</option>
                    <option value="Isya_Malam">Sholat Isya & Malam</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Status Kehadiran:
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as StatusAbsensi)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-hidden"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Izin">Izin Resmi</option>
                    <option value="Sakit">Sakit (Klinik)</option>
                    <option value="Alpa">Alpa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Catatan / Keterangan Musyrif:
                </label>
                <textarea
                  rows={3}
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Misal: Hadir di shaf awal, membaca wirid / Izin di poskestren flu ringan..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Petugas / Asatidz Pencatat:
                </label>
                <input
                  type="text"
                  value={formPetugas}
                  onChange={(e) => setFormPetugas(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-stone-600 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Sistem akan otomatis mengirimkan notifikasi pesan instan ke HP wali santri dan menyinkronkan data antar perangkat secara real-time.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl font-semibold shadow-xs"
                >
                  Simpan & Kirim Notifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

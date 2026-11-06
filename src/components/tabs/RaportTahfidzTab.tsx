import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { SetoranTahfidz } from '../../types/pesantren';
import santriStudyImg from '../../assets/images/santri_study_quran_1793962077906.jpg';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Printer, 
  Plus, 
  Star, 
  ChevronRight, 
  Sparkles, 
  FileText,
  Calendar,
  UserCheck
} from 'lucide-react';

export const RaportTahfidzTab: React.FC = () => {
  const { 
    selectedSantri, 
    setoranTahfidzList, 
    tambahSetoranTahfidz, 
    raport, 
    activeRole 
  } = usePesantren();

  const [activeSection, setActiveSection] = useState<'tahfidz' | 'diniyah'>('tahfidz');
  const [showInputSetoran, setShowInputSetoran] = useState<boolean>(false);
  const [showFullRaportModal, setShowFullRaportModal] = useState<boolean>(false);

  // Form input setoran
  const [formSurat, setFormSurat] = useState<string>('Maryam');
  const [formAyat, setFormAyat] = useState<string>('Ayat 26 - 50');
  const [formJuz, setFormJuz] = useState<number>(16);
  const [formTipe, setFormTipe] = useState<'Ziyadah' | 'Murajaah'>('Ziyadah');
  const [formNilai, setFormNilai] = useState<'A (Mumtaz)' | 'B+ (Jayyid Jiddan)' | 'B (Jayyid)' | 'C (Maqbul)'>('A (Mumtaz)');
  const [formKelancaran, setFormKelancaran] = useState<number>(95);
  const [formTajwid, setFormTajwid] = useState<number>(92);
  const [formMakhorij, setFormMakhorij] = useState<number>(94);
  const [formCatatan, setFormCatatan] = useState<string>('Bacaan sangat fasih dan tartil, tajwid dijaga dengan cermat.');
  const [formPenguji, setFormPenguji] = useState<string>('Ust. Zulkifli, Lc.');

  const [toastMsg, setToastMsg] = useState<string>('');

  const santriSetoran = setoranTahfidzList.filter(s => s.santriId === selectedSantri.id);

  const handleSaveSetoran = (e: React.FormEvent) => {
    e.preventDefault();
    tambahSetoranTahfidz({
      santriId: selectedSantri.id,
      tanggal: new Date().toISOString().split('T')[0],
      surat: formSurat,
      ayat: formAyat,
      juz: formJuz,
      tipe: formTipe,
      nilai: formNilai,
      kelancaran: formKelancaran,
      tajwid: formTajwid,
      makhorij: formMakhorij,
      catatan: formCatatan,
      penguji: formPenguji
    });
    setShowInputSetoran(false);
    setToastMsg(`Setoran Tahfidz Surat ${formSurat} berhasil dicatat & dilaporkan ke wali santri.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="font-bold text-stone-500 hover:text-stone-800">✕</button>
        </div>
      )}

      {/* Top Banner with Study Photo */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Pelaporan Belajar & Tahfidz Transparan</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900">
                Perkembangan Tahfidz Al-Qur'an & Kitab Kuning
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Laporan berkala hasil setoran talaqqi santri, kurikulum Diniyah pesantren, dan pembinaan karakter akhlaqul karimah.
              </p>

              {/* 30 Juz Milestone Tracker */}
              <div className="mt-5 p-4 bg-stone-50 rounded-xl border border-stone-200/70">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-stone-800">Capaian Hafalan Mutqin:</span>
                  <span className="font-mono tabular-nums font-bold text-emerald-800 text-sm">
                    {selectedSantri.capaianJuz} / 30 Juz
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-linear-to-r from-emerald-700 to-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${(selectedSantri.capaianJuz / 30) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-500 mt-2">
                  <span>Halaqah: <strong>{selectedSantri.halaqahTahfidz}</strong></span>
                  <span className="text-emerald-700 font-medium">Tingkat: {selectedSantri.tingkatDiniyah}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-stone-100">
              <button
                onClick={() => setShowFullRaportModal(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Cetak / Unduh Raport Lengkap</span>
              </button>

              {activeRole === 'pengurus' && (
                <button
                  onClick={() => setShowInputSetoran(true)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Setoran Baru (Asatidz)</span>
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:block relative h-full min-h-[220px]">
            <img
              src={santriStudyImg}
              alt="Halaqah Belajar Santri"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
              <p className="font-serif italic">"Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Switcher: Tahfidz vs Kitab Diniyah */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl max-w-fit">
        <button
          onClick={() => setActiveSection('tahfidz')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeSection === 'tahfidz'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Riwayat Setoran Al-Qur'an ({santriSetoran.length})
        </button>
        <button
          onClick={() => setActiveSection('diniyah')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeSection === 'diniyah'
              ? 'bg-white text-emerald-950 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Raport Kitab Kuning & Karakter Santri
        </button>
      </div>

      {/* ================= SECTION 1: TAHFIDZ AL-QUR'AN ================= */}
      {activeSection === 'tahfidz' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
            <h3 className="text-sm font-bold text-stone-900 mb-4">
              Riwayat Talaqqi & Setoran Tahfidz Santri
            </h3>

            <div className="space-y-3">
              {santriSetoran.map((setoran) => (
                <div
                  key={setoran.id}
                  className="p-4 rounded-xl border border-stone-200 hover:border-emerald-300 transition-colors bg-stone-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/70">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        setoran.tipe === 'Ziyadah' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {setoran.tipe === 'Ziyadah' ? 'Ziyadah (Hafalan Baru)' : 'Muraja’ah (Pengulangan)'}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900">
                        Surat {setoran.surat} {setoran.ayat}
                      </h4>
                      <span className="text-xs text-stone-500 font-mono">
                        (Juz {setoran.juz})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {setoran.nilai}
                      </span>
                      <span className="text-stone-400 text-xs font-mono">{setoran.tanggal}</span>
                    </div>
                  </div>

                  {/* Score Breakdown (Kelancaran, Tajwid, Makhorij) */}
                  <div className="grid grid-cols-3 gap-3 my-2.5 text-xs text-stone-600">
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase">Kelancaran</span>
                      <span className="font-mono tabular-nums font-bold text-stone-800 text-sm">
                        {setoran.kelancaran} / 100
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase">Kaidah Tajwid</span>
                      <span className="font-mono tabular-nums font-bold text-stone-800 text-sm">
                        {setoran.tajwid} / 100
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase">Makhorijul Huruf</span>
                      <span className="font-mono tabular-nums font-bold text-stone-800 text-sm">
                        {setoran.makhorij} / 100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded-lg border border-stone-100">
                    "{setoran.catatan}"
                  </p>

                  <div className="text-[11px] text-stone-400 mt-2 text-right">
                    Penguji: <strong className="text-stone-600 font-medium">{setoran.penguji}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 2: KITAB KUNING & KARAKTER ================= */}
      {activeSection === 'diniyah' && (
        <div className="space-y-6">
          {/* Kitab Kuning Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Nilai Mata Pelajaran Diniyah & Kitab Salaf
                </h3>
                <p className="text-xs text-stone-500">
                  Semester {raport.semester} TA {raport.tahunAjaran} ({raport.hijriyah}) · Peringkat {raport.peringkatKelas} dari {raport.totalSantriKelas} Santri
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Kitab & Bidang Ilmu</th>
                    <th className="py-2.5 px-3">Guru Pengampu</th>
                    <th className="py-2.5 px-3 text-center">Teori</th>
                    <th className="py-2.5 px-3 text-center">Praktik</th>
                    <th className="py-2.5 px-3">Predikat</th>
                    <th className="py-2.5 px-3">Catatan Perkembangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {raport.kitab.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-stone-900">{item.namaKitab}</div>
                        <div className="text-stone-400 text-[11px]">{item.bidang}</div>
                      </td>
                      <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                        {item.pengampu}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums font-bold text-stone-900">
                        {item.nilaiTeori}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums font-bold text-stone-900">
                        {item.nilaiPraktik}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          {item.predikat}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-600 text-[11px] max-w-xs">
                        {item.catatan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Akhlak & Karakter Assessment */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
            <h3 className="text-sm font-bold text-stone-900 mb-3">
              Penilaian Akhlaqul Karimah & Perilaku Keseharian
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 font-medium block">1. Sholat Berjamaah:</span>
                <p className="font-semibold text-stone-800 mt-1">{raport.akhlak.sholatJamaah}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 font-medium block">2. Kedisiplinan & Waktu:</span>
                <p className="font-semibold text-stone-800 mt-1">{raport.akhlak.kedisiplinan}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 font-medium block">3. Kebersihan Asrama:</span>
                <p className="font-semibold text-stone-800 mt-1">{raport.akhlak.kebersihan}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 font-medium block">4. Adab kepada Guru & Teman:</span>
                <p className="font-semibold text-stone-800 mt-1">{raport.akhlak.adabSopanSantun}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 col-span-1 sm:col-span-2">
                <span className="text-stone-500 font-medium block">5. Kemandirian Santri:</span>
                <p className="font-semibold text-stone-800 mt-1">{raport.akhlak.kemandirian}</p>
              </div>
            </div>

            {/* Official Guidance Note from Pimpinan Pondok */}
            <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-950 block mb-1">
                Amanat & Doa Pengasuh Pondok Pesantren Hidayatun Najah:
              </span>
              <p className="text-stone-700 italic leading-relaxed">
                "{raport.catatanPengasuh}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: INPUT SETORAN TAHFIDZ (ASATIDZ) ================= */}
      {showInputSetoran && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Input Setoran Tahfidz Al-Qur'an
              </h3>
              <button
                onClick={() => setShowInputSetoran(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSetoran} className="space-y-3 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500">Santri:</span>
                <span className="font-bold text-stone-900 ml-1">{selectedSantri.nama} (NIS: {selectedSantri.nis})</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Nama Surat:</label>
                  <input
                    type="text"
                    value={formSurat}
                    onChange={(e) => setFormSurat(e.target.value)}
                    placeholder="Contoh: Maryam"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Rentang Ayat:</label>
                  <input
                    type="text"
                    value={formAyat}
                    onChange={(e) => setFormAyat(e.target.value)}
                    placeholder="Contoh: Ayat 1 - 25"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Juz Ke:</label>
                  <input
                    type="number"
                    value={formJuz}
                    onChange={(e) => setFormJuz(Number(e.target.value))}
                    min={1}
                    max={30}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono font-bold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tipe Setoran:</label>
                  <select
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium focus:outline-hidden"
                  >
                    <option value="Ziyadah">Ziyadah (Baru)</option>
                    <option value="Murajaah">Muraja'ah (Ulang)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Predikat:</label>
                  <select
                    value={formNilai}
                    onChange={(e) => setFormNilai(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium focus:outline-hidden"
                  >
                    <option value="A (Mumtaz)">A (Mumtaz)</option>
                    <option value="B+ (Jayyid Jiddan)">B+ (Jayyid Jiddan)</option>
                    <option value="B (Jayyid)">B (Jayyid)</option>
                    <option value="C (Maqbul)">C (Maqbul)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kelancaran (0-100):</label>
                  <input
                    type="number"
                    value={formKelancaran}
                    onChange={(e) => setFormKelancaran(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tajwid (0-100):</label>
                  <input
                    type="number"
                    value={formTajwid}
                    onChange={(e) => setFormTajwid(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Makhorij (0-100):</label>
                  <input
                    type="number"
                    value={formMakhorij}
                    onChange={(e) => setFormMakhorij(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Catatan Ustadz Penguji:</label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInputSetoran(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl font-semibold shadow-xs"
                >
                  Simpan & Notifikasi Wali
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RAPORT DIGITAL RESMI SIAP CETAK ================= */}
      {showFullRaportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 no-print">
              <h3 className="text-base font-bold text-stone-900">
                Raport Digital Resmi Pondok Pesantren
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak / Simpan PDF
                </button>
                <button
                  onClick={() => setShowFullRaportModal(false)}
                  className="text-stone-400 hover:text-stone-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Printable Format */}
            <div className="p-6 border border-stone-300 rounded-xl bg-white text-xs space-y-4">
              {/* Kop Pesantren */}
              <div className="text-center pb-3 border-b-2 border-stone-900">
                <h1 className="text-lg font-bold text-emerald-950 uppercase tracking-wider font-serif">
                  Pondok Pesantren Hidayatun Najah
                </h1>
                <p className="text-[11px] text-stone-600 font-medium">
                  LEMBAGA PENDIDIKAN DINIYAH FORMAL & TAHFIDZ AL-QUR'AN 30 JUZ
                </p>
                <p className="text-[10px] text-stone-500">
                  NSPP: 510035090123 · SK Kemenag No. 492/2018 · Jawa Timur, Indonesia
                </p>
                <div className="mt-2 text-xs font-bold text-stone-900 uppercase tracking-wide bg-stone-100 py-1 rounded">
                  LAPORAN HASIL BELAJAR SANTRI (RAPORT DINIYAH & TAHFIDZ)
                </div>
              </div>

              {/* Santri Info Header */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-stone-200">
                <div>
                  <span className="text-stone-500">Nama Santri:</span>
                  <span className="font-bold text-stone-900 ml-1.5">{selectedSantri.nama}</span>
                </div>
                <div>
                  <span className="text-stone-500">Nomor Induk Santri (NIS):</span>
                  <span className="font-mono font-bold text-stone-900 ml-1.5">{selectedSantri.nis}</span>
                </div>
                <div>
                  <span className="text-stone-500">Kelas & Kamar:</span>
                  <span className="font-medium text-stone-900 ml-1.5">{selectedSantri.kelasFormal} ({selectedSantri.kamar})</span>
                </div>
                <div>
                  <span className="text-stone-500">Semester / Tahun Ajaran:</span>
                  <span className="font-medium text-stone-900 ml-1.5">{raport.semester} {raport.tahunAjaran} ({raport.hijriyah})</span>
                </div>
              </div>

              {/* Diniyah Subjects Table */}
              <div>
                <span className="font-bold text-stone-800 block mb-1">A. Capaian Mata Pelajaran Diniyah (Kitab Salaf)</span>
                <table className="w-full text-left border border-stone-300 text-[11px]">
                  <thead className="bg-stone-100 border-b border-stone-300 font-bold">
                    <tr>
                      <th className="p-1.5">No</th>
                      <th className="p-1.5">Mata Kitab</th>
                      <th className="p-1.5">Bidang</th>
                      <th className="p-1.5 text-center">Teori</th>
                      <th className="p-1.5 text-center">Praktik</th>
                      <th className="p-1.5">Predikat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {raport.kitab.map((k, i) => (
                      <tr key={i}>
                        <td className="p-1.5 text-center">{i + 1}</td>
                        <td className="p-1.5 font-semibold text-stone-900">{k.namaKitab}</td>
                        <td className="p-1.5 text-stone-600">{k.bidang}</td>
                        <td className="p-1.5 text-center font-mono">{k.nilaiTeori}</td>
                        <td className="p-1.5 text-center font-mono">{k.nilaiPraktik}</td>
                        <td className="p-1.5 font-bold text-emerald-900">{k.predikat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tahfidz Quran Summary */}
              <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px]">
                <span className="font-bold text-stone-800 block mb-1">B. Capaian Tahfidz Al-Qur'an 30 Juz</span>
                <p className="text-stone-700">
                  Total Hafalan Teruji Mutqin: <strong className="font-mono text-emerald-900 text-xs">{selectedSantri.capaianJuz} Juz</strong> dari target 30 Juz.
                </p>
                <p className="text-stone-500 mt-0.5">
                  Pembimbing Halaqah: {selectedSantri.halaqahTahfidz} · Status: Berkelanjutan & Istiqomah.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 pt-6 text-[11px] text-center">
                <div>
                  <span>Wali Santri,</span>
                  <div className="h-12 flex items-center justify-center italic text-stone-400">
                    (Tanda Tangan)
                  </div>
                  <span className="font-bold text-stone-900">{selectedSantri.waliNama}</span>
                </div>
                <div>
                  <span>Wali Kelas Diniyah,</span>
                  <div className="h-12 flex items-center justify-center italic text-stone-400">
                    (Tanda Tangan)
                  </div>
                  <span className="font-bold text-stone-900">{selectedSantri.musyrifKamar}</span>
                </div>
                <div>
                  <span>Pengasuh Pesantren,</span>
                  <div className="h-12 flex items-center justify-center font-serif text-emerald-900 font-bold">
                    [Stempel Resmi]
                  </div>
                  <span className="font-bold text-stone-900">KH. Dr. Muhammad Syukron</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

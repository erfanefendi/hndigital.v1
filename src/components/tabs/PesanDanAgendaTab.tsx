import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { 
  MessageSquare, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  User, 
  Filter, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

export const PesanDanAgendaTab: React.FC = () => {
  const { 
    selectedSantri, 
    pesanList, 
    agendaList, 
    kirimPesan, 
    tandaiPesanDibaca, 
    activeRole 
  } = usePesantren();

  const [activeSubTab, setActiveSubTab] = useState<'pesan' | 'agenda'>('pesan');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  
  // Message input
  const [judulInput, setJudulInput] = useState<string>('');
  const [pesanInput, setPesanInput] = useState<string>('');
  const [kategoriInput, setKategoriInput] = useState<'Absensi' | 'Keuangan' | 'Akademik' | 'Kesehatan' | 'Konsultasi'>('Konsultasi');
  const [toastSent, setToastSent] = useState<boolean>(false);

  // Filter messages for current santri
  const santriPesan = pesanList.filter(p => {
    if (p.santriId !== selectedSantri.id) return false;
    if (filterKategori !== 'all' && p.kategori !== filterKategori) return false;
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesanInput.trim()) return;

    const defaultTitle = judulInput.trim() || (activeRole === 'wali' ? `Pertanyaan Wali Santri (${kategoriInput})` : `Informasi Asatidz (${kategoriInput})`);
    
    kirimPesan(
      defaultTitle,
      pesanInput,
      kategoriInput,
      activeRole === 'wali' ? 'Wali Santri' : 'Musyrif Kamar'
    );

    setJudulInput('');
    setPesanInput('');
    setToastSent(true);
    setTimeout(() => setToastSent(false), 3000);
  };

  const getWhatsAppLink = (musyrifNama: string, musyrifHp: string, santriNama: string, nis: string) => {
    const cleanPhone = musyrifHp.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const text = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh Ust. ${musyrifNama}.\nSaya wali santri dari ${santriNama} (NIS: ${nis}) di Pondok Pesantren Hidayatun Najah, bermaksud untuk bersilaturahmi dan menanyakan perkembangan ananda. Terima kasih.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastSent && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pesan langsung berhasil dikirim dan tersinkronisasi.</span>
          </div>
          <button onClick={() => setToastSent(false)} className="font-bold text-stone-500 hover:text-stone-800">✕</button>
        </div>
      )}

      {/* Segmented Switcher: Pesan vs Agenda */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('pesan')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'pesan'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
            <span>Notifikasi & Pesan Langsung ({santriPesan.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('agenda')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'agenda'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-800" />
            <span>Kalender Akademik & Agenda Pondok ({agendaList.length})</span>
          </button>
        </div>

        {/* WhatsApp Official Contact Quick Action */}
        <a
          href={getWhatsAppLink(selectedSantri.musyrifKamar, selectedSantri.musyrifKontak, selectedSantri.nama, selectedSantri.nis)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Chat WhatsApp Musyrif ({selectedSantri.musyrifKamar})</span>
          <ExternalLink className="w-3 h-3 text-emerald-200" />
        </a>
      </div>

      {/* ================= SUBTAB 1: PESAN LANGSUNG KE WALI SANTRI ================= */}
      {activeSubTab === 'pesan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages Feed (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-stone-600 font-medium">Filter Kategori:</span>
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 focus:outline-hidden font-medium text-stone-700"
                >
                  <option value="all">Semua Pesan</option>
                  <option value="Absensi">Absensi & Ibadah</option>
                  <option value="Akademik">Tahfidz & Kitab</option>
                  <option value="Keuangan">SPP & E-Saku</option>
                  <option value="Kesehatan">Kesehatan & Poskestren</option>
                  <option value="Konsultasi">Konsultasi Santri</option>
                </select>
              </div>

              <span className="text-stone-400 text-[11px]">
                {santriPesan.length} Percakapan
              </span>
            </div>

            {/* List of Messages */}
            <div className="space-y-3">
              {santriPesan.map((pesan) => (
                <div
                  key={pesan.id}
                  onClick={() => tandaiPesanDibaca(pesan.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    !pesan.sudahDibaca 
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-xs' 
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                        {pesan.kategori}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900">
                        {pesan.judul}
                      </h4>
                      {!pesan.sudahDibaca && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <span className="text-stone-400 font-mono text-[11px]">{pesan.waktu}</span>
                  </div>

                  <p className="text-xs text-stone-700 mt-2.5 leading-relaxed whitespace-pre-line">
                    {pesan.pesan}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>Pengirim: <strong className="text-stone-800">{pesan.pengirim}</strong> ({pesan.pengirimRole})</span>
                    </div>
                    <span className="text-emerald-700 font-medium">Terkonfirmasi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Message Composer Box (Right Column) */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs h-fit space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Kirim Pesan / Konsultasi Langsung
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {activeRole === 'wali' 
                  ? 'Kirim pesan ke Musyrif Kamar atau Ustadz Pembimbing ananda.'
                  : 'Kirim notifikasi / pesan resmi ke orang tua santri.'}
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Kategori Pesan:
                </label>
                <select
                  value={kategoriInput}
                  onChange={(e) => setKategoriInput(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium text-stone-800 focus:outline-hidden"
                >
                  <option value="Konsultasi">Konsultasi Perkembangan Santri</option>
                  <option value="Akademik">Pertanyaan Tahfidz & Kitab</option>
                  <option value="Kesehatan">Kesehatan & Asrama</option>
                  <option value="Absensi">Konfirmasi Perizinan</option>
                  <option value="Keuangan">Konfirmasi Keuangan / SPP</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Judul / Topik:
                </label>
                <input
                  type="text"
                  value={judulInput}
                  onChange={(e) => setJudulInput(e.target.value)}
                  placeholder="Contoh: Menanyakan kondisi kesehatan ananda..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Isi Pesan:
                </label>
                <textarea
                  rows={4}
                  required
                  value={pesanInput}
                  onChange={(e) => setPesanInput(e.target.value)}
                  placeholder="Tuliskan pesan lengkap kepada pihak pesantren / wali..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-[11px] flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Pesan disimpan dengan enkripsi data dan terkirim langsung tanpa pihak ketiga.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pesan Sekarang</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: KALENDER & AGENDA AKADEMIK ================= */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              Kalender Akademik & Agenda Kepesantrenan 1448 H / 2026-2027
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Jadwal kegiatan belajar, imtihan, pengajian akbar, serta perizinan kunjungan wali santri
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agendaList.map((agenda) => (
                <div
                  key={agenda.id}
                  className="p-5 rounded-2xl border border-stone-200/90 hover:border-emerald-300 transition-all bg-stone-50/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                        {agenda.kategori.replace('_', ' ')}
                      </span>
                      {agenda.wajibWali && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                          Wajib Dihadiri Wali Santri
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-stone-900 mb-2">
                      {agenda.judul}
                    </h4>

                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      {agenda.deskripsi}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-stone-200/60 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      <span className="font-semibold text-stone-800">{agenda.tanggalMasehi}</span>
                      <span className="text-stone-400 font-serif">({agenda.tanggalHijriah})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{agenda.waktu}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span>{agenda.lokasi}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

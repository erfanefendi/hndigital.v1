import React, { useState } from 'react';
import { usePesantren } from '../../context/PesantrenContext';
import { TagihanSPP, TransaksiSaku } from '../../types/pesantren';
import { 
  CreditCard, 
  Wallet, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Copy, 
  Printer, 
  Plus, 
  Sliders, 
  Store, 
  Receipt, 
  ShieldCheck, 
  FileText,
  Building,
  Check
} from 'lucide-react';

export const KeuanganTab: React.FC = () => {
  const { 
    selectedSantri, 
    tagihanList, 
    transaksiSakuList, 
    bayarTagihan, 
    topUpSaku, 
    catatBelanjaSaku, 
    updateLimitHarian, 
    privacyMask, 
    activeRole,
    verifyPin
  } = usePesantren();

  const [subTab, setSubTab] = useState<'spp' | 'saku'>('spp');

  // SPP Modal states
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanSPP | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va_bsi' | 'va_mandiri' | 'transfer'>('qris');
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<TagihanSPP | null>(null);
  const [copiedVA, setCopiedVA] = useState<boolean>(false);

  // Top Up E-Saku Modal
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(250000);
  const [topUpMethod, setTopUpMethod] = useState<string>('QRIS Pesantren (BSI)');

  // Limit Setting Modal
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [newLimit, setNewLimit] = useState<number>(selectedSantri.limitHarian);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // POS Kasir Simulator (For Pengurus / Kasir Pondok)
  const [showKasirModal, setShowKasirModal] = useState<boolean>(false);
  const [kasirItem, setKasirItem] = useState<string>('Makan Siang & Buah Segar');
  const [kasirNominal, setKasirNominal] = useState<number>(15000);
  const [kasirKategori, setKasirKategori] = useState<'Kantin_Santri' | 'Koperasi_Pondok' | 'Laundry_Pondok' | 'Toko_Kitab'>('Kantin_Santri');
  const [kasirError, setKasirError] = useState<string>('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string>('');

  const santriTagihan = tagihanList.filter(t => t.santriId === selectedSantri.id);
  const santriTrx = transaksiSakuList.filter(t => t.santriId === selectedSantri.id);

  const pendingBills = santriTagihan.filter(t => t.status === 'Belum_Bayar');
  const paidBills = santriTagihan.filter(t => t.status === 'Lunas');

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySpent = santriTrx
    .filter(t => t.tanggal === todayStr && t.tipe === 'Debit')
    .reduce((acc, t) => acc + t.nominal, 0);

  const sisaLimitHariIni = Math.max(0, selectedSantri.limitHarian - todaySpent);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleProcessPayment = () => {
    if (!selectedTagihan) return;
    const res = bayarTagihan(selectedTagihan.id, paymentMethod === 'qris' ? 'QRIS Pesantren (BSI)' : 'Virtual Account BSI');
    setShowPayModal(false);
    
    // Find updated bill to show receipt
    const updatedBill = {
      ...selectedTagihan,
      status: 'Lunas' as const,
      tanggalBayar: new Date().toLocaleString('id-ID'),
      metodeBayar: paymentMethod === 'qris' ? 'QRIS Dinamis (BSI)' : 'BSI Virtual Account',
      nomorKuitansi: res.kuitansi,
      kodeTransaksi: `TRX-${Date.now().toString().slice(-8)}`
    };
    setActiveReceipt(updatedBill);
    setToastMessage(`Pembayaran berhasil! Kuitansi resmi ${res.kuitansi} telah diterbitkan.`);
  };

  const handleProcessTopUp = () => {
    topUpSaku(selectedSantri.id, topUpAmount, topUpMethod);
    setShowTopUpModal(false);
    setToastMessage(`Top-up sebesar Rp ${topUpAmount.toLocaleString('id-ID')} berhasil ditambahkan.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSaveLimit = () => {
    if (pinInput !== '123456') {
      setPinError('PIN salah! Masukkan PIN otorisasi default: 123456');
      return;
    }
    updateLimitHarian(selectedSantri.id, newLimit);
    setShowLimitModal(false);
    setPinInput('');
    setPinError('');
    setToastMessage(`Batas belanja harian santri berhasil diubah menjadi Rp ${newLimit.toLocaleString('id-ID')}/hari.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleProcessKasirDebit = () => {
    setKasirError('');
    const res = catatBelanjaSaku(selectedSantri.id, kasirItem, kasirNominal, kasirKategori, 'Kasir Terpadu Pondok');
    if (!res.success) {
      setKasirError(res.error || 'Gagal memproses transaksi');
      return;
    }
    setShowKasirModal(false);
    setToastMessage(`Transaksi kasir ${kasirItem} Rp ${kasirNominal.toLocaleString('id-ID')} berhasil didebit dari E-Saku santri.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="font-bold text-stone-500 hover:text-stone-800">✕</button>
        </div>
      )}

      {/* Subtab Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setSubTab('spp')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              subTab === 'spp'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pembayaran SPP & Administrasi
          </button>
          <button
            onClick={() => setSubTab('saku')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              subTab === 'saku'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Belanja Bulanan & E-Saku Santri
          </button>
        </div>

        {subTab === 'saku' && (
          <div className="flex items-center gap-2">
            {activeRole === 'pengurus' && (
              <button
                onClick={() => setShowKasirModal(true)}
                className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Simulasi Kasir Koperasi</span>
              </button>
            )}
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Top-Up Saldo E-Saku</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= SUBTAB 1: SPP & TAGIHAN PESANTREN ================= */}
      {subTab === 'spp' && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Total Tagihan Berjalan</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 block mt-1">
                {privacyMask ? 'Rp ••••••••' : `Rp ${pendingBills.reduce((acc, t) => acc + t.nominal, 0).toLocaleString('id-ID')}`}
              </span>
              <span className="text-xs text-amber-800 mt-1 block">
                {pendingBills.length > 0 ? `${pendingBills.length} Tagihan Menunggu Pembayaran` : 'Semua Tagihan Tertib'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Jatuh Tempo Terdekat</span>
              <span className="text-lg font-bold text-stone-800 block mt-1">
                {pendingBills.length > 0 ? pendingBills[0].jatuhTempo : 'Tidak Ada'}
              </span>
              <span className="text-xs text-stone-500 mt-1 block">
                Tanggal 10 setiap bulan hijriyah/masehi
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 block">Metode Pembayaran Resmi</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-semibold bg-stone-100 px-2 py-1 rounded text-stone-700">QRIS</span>
                <span className="text-[11px] font-semibold bg-emerald-50 px-2 py-1 rounded text-emerald-800 border border-emerald-200">BSI VA</span>
                <span className="text-[11px] font-semibold bg-stone-100 px-2 py-1 rounded text-stone-700">Mandiri VA</span>
                <span className="text-[11px] font-semibold bg-stone-100 px-2 py-1 rounded text-stone-700">BCA</span>
              </div>
            </div>
          </div>

          {/* Pending Bills Section */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center justify-between">
              <span>Tagihan Belum Lunas ({pendingBills.length})</span>
              <span className="text-xs font-normal text-stone-500">Pemberitahuan Otomatis ke Wali</span>
            </h3>

            {pendingBills.length > 0 ? (
              <div className="space-y-3">
                {pendingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          {bill.bulan}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900">{bill.namaTagihan}</h4>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        Jatuh Tempo: <strong className="text-stone-700">{bill.jatuhTempo}</strong> · Santri: {selectedSantri.nama} ({selectedSantri.nis})
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Nominal</span>
                        <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                          {privacyMask ? 'Rp •••••••' : `Rp ${bill.nominal.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTagihan(bill);
                          setShowPayModal(true);
                        }}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar Sekarang</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-stone-500 bg-stone-50 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-stone-700">Tidak ada tagihan yang tertunggak</p>
                <p className="text-[11px] text-stone-400">Jazakumullah khairan atas kedisiplinan wali santri</p>
              </div>
            )}
          </div>

          {/* Paid History Section */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
            <h3 className="text-sm font-bold text-stone-900 mb-3">
              Riwayat Pembayaran & Kuitansi Digital Resmi ({paidBills.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Bulan & Tagihan</th>
                    <th className="py-2.5 px-3">Nominal</th>
                    <th className="py-2.5 px-3">Tanggal Lunas</th>
                    <th className="py-2.5 px-3">Metode</th>
                    <th className="py-2.5 px-3">No. Kuitansi</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paidBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-stone-900">{bill.namaTagihan}</div>
                        <div className="text-stone-400 text-[11px]">{bill.bulan}</div>
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-bold text-stone-900 whitespace-nowrap">
                        {privacyMask ? 'Rp •••••••' : `Rp ${bill.nominal.toLocaleString('id-ID')}`}
                      </td>
                      <td className="py-3 px-3 text-stone-600 text-[11px] whitespace-nowrap">
                        {bill.tanggalBayar || '-'}
                      </td>
                      <td className="py-3 px-3 text-stone-700 whitespace-nowrap">
                        <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                          {bill.metodeBayar || 'Bank Transfer'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-800 font-medium text-[11px] whitespace-nowrap">
                        {bill.nomorKuitansi || '-'}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setActiveReceipt(bill)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Kuitansi PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: BELANJA BULANAN & E-SAKU SANTRI ================= */}
      {subTab === 'saku' && (
        <div className="space-y-6">
          {/* E-Saku Balance & Daily Limit Control Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Saldo Card */}
            <div className="bg-linear-to-br from-emerald-900 to-stone-900 text-white p-5 rounded-2xl border border-emerald-800 shadow-sm relative overflow-hidden">
              <span className="text-emerald-300 text-xs font-medium block">
                Dompet Digital E-Saku Santri
              </span>
              <div className="mt-2">
                <span className="text-3xl font-bold font-mono tabular-nums tracking-tight">
                  {privacyMask ? 'Rp •••••••' : `Rp ${selectedSantri.saldoSaku.toLocaleString('id-ID')}`}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-2">
                Digunakan untuk jajan di Kantin Barokah, Koperasi, Toko Kitab & Laundry Pesantren.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setShowTopUpModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Top-Up Saldo
                </button>
              </div>
            </div>

            {/* 2. Limit Harian & Kontrol Proteksi Wali */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Limit Belanja Harian
                  </span>
                  <button
                    onClick={() => {
                      setNewLimit(selectedSantri.limitHarian);
                      setShowLimitModal(true);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" /> Atur Limit
                  </button>
                </div>

                <div className="mt-2">
                  <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                    {privacyMask ? 'Rp ••••••' : `Rp ${selectedSantri.limitHarian.toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-xs text-stone-500 block">Maksimal pengeluaran per hari</span>
                </div>

                <div className="mt-3 text-xs space-y-1">
                  <div className="flex justify-between text-stone-600">
                    <span>Terpakai Hari Ini:</span>
                    <span className="font-mono tabular-nums font-semibold text-stone-900">
                      {privacyMask ? '••••' : `Rp ${todaySpent.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Sisa Limit Hari Ini:</span>
                    <span className="font-mono tabular-nums font-semibold text-emerald-800">
                      {privacyMask ? '••••' : `Rp ${sisaLimitHariIni.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden mt-3">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    todaySpent >= selectedSantri.limitHarian ? 'bg-red-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, (todaySpent / selectedSantri.limitHarian) * 100)}%` }}
                />
              </div>
            </div>

            {/* 3. Kartu Santri Digital & Keamanan PIN */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1">
                  Kartu Santri Nirsentuh (NFC/Barcode)
                </span>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-800 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    <QrCode className="w-7 h-7 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">{selectedSantri.nama}</span>
                    <span className="text-[11px] font-mono text-stone-500 block">NIS: {selectedSantri.nis}</span>
                    <span className="text-[10px] text-emerald-700 font-medium">Status Kartu: Aktif Terenkripsi</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 mt-2">
                Santri bertransaksi di koperasi menggunakan tap kartu NIS fisik. Notifikasi langsung terkirim ke wali santri.
              </p>
            </div>
          </div>

          {/* Riwayat Belanja Koperasi & Kantin Santri */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Riwayat Transaksi Belanja & Top-Up ({santriTrx.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Rincian pembelian santri di seluruh unit usaha Pondok Pesantren Hidayatun Najah
                </p>
              </div>
              <span className="text-xs text-stone-500">
                Pembaruan: <strong className="font-mono text-stone-700">Real-Time</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3">Waktu & Tanggal</th>
                    <th className="py-2.5 px-3">Item Belanja / Transaksi</th>
                    <th className="py-2.5 px-3">Unit / Kasir</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {santriTrx.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-stone-900">{trx.tanggal}</div>
                        <div className="text-stone-400 font-mono text-[11px]">{trx.waktu}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-stone-900">{trx.namaItem}</div>
                        <div className="text-stone-400 text-[11px]">{trx.catatan || '-'}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-stone-700">
                        {trx.kasir}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {trx.tipe === 'Debit' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                            <ArrowDownLeft className="w-3 h-3" /> Belanja (Debit)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3" /> Top-Up (Kredit)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap font-mono tabular-nums font-bold">
                        {privacyMask ? (
                          'Rp •••••'
                        ) : trx.tipe === 'Debit' ? (
                          <span className="text-red-700">-Rp {trx.nominal.toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-emerald-800">+Rp {trx.nominal.toLocaleString('id-ID')}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: BAYAR SPP DENGAN QRIS / VA ================= */}
      {showPayModal && selectedTagihan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Pembayaran SPP & Administrasi
              </h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Bill Summary */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Santri:</span>
                <span className="font-semibold text-stone-900">{selectedSantri.nama} ({selectedSantri.nis})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tagihan:</span>
                <span className="font-semibold text-stone-900">{selectedTagihan.namaTagihan}</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-stone-200">
                <span className="font-bold text-stone-800">Total Pembayaran:</span>
                <span className="font-bold font-mono text-emerald-800 text-base">
                  Rp {selectedTagihan.nominal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Select Method */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-stone-700 block">Pilih Saluran Pembayaran:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-emerald-700 bg-emerald-50/50 font-semibold text-emerald-950'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-800" />
                  <span>QRIS Nasional</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('va_bsi')}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    paymentMethod === 'va_bsi'
                      ? 'border-emerald-700 bg-emerald-50/50 font-semibold text-emerald-950'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Building className="w-4 h-4 text-emerald-800" />
                  <span>Virtual Account BSI</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === 'qris' ? (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-2">
                <div className="w-40 h-40 bg-white p-2 mx-auto rounded-xl border border-stone-300 shadow-xs flex items-center justify-center">
                  {/* Clean SVG QR Mock */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900 fill-current">
                    <rect x="5" y="5" width="25" height="25" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="13" y="13" width="9" height="9" />
                    <rect x="70" y="5" width="25" height="25" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="78" y="13" width="9" height="9" />
                    <rect x="5" y="70" width="25" height="25" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="13" y="78" width="9" height="9" />
                    <rect x="35" y="10" width="5" height="15" />
                    <rect x="45" y="5" width="10" height="8" />
                    <rect x="40" y="25" width="20" height="6" />
                    <rect x="10" y="40" width="12" height="10" />
                    <rect x="25" y="38" width="10" height="15" />
                    <rect x="40" y="40" width="20" height="20" />
                    <rect x="65" y="40" width="15" height="8" />
                    <rect x="85" y="35" width="10" height="15" />
                    <rect x="35" y="70" width="8" height="25" />
                    <rect x="50" y="68" width="15" height="12" />
                    <rect x="70" y="70" width="25" height="8" />
                    <rect x="75" y="82" width="15" height="12" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-stone-800 block">
                  PP HIDAYATUN NAJAH OFFICIAL
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Pindai menggunakan BCA, Mandiri Livin, BSI Mobile, GoPay, OVO, atau ShopeePay
                </span>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <span className="text-stone-500 block">Nomor Virtual Account Bank Syariah Indonesia:</span>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-stone-300 font-mono text-sm font-bold text-stone-900">
                  <span>8821 00{selectedSantri.nis}</span>
                  <button
                    onClick={() => handleCopy(`882100${selectedSantri.nis}`)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-sans font-medium"
                  >
                    {copiedVA ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVA ? 'Disalin' : 'Salin VA'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Nama Penerima: <strong>HN - {selectedSantri.nama}</strong>
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                className="px-5 py-2 text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasikan Bayar Berhasil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KUITANSI RESMI DIGITAL (CETAK PDF) ================= */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-bold text-stone-900">
                  Kuitansi Pembayaran Resmi Digital
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Dokumen
                </button>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="text-stone-400 hover:text-stone-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Pesantren Letterhead / Kuitansi Format */}
            <div className="p-5 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/40 text-xs space-y-4">
              {/* Kop Pesantren */}
              <div className="text-center pb-3 border-b border-stone-300">
                <h2 className="text-base font-bold text-emerald-900 uppercase tracking-wide">
                  Pondok Pesantren Hidayatun Najah
                </h2>
                <p className="text-[11px] text-stone-600">
                  Jl. Pesantren No. 09, Jawa Timur · Telp: (031) 8876-5432 · Rek. BSI: 7188-2991-00
                </p>
                <span className="inline-block mt-1 font-mono text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  BUKTI KUITANSI PEMBAYARAN SAH (LUNAS)
                </span>
              </div>

              {/* Transaction Metadata */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-stone-500 block">No. Kuitansi:</span>
                  <span className="font-mono font-bold text-stone-900">{activeReceipt.nomorKuitansi}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block">Tanggal Bayar:</span>
                  <span className="font-mono font-bold text-stone-900">{activeReceipt.tanggalBayar}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Diterima dari (Wali):</span>
                  <span className="font-bold text-stone-900">{selectedSantri.waliNama}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block">Untuk Santri:</span>
                  <span className="font-bold text-stone-900">{selectedSantri.nama} (NIS: {selectedSantri.nis})</span>
                </div>
              </div>

              {/* Items Paid */}
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <div className="flex justify-between items-center text-xs font-semibold text-stone-900 pb-2 border-b border-stone-100">
                  <span>Rincian Pembayaran</span>
                  <span>Jumlah (Rp)</span>
                </div>
                <div className="flex justify-between items-center py-2 text-xs">
                  <div>
                    <span className="font-medium text-stone-800">{activeReceipt.namaTagihan}</span>
                    <span className="text-[11px] text-stone-500 block">Bulan {activeReceipt.bulan} · Metode: {activeReceipt.metodeBayar}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    Rp {activeReceipt.nominal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs font-bold text-emerald-900">
                  <span>TOTAL LUNAS</span>
                  <span className="font-mono text-sm">Rp {activeReceipt.nominal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="flex items-center justify-between pt-3 text-[11px] text-stone-600">
                <div className="text-center">
                  <span className="block">Wali Santri</span>
                  <div className="h-10 flex items-center justify-center italic text-stone-400">
                    (Terverifikasi Digital)
                  </div>
                  <span className="font-bold text-stone-800">{selectedSantri.waliNama}</span>
                </div>

                <div className="text-center">
                  <span className="block">Bendahara Pondok Pesantren</span>
                  <div className="h-10 flex items-center justify-center font-serif text-emerald-800 font-bold text-xs">
                    [STEMPEL SAH HN]
                  </div>
                  <span className="font-bold text-stone-800">Ust. H. Nurul Huda, M.Ag.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TOP-UP SALDO E-SAKU ================= */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Top-Up Saldo E-Saku Santri
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <span className="text-stone-500 block mb-1">Pilih Nominal Cepat:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[50000, 100000, 250000, 500000].map((nom) => (
                    <button
                      key={nom}
                      type="button"
                      onClick={() => setTopUpAmount(nom)}
                      className={`p-2.5 rounded-xl border text-center font-mono font-bold transition-all ${
                        topUpAmount === nom
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      Rp {nom.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Atau Masukkan Nominal Lain (Rp):</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Math.max(10000, Number(e.target.value)))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-mono text-sm font-bold text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Metode Top-Up:</label>
                <select
                  value={topUpMethod}
                  onChange={(e) => setTopUpMethod(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-hidden"
                >
                  <option value="QRIS Pesantren (BSI)">QRIS Pesantren Hidayatun Najah</option>
                  <option value="BSI Mobile Virtual Account">BSI Mobile Virtual Account (Instant)</option>
                  <option value="Mandiri Livin Virtual Account">Mandiri Livin VA</option>
                  <option value="BCA Transfer">BCA Transfer Antar Bank</option>
                </select>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-[11px]">
                Saldo akan langsung masuk ke kartu saku santri secara real-time dan siap digunakan untuk makan, minum, dan kitab.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessTopUp}
                className="px-5 py-2 text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl text-xs font-semibold shadow-xs"
              >
                Konfirmasi Top-Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ATUR LIMIT HARIAN (PROTEKSI PIN) ================= */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Atur Limit Belanja Harian</span>
              </h3>
              <button
                onClick={() => setShowLimitModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-stone-600">
                Tentukan batas maksimal uang jajan per hari untuk menjaga santri hidup hemat dan teratur di pesantren.
              </p>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Batas Harian Baru (Rp/hari):
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {[15000, 25000, 35000].map((lim) => (
                    <button
                      key={lim}
                      type="button"
                      onClick={() => setNewLimit(lim)}
                      className={`p-2 rounded-lg border font-mono text-center font-bold ${
                        newLimit === lim ? 'bg-emerald-50 border-emerald-700 text-emerald-900' : 'border-stone-200'
                      }`}
                    >
                      Rp {(lim/1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono font-bold text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">
                  Masukkan PIN Otorisasi Wali Santri (6 digit):
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="PIN Default: 123456"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-center tracking-widest font-mono text-base font-bold focus:outline-hidden"
                />
                {pinError && <p className="text-red-600 text-[11px] mt-1">{pinError}</p>}
                <p className="text-stone-400 text-[10px] mt-1">Gunakan PIN default: 123456</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveLimit}
                className="px-5 py-2 text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl text-xs font-semibold shadow-xs"
              >
                Simpan Limit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KASIR KOPERASI / KANTIN PONDOK ================= */}
      {showKasirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-800" />
                <span>Simulasi Kasir Koperasi / Kantin Pondok</span>
              </h3>
              <button
                onClick={() => setShowKasirModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block">Santri Pembeli:</span>
                <span className="font-bold text-stone-900 block">{selectedSantri.nama} (NIS: {selectedSantri.nis})</span>
                <div className="flex justify-between text-[11px] text-stone-600 mt-1">
                  <span>Saldo: Rp {selectedSantri.saldoSaku.toLocaleString('id-ID')}</span>
                  <span>Sisa Limit Hari Ini: Rp {sisaLimitHariIni.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Unit Transaksi:</label>
                <select
                  value={kasirKategori}
                  onChange={(e) => setKasirKategori(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium text-stone-800 focus:outline-hidden"
                >
                  <option value="Kantin_Santri">Kantin Barokah (Makanan/Minuman)</option>
                  <option value="Koperasi_Pondok">Koperasi Santri (Alat Tulis/Kebutuhan Asrama)</option>
                  <option value="Toko_Kitab">Toko Kitab Maktabah Najah</option>
                  <option value="Laundry_Pondok">Unit Laundry Pesantren</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Nama Barang / Belanjaan:</label>
                <input
                  type="text"
                  value={kasirItem}
                  onChange={(e) => setKasirItem(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Nominal Transaksi (Rp):</label>
                <input
                  type="number"
                  value={kasirNominal}
                  onChange={(e) => setKasirNominal(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono font-bold text-stone-900 focus:outline-hidden"
                />
              </div>

              {kasirError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[11px] flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{kasirError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKasirModal(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessKasirDebit}
                className="px-5 py-2 text-white bg-stone-900 hover:bg-stone-800 rounded-xl text-xs font-semibold shadow-xs"
              >
                Debit Saldo Santri
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

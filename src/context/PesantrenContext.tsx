import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Santri,
  AbsensiRecord,
  TagihanSPP,
  TransaksiSaku,
  SetoranTahfidz,
  RaportSantri,
  PesanNotifikasi,
  AgendaPondok,
  AuditSecurityLog,
  StatusAbsensi,
  SesiAbsensi
} from '../types/pesantren';
import {
  INITIAL_SANTRI_LIST,
  INITIAL_ABSENSI,
  INITIAL_TAGIHAN,
  INITIAL_TRANSAKSI_SAKU,
  INITIAL_SETORAN_TAHFIDZ,
  INITIAL_RAPORT_SANTRI,
  INITIAL_PESAN_NOTIFIKASI,
  INITIAL_AGENDA,
  INITIAL_SECURITY_LOGS
} from '../data/mockData';

interface PesantrenContextType {
  activeRole: 'wali' | 'pengurus';
  setActiveRole: (role: 'wali' | 'pengurus') => void;
  santriList: Santri[];
  selectedSantri: Santri;
  setSelectedSantriId: (id: string) => void;
  absensiList: AbsensiRecord[];
  tagihanList: TagihanSPP[];
  transaksiSakuList: TransaksiSaku[];
  setoranTahfidzList: SetoranTahfidz[];
  raport: RaportSantri;
  pesanList: PesanNotifikasi[];
  agendaList: AgendaPondok[];
  securityLogs: AuditSecurityLog[];
  isSyncing: boolean;
  lastSyncTime: string;
  privacyMask: boolean;
  togglePrivacyMask: () => void;
  pinVerified: boolean;
  verifyPin: (pin: string) => boolean;
  resetPinVerification: () => void;
  forceSyncNow: () => void;
  
  // Actions
  recordAbsensi: (data: { santriId: string; sesi: SesiAbsensi; status: StatusAbsensi; keterangan?: string; petugas: string }) => void;
  bayarTagihan: (tagihanId: string, metode: string) => { success: boolean; kuitansi: string };
  topUpSaku: (santriId: string, nominal: number, metode: string) => void;
  catatBelanjaSaku: (santriId: string, item: string, nominal: number, kategori: 'Koperasi_Pondok' | 'Kantin_Santri' | 'Laundry_Pondok' | 'Toko_Kitab', kasir: string) => { success: boolean; error?: string };
  updateLimitHarian: (santriId: string, limit: number) => void;
  tambahSetoranTahfidz: (setoran: Omit<SetoranTahfidz, 'id'>) => void;
  kirimPesan: (judul: string, pesan: string, kategori: 'Absensi' | 'Keuangan' | 'Akademik' | 'Kesehatan' | 'Konsultasi', roleSender?: 'Musyrif Kamar' | 'Wali Kelas' | 'Bagian Keuangan' | 'Pengasuh' | 'Wali Santri') => void;
  tandaiPesanDibaca: (id: string) => void;
}

const PesantrenContext = createContext<PesantrenContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SANTRI: 'hn_santri_v1',
  SELECTED_ID: 'hn_selected_santri_v1',
  ROLE: 'hn_active_role_v1',
  ABSENSI: 'hn_absensi_v1',
  TAGIHAN: 'hn_tagihan_v1',
  TRANSAKSI: 'hn_transaksi_saku_v1',
  TAHFIDZ: 'hn_tahfidz_v1',
  PESAN: 'hn_pesan_v1',
  LOGS: 'hn_security_logs_v1'
};

export const PesantrenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<'wali' | 'pengurus'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as 'wali' | 'pengurus') || 'wali';
  });

  const [santriList, setSantriList] = useState<Santri[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SANTRI);
    return saved ? JSON.parse(saved) : INITIAL_SANTRI_LIST;
  });

  const [selectedSantriId, setSelectedSantriIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_ID) || INITIAL_SANTRI_LIST[0].id;
  });

  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ABSENSI);
    return saved ? JSON.parse(saved) : INITIAL_ABSENSI;
  });

  const [tagihanList, setTagihanList] = useState<TagihanSPP[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TAGIHAN);
    return saved ? JSON.parse(saved) : INITIAL_TAGIHAN;
  });

  const [transaksiSakuList, setTransaksiSakuList] = useState<TransaksiSaku[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSAKSI);
    return saved ? JSON.parse(saved) : INITIAL_TRANSAKSI_SAKU;
  });

  const [setoranTahfidzList, setSetoranTahfidzList] = useState<SetoranTahfidz[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TAHFIDZ);
    return saved ? JSON.parse(saved) : INITIAL_SETORAN_TAHFIDZ;
  });

  const [pesanList, setPesanList] = useState<PesanNotifikasi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PESAN);
    return saved ? JSON.parse(saved) : INITIAL_PESAN_NOTIFIKASI;
  });

  const [securityLogs, setSecurityLogs] = useState<AuditSecurityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_LOGS;
  });

  const [agendaList] = useState<AgendaPondok[]>(INITIAL_AGENDA);
  const [raport] = useState<RaportSantri>(INITIAL_RAPORT_SANTRI);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);
  const [pinVerified, setPinVerified] = useState<boolean>(false);

  // Broadcast channel for cross-tab / device sync simulation
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('pesantren_hidayatun_najah_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_ALL') {
          // Reload from storage
          const savedSantri = localStorage.getItem(STORAGE_KEYS.SANTRI);
          if (savedSantri) setSantriList(JSON.parse(savedSantri));

          const savedAbsensi = localStorage.getItem(STORAGE_KEYS.ABSENSI);
          if (savedAbsensi) setAbsensiList(JSON.parse(savedAbsensi));

          const savedTagihan = localStorage.getItem(STORAGE_KEYS.TAGIHAN);
          if (savedTagihan) setTagihanList(JSON.parse(savedTagihan));

          const savedTrx = localStorage.getItem(STORAGE_KEYS.TRANSAKSI);
          if (savedTrx) setTransaksiSakuList(JSON.parse(savedTrx));

          const savedTahfidz = localStorage.getItem(STORAGE_KEYS.TAHFIDZ);
          if (savedTahfidz) setSetoranTahfidzList(JSON.parse(savedTahfidz));

          const savedPesan = localStorage.getItem(STORAGE_KEYS.PESAN);
          if (savedPesan) setPesanList(JSON.parse(savedPesan));

          setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
        }
      };
    } catch {
      // BroadcastChannel not available in fallback
    }

    return () => {
      channel?.close();
    };
  }, []);

  const broadcastSync = useCallback(() => {
    try {
      const channel = new BroadcastChannel('pesantren_hidayatun_najah_channel');
      channel.postMessage({ type: 'SYNC_ALL', timestamp: Date.now() });
      channel.close();
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = useCallback((key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }, []);

  const addSecurityLog = useCallback((aktivitas: string, status: 'Berhasil' | 'Verifikasi PIN' | 'Enkripsi Data' = 'Berhasil') => {
    const newLog: AuditSecurityLog = {
      id: `SEC-${Date.now()}`,
      waktu: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
      aktivitas,
      perangkat: 'Perangkat Resmi Terverifikasi',
      ipMasked: '180.252.***.*** (Terenkripsi SSL)',
      status
    };
    setSecurityLogs(prev => {
      const updated = [newLog, ...prev.slice(0, 15)];
      saveToStorage(STORAGE_KEYS.LOGS, updated);
      return updated;
    });
  }, [saveToStorage]);

  const forceSyncNow = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');
      addSecurityLog('Sinkronisasi Data Real-Time Berhasil', 'Enkripsi Data');
      broadcastSync();
    }, 600);
  }, [addSecurityLog, broadcastSync]);

  const setActiveRole = (role: 'wali' | 'pengurus') => {
    setActiveRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    addSecurityLog(`Beralih Mode Akses ke ${role === 'wali' ? 'Wali Santri' : 'Pengurus/Asatidz Pesantren'}`);
  };

  const setSelectedSantriId = (id: string) => {
    setSelectedSantriIdState(id);
    localStorage.setItem(STORAGE_KEYS.SELECTED_ID, id);
  };

  const selectedSantri = santriList.find(s => s.id === selectedSantriId) || santriList[0];

  const togglePrivacyMask = () => setPrivacyMask(prev => !prev);

  const verifyPin = (pin: string) => {
    // Default demo PIN: 123456
    if (pin === '123456' || pin === '654321') {
      setPinVerified(true);
      addSecurityLog('Verifikasi PIN Otorisasi 6-Digit Diterima', 'Verifikasi PIN');
      return true;
    }
    return false;
  };

  const resetPinVerification = () => setPinVerified(false);

  // Record Absensi
  const recordAbsensi = (data: { santriId: string; sesi: SesiAbsensi; status: StatusAbsensi; keterangan?: string; petugas: string }) => {
    const s = santriList.find(item => item.id === data.santriId) || selectedSantri;
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const todayStr = new Date().toISOString().split('T')[0];

    const newAbsensi: AbsensiRecord = {
      id: `ABS-${Date.now()}`,
      santriId: data.santriId,
      santriNama: s.nama,
      tanggal: todayStr,
      sesi: data.sesi,
      status: data.status,
      waktu: nowStr,
      keterangan: data.keterangan || `Presensi dicatat oleh ${data.petugas}`,
      petugas: data.petugas
    };

    const updatedAbsensi = [newAbsensi, ...absensiList];
    setAbsensiList(updatedAbsensi);
    saveToStorage(STORAGE_KEYS.ABSENSI, updatedAbsensi);

    // Auto-create notification for parents
    const sesiLabel = data.sesi.replace('_', ' ');
    const newPesan: PesanNotifikasi = {
      id: `MSG-${Date.now()}`,
      santriId: data.santriId,
      pengirim: data.petugas,
      pengirimRole: 'Musyrif Kamar',
      judul: `Status Kehadiran: ${sesiLabel} (${data.status})`,
      pesan: `Pemberitahuan resmi: Ananda ${s.nama} tercatat ${data.status.toUpperCase()} pada sesi ${sesiLabel} hari ini (${nowStr}). ${data.keterangan ? 'Catatan: ' + data.keterangan : ''}`,
      waktu: 'Baru saja',
      kategori: 'Absensi',
      sudahDibaca: false
    };

    const updatedPesan = [newPesan, ...pesanList];
    setPesanList(updatedPesan);
    saveToStorage(STORAGE_KEYS.PESAN, updatedPesan);

    addSecurityLog(`Input Absensi Santri: ${s.nama} (${data.sesi} - ${data.status})`);
    broadcastSync();
  };

  // Payment
  const bayarTagihan = (tagihanId: string, metode: string) => {
    const target = tagihanList.find(t => t.id === tagihanId);
    if (!target) return { success: false, kuitansi: '' };

    const receiptNo = `KWT/HN/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const updated = tagihanList.map(t => {
      if (t.id === tagihanId) {
        return {
          ...t,
          status: 'Lunas' as const,
          tanggalBayar: nowStr,
          metodeBayar: metode,
          kodeTransaksi: `TRX-HN-${Date.now().toString().slice(-8)}`,
          nomorKuitansi: receiptNo
        };
      }
      return t;
    });

    setTagihanList(updated);
    saveToStorage(STORAGE_KEYS.TAGIHAN, updated);

    // Notification for successful payment
    const newPesan: PesanNotifikasi = {
      id: `MSG-${Date.now()}`,
      santriId: target.santriId,
      pengirim: 'Biro Keuangan Pondok',
      pengirimRole: 'Bagian Keuangan',
      judul: `Kuitansi Resmi: Pembayaran ${target.namaTagihan} LUNAS`,
      pesan: `Alhamdulillah, pembayaran sebesar Rp ${target.nominal.toLocaleString('id-ID')} via ${metode} telah berhasil diverifikasi. Nomor Kuitansi: ${receiptNo}. Syukran jazakumullah khairan.`,
      waktu: 'Baru saja',
      kategori: 'Keuangan',
      sudahDibaca: false
    };

    const updatedPesan = [newPesan, ...pesanList];
    setPesanList(updatedPesan);
    saveToStorage(STORAGE_KEYS.PESAN, updatedPesan);

    addSecurityLog(`Pembayaran Lunas: ${target.namaTagihan} (No: ${receiptNo})`, 'Verifikasi PIN');
    broadcastSync();

    return { success: true, kuitansi: receiptNo };
  };

  // Top Up Saku
  const topUpSaku = (santriId: string, nominal: number, metode: string) => {
    const nowStr = new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB';
    
    // Update santri balance
    const updatedSantri = santriList.map(s => {
      if (s.id === santriId) {
        return { ...s, saldoSaku: s.saldoSaku + nominal };
      }
      return s;
    });
    setSantriList(updatedSantri);
    saveToStorage(STORAGE_KEYS.SANTRI, updatedSantri);

    // Record transaction
    const newTrx: TransaksiSaku = {
      id: `TRX-TOPUP-${Date.now()}`,
      santriId,
      tanggal: new Date().toISOString().split('T')[0],
      waktu: nowStr,
      kategori: 'Top_Up_Wali',
      namaItem: `Top-Up Uang Saku Bulanan via ${metode}`,
      nominal,
      tipe: 'Kredit',
      kasir: 'Sistem Pembayaran Wali Santri',
      catatan: 'Dana langsung masuk ke Kartu E-Saku Santri'
    };
    const updatedTrx = [newTrx, ...transaksiSakuList];
    setTransaksiSakuList(updatedTrx);
    saveToStorage(STORAGE_KEYS.TRANSAKSI, updatedTrx);

    // Add alert
    const newPesan: PesanNotifikasi = {
      id: `MSG-${Date.now()}`,
      santriId,
      pengirim: 'Sistem E-Saku Santri',
      pengirimRole: 'Bagian Keuangan',
      judul: 'Saldo E-Saku Santri Berhasil Ditambahkan',
      pesan: `Top-up sebesar Rp ${nominal.toLocaleString('id-ID')} via ${metode} telah berhasil. Saldo saat ini siap digunakan untuk kebutuhan di kantin dan koperasi santri.`,
      waktu: 'Baru saja',
      kategori: 'Keuangan',
      sudahDibaca: false
    };
    const updatedPesan = [newPesan, ...pesanList];
    setPesanList(updatedPesan);
    saveToStorage(STORAGE_KEYS.PESAN, updatedPesan);

    addSecurityLog(`Top-Up E-Saku Santri Rp ${nominal.toLocaleString('id-ID')} (${metode})`);
    broadcastSync();
  };

  // Record Belanja / Spend at Canteen/Koperasi
  const catatBelanjaSaku = (santriId: string, item: string, nominal: number, kategori: 'Koperasi_Pondok' | 'Kantin_Santri' | 'Laundry_Pondok' | 'Toko_Kitab', kasir: string) => {
    const s = santriList.find(item => item.id === santriId);
    if (!s) return { success: false, error: 'Santri tidak ditemukan' };

    if (s.saldoSaku < nominal) {
      return { success: false, error: 'Saldo E-Saku tidak mencukupi' };
    }

    // Check today's spending against daily limit
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDebits = transaksiSakuList
      .filter(t => t.santriId === santriId && t.tanggal === todayStr && t.tipe === 'Debit')
      .reduce((acc, curr) => acc + curr.nominal, 0);

    if (todayDebits + nominal > s.limitHarian) {
      return {
        success: false,
        error: `Melebihi batas jajan harian yang ditentukan wali santri (Maksimal Rp ${s.limitHarian.toLocaleString('id-ID')}/hari. Terpakai hari ini: Rp ${todayDebits.toLocaleString('id-ID')})`
      };
    }

    // Deduct
    const updatedSantri = santriList.map(item => {
      if (item.id === santriId) {
        return { ...item, saldoSaku: item.saldoSaku - nominal };
      }
      return item;
    });
    setSantriList(updatedSantri);
    saveToStorage(STORAGE_KEYS.SANTRI, updatedSantri);

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newTrx: TransaksiSaku = {
      id: `TRX-${Date.now()}`,
      santriId,
      tanggal: todayStr,
      waktu: nowStr,
      kategori,
      namaItem: item,
      nominal,
      tipe: 'Debit',
      kasir,
      catatan: 'Pembayaran nirsentuh / tap NIS'
    };
    const updatedTrx = [newTrx, ...transaksiSakuList];
    setTransaksiSakuList(updatedTrx);
    saveToStorage(STORAGE_KEYS.TRANSAKSI, updatedTrx);

    // If remaining balance is low, notify parent
    const sisa = s.saldoSaku - nominal;
    if (sisa <= 30000) {
      const lowBalMsg: PesanNotifikasi = {
        id: `MSG-${Date.now()}`,
        santriId,
        pengirim: 'Notifikasi Otomatis Dompet Santri',
        pengirimRole: 'Bagian Keuangan',
        judul: 'Peringatan: Saldo E-Saku Santri Menipis',
        pesan: `Saldo belanja santri Ananda ${s.nama} tersisa Rp ${sisa.toLocaleString('id-ID')}. Mohon pertimbangkan untuk melakukan top-up agar kebutuhan harian tetap terpenuhi.`,
        waktu: 'Baru saja',
        kategori: 'Keuangan',
        sudahDibaca: false
      };
      const updatedPesan = [lowBalMsg, ...pesanList];
      setPesanList(updatedPesan);
      saveToStorage(STORAGE_KEYS.PESAN, updatedPesan);
    }

    addSecurityLog(`Transaksi Belanja Santri: ${item} (Rp ${nominal.toLocaleString('id-ID')})`);
    broadcastSync();
    return { success: true };
  };

  // Update Daily Spending Limit
  const updateLimitHarian = (santriId: string, limit: number) => {
    const updated = santriList.map(s => {
      if (s.id === santriId) {
        return { ...s, limitHarian: limit };
      }
      return s;
    });
    setSantriList(updated);
    saveToStorage(STORAGE_KEYS.SANTRI, updated);
    addSecurityLog(`Wali Mengubah Limit Belanja Santri ke Rp ${limit.toLocaleString('id-ID')}/hari`, 'Verifikasi PIN');
    broadcastSync();
  };

  // Add Setoran Tahfidz
  const tambahSetoranTahfidz = (data: Omit<SetoranTahfidz, 'id'>) => {
    const newSetoran: SetoranTahfidz = {
      ...data,
      id: `SET-${Date.now()}`
    };
    const updated = [newSetoran, ...setoranTahfidzList];
    setSetoranTahfidzList(updated);
    saveToStorage(STORAGE_KEYS.TAHFIDZ, updated);

    // Update Santri Capaian Juz if Ziyadah
    const s = santriList.find(item => item.id === data.santriId);
    if (s && data.tipe === 'Ziyadah' && data.juz > s.capaianJuz) {
      const updatedSantri = santriList.map(item => {
        if (item.id === data.santriId) {
          return { ...item, capaianJuz: Number(data.juz.toFixed(1)) };
        }
        return item;
      });
      setSantriList(updatedSantri);
      saveToStorage(STORAGE_KEYS.SANTRI, updatedSantri);
    }

    // Notify Wali
    const newMsg: PesanNotifikasi = {
      id: `MSG-${Date.now()}`,
      santriId: data.santriId,
      pengirim: data.penguji,
      pengirimRole: 'Musyrif Kamar',
      judul: `Setoran Tahfidz: Surat ${data.surat} (${data.tipe})`,
      pesan: `Alhamdulillah, setoran ${data.tipe} Ananda untuk Surat ${data.surat} ${data.ayat} telah selesai dengan nilai ${data.nilai}. Catatan ustadz: "${data.catatan}"`,
      waktu: 'Baru saja',
      kategori: 'Akademik',
      sudahDibaca: false
    };
    const updatedPesan = [newMsg, ...pesanList];
    setPesanList(updatedPesan);
    saveToStorage(STORAGE_KEYS.PESAN, updatedPesan);

    addSecurityLog(`Input Nilai Tahfidz: Surat ${data.surat} (${data.nilai})`);
    broadcastSync();
  };

  // Direct messaging
  const kirimPesan = (
    judul: string,
    pesan: string,
    kategori: 'Absensi' | 'Keuangan' | 'Akademik' | 'Kesehatan' | 'Konsultasi',
    roleSender: 'Musyrif Kamar' | 'Wali Kelas' | 'Bagian Keuangan' | 'Pengasuh' | 'Wali Santri' = 'Wali Santri'
  ) => {
    const newPesan: PesanNotifikasi = {
      id: `MSG-${Date.now()}`,
      santriId: selectedSantri.id,
      pengirim: roleSender === 'Wali Santri' ? selectedSantri.waliNama : 'Ustadz Pembimbing',
      pengirimRole: roleSender,
      judul,
      pesan,
      waktu: 'Baru saja',
      kategori,
      sudahDibaca: roleSender === 'Wali Santri',
      isDirectChat: true
    };
    const updated = [newPesan, ...pesanList];
    setPesanList(updated);
    saveToStorage(STORAGE_KEYS.PESAN, updated);
    addSecurityLog(`Pesan Langsung Terkirim: ${judul} (${roleSender})`);
    broadcastSync();
  };

  const tandaiPesanDibaca = (id: string) => {
    const updated = pesanList.map(p => p.id === id ? { ...p, sudahDibaca: true } : p);
    setPesanList(updated);
    saveToStorage(STORAGE_KEYS.PESAN, updated);
  };

  return (
    <PesantrenContext.Provider
      value={{
        activeRole,
        setActiveRole,
        santriList,
        selectedSantri,
        setSelectedSantriId,
        absensiList,
        tagihanList,
        transaksiSakuList,
        setoranTahfidzList,
        raport,
        pesanList,
        agendaList,
        securityLogs,
        isSyncing,
        lastSyncTime,
        privacyMask,
        togglePrivacyMask,
        pinVerified,
        verifyPin,
        resetPinVerification,
        forceSyncNow,
        recordAbsensi,
        bayarTagihan,
        topUpSaku,
        catatBelanjaSaku,
        updateLimitHarian,
        tambahSetoranTahfidz,
        kirimPesan,
        tandaiPesanDibaca
      }}
    >
      {children}
    </PesantrenContext.Provider>
  );
};

export const usePesantren = () => {
  const context = useContext(PesantrenContext);
  if (!context) {
    throw new Error('usePesantren must be used within a PesantrenProvider');
  }
  return context;
};

export interface Santri {
  id: string;
  nis: string;
  nama: string;
  panggilan: string;
  kamar: string;
  kelasFormal: string;
  tingkatDiniyah: string;
  halaqahTahfidz: string;
  musyrifKamar: string;
  musyrifKontak: string;
  waliNama: string;
  waliHp: string;
  waliEmail: string;
  avatarUrl: string;
  saldoSaku: number;
  limitHarian: number;
  statusAktif: boolean;
  tanggalMasuk: string;
  targetHafalan: number; // e.g. 30 juz
  capaianJuz: number; // e.g. 14.5
}

export type SesiAbsensi = 'Subuh' | 'Tahfidz_Pagi' | 'Madrasah' | 'Kajian_Kitab' | 'Isya_Malam';
export type StatusAbsensi = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface AbsensiRecord {
  id: string;
  santriId: string;
  santriNama: string;
  tanggal: string; // YYYY-MM-DD
  sesi: SesiAbsensi;
  status: StatusAbsensi;
  waktu: string;
  keterangan: string;
  petugas: string;
}

export type JenisTagihan = 'SPP_Bulanan' | 'Uang_Makan' | 'Ujian_Imtihan' | 'Kitab_Pondok' | 'Kesehatan';
export type StatusTagihan = 'Lunas' | 'Belum_Bayar' | 'Menunggu_Verifikasi';

export interface TagihanSPP {
  id: string;
  santriId: string;
  bulan: string;
  jenis: JenisTagihan;
  namaTagihan: string;
  nominal: number;
  status: StatusTagihan;
  jatuhTempo: string;
  tanggalBayar?: string;
  metodeBayar?: string;
  kodeTransaksi?: string;
  nomorKuitansi?: string;
  buktiUrl?: string;
}

export interface TransaksiSaku {
  id: string;
  santriId: string;
  tanggal: string;
  waktu: string;
  kategori: 'Koperasi_Pondok' | 'Kantin_Santri' | 'Laundry_Pondok' | 'Toko_Kitab' | 'Top_Up_Wali';
  namaItem: string;
  nominal: number;
  tipe: 'Debit' | 'Kredit';
  kasir: string;
  catatan?: string;
}

export interface SetoranTahfidz {
  id: string;
  santriId: string;
  tanggal: string;
  surat: string;
  ayat: string;
  juz: number;
  tipe: 'Ziyadah' | 'Murajaah';
  nilai: 'A (Mumtaz)' | 'B+ (Jayyid Jiddan)' | 'B (Jayyid)' | 'C (Maqbul)';
  kelancaran: number; // 0 - 100
  tajwid: number;
  makhorij: number;
  catatan: string;
  penguji: string;
}

export interface NilaiKitab {
  namaKitab: string;
  bidang: string;
  pengampu: string;
  nilaiTeori: number;
  nilaiPraktik: number;
  predikat: string;
  catatan: string;
}

export interface RaportSantri {
  santriId: string;
  semester: string;
  tahunAjaran: string;
  hijriyah: string;
  kitab: NilaiKitab[];
  akhlak: {
    kedisiplinan: string;
    kebersihan: string;
    sholatJamaah: string;
    adabSopanSantun: string;
    kemandirian: string;
  };
  peringkatKelas: number;
  totalSantriKelas: number;
  catatanPengasuh: string;
  catatanWaliKelas: string;
  tanggalTerbit: string;
}

export interface PesanNotifikasi {
  id: string;
  santriId: string;
  pengirim: string;
  pengirimRole: 'Musyrif Kamar' | 'Wali Kelas' | 'Bagian Keuangan' | 'Pengasuh' | 'Wali Santri';
  judul: string;
  pesan: string;
  waktu: string;
  kategori: 'Absensi' | 'Keuangan' | 'Akademik' | 'Kesehatan' | 'Konsultasi';
  sudahDibaca: boolean;
  isDirectChat?: boolean;
}

export interface AgendaPondok {
  id: string;
  judul: string;
  tanggalMasehi: string;
  tanggalHijriah: string;
  waktu: string;
  lokasi: string;
  kategori: 'Pengajian_Akbar' | 'Ujian_Imtihan' | 'Kunjungan_Wali' | 'Khataman_Quran' | 'Libur_Pondok';
  deskripsi: string;
  wajibWali: boolean;
}

export interface AuditSecurityLog {
  id: string;
  waktu: string;
  aktivitas: string;
  perangkat: string;
  ipMasked: string;
  status: 'Berhasil' | 'Verifikasi PIN' | 'Enkripsi Data';
}

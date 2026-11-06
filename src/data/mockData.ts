import {
  Santri,
  AbsensiRecord,
  TagihanSPP,
  TransaksiSaku,
  SetoranTahfidz,
  RaportSantri,
  PesanNotifikasi,
  AgendaPondok,
  AuditSecurityLog
} from '../types/pesantren';
import defaultAvatar from '../assets/images/santri_portrait_avatar_1793962078152.jpg';

export const INITIAL_SANTRI_LIST: Santri[] = [
  {
    id: 'SAN-2024-089',
    nis: '2024089',
    nama: 'Muhammad Ilham Al-Fatih',
    panggilan: 'Ilham',
    kamar: 'Asrama Al-Farabi Lt. 2 / No. 14',
    kelasFormal: 'Kelas IX-A MTs Hidayatun Najah',
    tingkatDiniyah: 'Wustho 3 (Kitab Kuning Menengah)',
    halaqahTahfidz: 'Halaqah Ustadz Zulkifli, Lc.',
    musyrifKamar: 'Ust. Ahmad Baihaqi, S.Pd.',
    musyrifKontak: '0813-8822-9901',
    waliNama: 'H. Rahmat Subekti',
    waliHp: '0812-3456-7890',
    waliEmail: 'rahmat.subekti@gmail.com',
    avatarUrl: defaultAvatar,
    saldoSaku: 185000,
    limitHarian: 25000,
    statusAktif: true,
    tanggalMasuk: '15 Juli 2023',
    targetHafalan: 30,
    capaianJuz: 14.5
  },
  {
    id: 'SAN-2024-112',
    nis: '2024112',
    nama: 'Siti Maryam Az-Zahra',
    panggilan: 'Maryam',
    kamar: 'Asrama Khadijah Lt. 1 / No. 05',
    kelasFormal: 'Kelas VIII-B MTs Hidayatun Najah',
    tingkatDiniyah: 'Wustho 2',
    halaqahTahfidz: 'Halaqah Ustadzah Fatimah, Al-Hafizhah',
    musyrifKamar: 'Usth. Wardah Nuraini',
    musyrifKontak: '0819-7711-4433',
    waliNama: 'Drs. H. Mulyadi Kusumo',
    waliHp: '0815-9988-2211',
    waliEmail: 'mulyadi.kusumo@yahoo.co.id',
    avatarUrl: defaultAvatar,
    saldoSaku: 240000,
    limitHarian: 30000,
    statusAktif: true,
    tanggalMasuk: '10 Juli 2024',
    targetHafalan: 30,
    capaianJuz: 8.0
  },
  {
    id: 'SAN-2023-045',
    nis: '2023045',
    nama: 'Ahmad Raihan Muzakki',
    panggilan: 'Raihan',
    kamar: 'Asrama Ibnu Sina Lt. 3 / No. 22',
    kelasFormal: 'Kelas X MA Unggulan Hidayatun Najah',
    tingkatDiniyah: 'Ulya 1',
    halaqahTahfidz: 'Halaqah KH. Abdullah Hakim, Al-Hafizh',
    musyrifKamar: 'Ust. Nurul Huda, M.Ag.',
    musyrifKontak: '0821-6655-1100',
    waliNama: 'Hj. Anisa Rahmawati',
    waliHp: '0813-1122-8877',
    waliEmail: 'anisa.rahmawati@gmail.com',
    avatarUrl: defaultAvatar,
    saldoSaku: 95000,
    limitHarian: 20000,
    statusAktif: true,
    tanggalMasuk: '20 Juli 2022',
    targetHafalan: 30,
    capaianJuz: 22.0
  }
];

export const INITIAL_ABSENSI: AbsensiRecord[] = [
  {
    id: 'ABS-20261106-01',
    santriId: 'SAN-2024-089',
    santriNama: 'Muhammad Ilham Al-Fatih',
    tanggal: '2026-11-06',
    sesi: 'Subuh',
    status: 'Hadir',
    waktu: '04:25 WIB',
    keterangan: 'Tepat waktu di shaf pertama masjid, mengulang dzikir',
    petugas: 'Ust. Ahmad Baihaqi'
  },
  {
    id: 'ABS-20261106-02',
    santriId: 'SAN-2024-089',
    santriNama: 'Muhammad Ilham Al-Fatih',
    tanggal: '2026-11-06',
    sesi: 'Tahfidz_Pagi',
    status: 'Hadir',
    waktu: '05:40 WIB',
    keterangan: 'Setoran Ziyadah Surat Maryam 1-15 lancar',
    petugas: 'Ust. Zulkifli, Lc.'
  },
  {
    id: 'ABS-20261106-03',
    santriId: 'SAN-2024-089',
    santriNama: 'Muhammad Ilham Al-Fatih',
    tanggal: '2026-11-06',
    sesi: 'Madrasah',
    status: 'Hadir',
    waktu: '07:15 WIB',
    keterangan: 'Hadir di kelas formal MTs IX-A',
    petugas: 'Guru Piket MTs'
  },
  {
    id: 'ABS-20261105-01',
    santriId: 'SAN-2024-089',
    santriNama: 'Muhammad Ilham Al-Fatih',
    tanggal: '2026-11-05',
    sesi: 'Kajian_Kitab',
    status: 'Hadir',
    waktu: '16:15 WIB',
    keterangan: 'Kitab Fathul Qorib bab Shalat Berjamaah',
    petugas: 'Ust. Syamsudin'
  },
  {
    id: 'ABS-20261105-02',
    santriId: 'SAN-2024-089',
    santriNama: 'Muhammad Ilham Al-Fatih',
    tanggal: '2026-11-05',
    sesi: 'Isya_Malam',
    status: 'Hadir',
    waktu: '19:30 WIB',
    keterangan: 'Hadir jamaah Isya & mudzakarah malam',
    petugas: 'Ust. Ahmad Baihaqi'
  },
  {
    id: 'ABS-20261104-01',
    santriId: 'SAN-2024-089',
    santriNama: 'Muhammad Ilham Al-Fatih',
    tanggal: '2026-11-04',
    sesi: 'Tahfidz_Pagi',
    status: 'Izin',
    waktu: '05:30 WIB',
    keterangan: 'Izin perawatan ringan di Poskestren (Flu ringan), istirahat dengan pantauan perawat',
    petugas: 'Ust. Zulkifli, Lc.'
  },
  {
    id: 'ABS-20261103-01',
    santriId: 'SAN-2024-089',
    santriNama: 'Muhammad Ilham Al-Fatih',
    tanggal: '2026-11-03',
    sesi: 'Subuh',
    status: 'Hadir',
    waktu: '04:22 WIB',
    keterangan: 'Hadir shalat Subuh berjamaah',
    petugas: 'Ust. Ahmad Baihaqi'
  }
];

export const INITIAL_TAGIHAN: TagihanSPP[] = [
  {
    id: 'TAG-2026-11-01',
    santriId: 'SAN-2024-089',
    bulan: 'November 2026',
    jenis: 'SPP_Bulanan',
    namaTagihan: 'Syahriyah (SPP) Pendidikan & Asrama November 2026',
    nominal: 750000,
    status: 'Belum_Bayar',
    jatuhTempo: '10 November 2026'
  },
  {
    id: 'TAG-2026-11-02',
    santriId: 'SAN-2024-089',
    bulan: 'November 2026',
    jenis: 'Uang_Makan',
    namaTagihan: 'Katering Dapur Sehat Santri (3x Sehari) November 2026',
    nominal: 600000,
    status: 'Belum_Bayar',
    jatuhTempo: '10 November 2026'
  },
  {
    id: 'TAG-2026-10-01',
    santriId: 'SAN-2024-089',
    bulan: 'Oktober 2026',
    jenis: 'SPP_Bulanan',
    namaTagihan: 'Syahriyah (SPP) Pendidikan & Asrama Oktober 2026',
    nominal: 750000,
    status: 'Lunas',
    jatuhTempo: '10 Oktober 2026',
    tanggalBayar: '05 Oktober 2026 09:14 WIB',
    metodeBayar: 'QRIS Pesantren (BSI)',
    kodeTransaksi: 'TRX-HN-20261005-0988',
    nomorKuitansi: 'KWT/HN/2026/X/089-01'
  },
  {
    id: 'TAG-2026-10-02',
    santriId: 'SAN-2024-089',
    bulan: 'Oktober 2026',
    jenis: 'Uang_Makan',
    namaTagihan: 'Katering Dapur Sehat Santri (3x Sehari) Oktober 2026',
    nominal: 600000,
    status: 'Lunas',
    jatuhTempo: '10 Oktober 2026',
    tanggalBayar: '05 Oktober 2026 09:14 WIB',
    metodeBayar: 'QRIS Pesantren (BSI)',
    kodeTransaksi: 'TRX-HN-20261005-0989',
    nomorKuitansi: 'KWT/HN/2026/X/089-02'
  },
  {
    id: 'TAG-2026-09-03',
    santriId: 'SAN-2024-089',
    bulan: 'September 2026',
    jenis: 'Kitab_Pondok',
    namaTagihan: 'Paket Pengadaan Kitab Kuning Semester Ganjil',
    nominal: 280000,
    status: 'Lunas',
    jatuhTempo: '20 September 2026',
    tanggalBayar: '12 September 2026 14:20 WIB',
    metodeBayar: 'Transfer Virtual Account BSI',
    kodeTransaksi: 'TRX-HN-20260912-0412',
    nomorKuitansi: 'KWT/HN/2026/IX/089-03'
  }
];

export const INITIAL_TRANSAKSI_SAKU: TransaksiSaku[] = [
  {
    id: 'TRX-SAKU-001',
    santriId: 'SAN-2024-089',
    tanggal: '2026-11-06',
    waktu: '12:35 WIB',
    kategori: 'Kantin_Santri',
    namaItem: 'Makan Siang Tambahan & Jus Buah Asli',
    nominal: 14000,
    tipe: 'Debit',
    kasir: 'Kantin Barokah Najah',
    catatan: 'Pembayaran nirsentuh PIN Kartu Santri'
  },
  {
    id: 'TRX-SAKU-002',
    santriId: 'SAN-2024-089',
    tanggal: '2026-11-06',
    waktu: '09:45 WIB',
    kategori: 'Koperasi_Pondok',
    namaItem: 'Buku Tulis Bergaris 38 Lembar (2 pcs) & Pulpen Pilot',
    nominal: 9000,
    tipe: 'Debit',
    kasir: 'Koperasi Santri Putra',
    catatan: 'Alat tulis madrasah'
  },
  {
    id: 'TRX-SAKU-003',
    santriId: 'SAN-2024-089',
    tanggal: '2026-11-04',
    waktu: '17:10 WIB',
    kategori: 'Laundry_Pondok',
    namaItem: 'Cuci Kering Wangi 3 Kg (Paket Bersih Santri)',
    nominal: 18000,
    tipe: 'Debit',
    kasir: 'Unit Laundry Pondok',
    catatan: 'Pakaian seragam dan sarung'
  },
  {
    id: 'TRX-SAKU-004',
    santriId: 'SAN-2024-089',
    tanggal: '2026-11-01',
    waktu: '08:00 WIB',
    kategori: 'Top_Up_Wali',
    namaItem: 'Top-Up Saldo Belanja Bulanan dari Wali Santri',
    nominal: 250000,
    tipe: 'Kredit',
    kasir: 'Sistem Pembayaran Digital Wali',
    catatan: 'Via BSI Mobile Virtual Account'
  },
  {
    id: 'TRX-SAKU-005',
    santriId: 'SAN-2024-089',
    tanggal: '2026-10-28',
    waktu: '19:40 WIB',
    kategori: 'Toko_Kitab',
    namaItem: 'Kitab Matan Al-Jurumiyah makna gandul Pegon',
    nominal: 15000,
    tipe: 'Debit',
    kasir: 'Toko Kitab Maktabah Najah',
    catatan: 'Pelajaran Nahwu Diniyah'
  }
];

export const INITIAL_SETORAN_TAHFIDZ: SetoranTahfidz[] = [
  {
    id: 'SET-01',
    santriId: 'SAN-2024-089',
    tanggal: '2026-11-06',
    surat: 'Maryam',
    ayat: 'Ayat 1 - 25',
    juz: 16,
    tipe: 'Ziyadah',
    nilai: 'A (Mumtaz)',
    kelancaran: 96,
    tajwid: 94,
    makhorij: 92,
    catatan: 'Pelafalan huruf mad thabi’i dan ikhfa sangat rapi. Siap lanjut ayat berikutnya.',
    penguji: 'Ust. Zulkifli, Lc.'
  },
  {
    id: 'SET-02',
    santriId: 'SAN-2024-089',
    tanggal: '2026-11-05',
    surat: 'Al-Kahfi',
    ayat: 'Ayat 83 - 110 (Khatam)',
    juz: 16,
    tipe: 'Ziyadah',
    nilai: 'A (Mumtaz)',
    kelancaran: 95,
    tajwid: 92,
    makhorij: 90,
    catatan: 'Selesai surat Al-Kahfi dengan sangat baik. Tartil terjaga.',
    penguji: 'Ust. Zulkifli, Lc.'
  },
  {
    id: 'SET-03',
    santriId: 'SAN-2024-089',
    tanggal: '2026-11-03',
    surat: 'Yasin & Ash-Shaffat',
    ayat: '1 Juz Penuh (Juz 23)',
    juz: 23,
    tipe: 'Murajaah',
    nilai: 'B+ (Jayyid Jiddan)',
    kelancaran: 89,
    tajwid: 90,
    makhorij: 88,
    catatan: 'Ada sedikit keraguan di peralihan ruku Surat Ash-Shaffat, sudah diperbaiki.',
    penguji: 'Ust. Zulkifli, Lc.'
  },
  {
    id: 'SET-04',
    santriId: 'SAN-2024-089',
    tanggal: '2026-10-31',
    surat: 'Al-Kahfi',
    ayat: 'Ayat 50 - 82',
    juz: 15,
    tipe: 'Ziyadah',
    nilai: 'A (Mumtaz)',
    kelancaran: 94,
    tajwid: 92,
    makhorij: 91,
    catatan: 'Alhamdulillah tartil dan mutqin.',
    penguji: 'Ust. Zulkifli, Lc.'
  }
];

export const INITIAL_RAPORT_SANTRI: RaportSantri = {
  santriId: 'SAN-2024-089',
  semester: 'Ganjil',
  tahunAjaran: '2026/2027',
  hijriyah: '1448 H',
  peringkatKelas: 2,
  totalSantriKelas: 32,
  kitab: [
    {
      namaKitab: 'Fathul Qorib Al-Mujib',
      bidang: 'Fiqih Syafi’iyyah',
      pengampu: 'KH. Dr. Muhammad Syukron',
      nilaiTeori: 94,
      nilaiPraktik: 92,
      predikat: 'Mumtaz (Istimewa)',
      catatan: 'Memahami rukun & syarat ibadah shalat dan bersuci dengan dalil matan.'
    },
    {
      namaKitab: 'Matan Al-Jurumiyah & Imrithi',
      bidang: 'Tata Bahasa Arab (Nahwu)',
      pengampu: 'Ust. Baihaqi, S.Pd.I',
      nilaiTeori: 90,
      nilaiPraktik: 88,
      predikat: 'Jayyid Jiddan (Amat Baik)',
      catatan: 'I’rob kalimat dasar dan tarkib nahwu sangat baik, tingkatkan latihan bab i’rab fi’il.'
    },
    {
      namaKitab: 'Al-Amtsilah At-Tashrifiyyah',
      bidang: 'Morfologi Arab (Shorof)',
      pengampu: 'Ust. Hasan Basri',
      nilaiTeori: 92,
      nilaiPraktik: 95,
      predikat: 'Mumtaz (Istimewa)',
      catatan: 'Hafalan shighat dan wazan tsulatsi mazid sangat lancar.'
    },
    {
      namaKitab: 'Ta’limul Muta’allim Thariqat Ta’allum',
      bidang: 'Adab & Etika Penuntut Ilmu',
      pengampu: 'KH. Abdullah Hakim',
      nilaiTeori: 96,
      nilaiPraktik: 98,
      predikat: 'Mumtaz (Istimewa)',
      catatan: 'Menunjukkan budi pekerti tawadhu’ kepada asatidz dan santun dengan teman.'
    },
    {
      namaKitab: 'Aqidatul Awwam',
      bidang: 'Tauhid & Teologi Ahlussunnah',
      pengampu: 'Ust. Nurul Huda, M.Ag.',
      nilaiTeori: 93,
      nilaiPraktik: 94,
      predikat: 'Mumtaz (Istimewa)',
      catatan: 'Hafal 57 bait nadhom lengkap beserta pemaknaan sifat 20.'
    },
    {
      namaKitab: 'Taisir Musthalah Al-Hadits',
      bidang: 'Ulumul Hadits',
      pengampu: 'Ust. Zulkifli, Lc.',
      nilaiTeori: 88,
      nilaiPraktik: 86,
      predikat: 'Jayyid Jiddan (Amat Baik)',
      catatan: 'Mampu membedakan hadits shahih, hasan, dan dhaif beserta sanad dasarnya.'
    }
  ],
  akhlak: {
    kedisiplinan: 'Sangat Tertib (A) - Tidak pernah terlambat sholat jamaah dan piket asrama',
    kebersihan: 'Terpuji (A) - Kamar dan lemari santri selalu rapi, pakaian tersimpan bersih',
    sholatJamaah: 'Istimewa (A) - Senantiasa hadir di shaf terdepan masjid pondok',
    adabSopanSantun: 'Sangat Santun (A) - Menundukkan pandangan dan mencium tangan guru/asatidz',
    kemandirian: 'Mandiri & Teladan (A) - Mengelola waktu dengan teratur dan membantu adik kelas'
  },
  catatanPengasuh: 'Ananda Muhammad Ilham Al-Fatih menunjukkan semangat tholabul ilmi yang membanggakan. Hafalan Al-Qur’an terus bertambah dengan tajwid yang fasih. Semoga menjadi anak sholeh penyejuk hati orang tua dan bermanfaat bagi umat. Pertahankan ketawadhu’an.',
  catatanWaliKelas: 'Prestasi akademik dan kepesantrenan ananda sangat stabil. Hubungan komunikasi dengan wali santri senantiasa kooperatif.',
  tanggalTerbit: '01 November 2026'
};

export const INITIAL_PESAN_NOTIFIKASI: PesanNotifikasi[] = [
  {
    id: 'MSG-001',
    santriId: 'SAN-2024-089',
    pengirim: 'Ust. Zulkifli, Lc.',
    pengirimRole: 'Musyrif Kamar',
    judul: 'Laporan Perkembangan Tahfidz Pagi',
    pesan: 'Assalamu’alaikum Bapak Rahmat Subekti. Alhamdulillah Ananda Ilham pagi ini telah menyelesaikan setoran ziyadah Surat Maryam ayat 1-25 dengan nilai Mumtaz (A). Bacaannya tartil dan mutqin. Mohon doa restunya agar istiqomah menuju 30 Juz.',
    waktu: 'Hari ini, 06:15 WIB',
    kategori: 'Akademik',
    sudahDibaca: false,
    isDirectChat: true
  },
  {
    id: 'MSG-002',
    santriId: 'SAN-2024-089',
    pengirim: 'Sistem Kehadiran Otomatis',
    pengirimRole: 'Musyrif Kamar',
    judul: 'Konfirmasi Presensi Sholat Subuh Berjamaah',
    pesan: 'Ananda Muhammad Ilham Al-Fatih telah terkonfirmasi HADIR sholat Subuh berjamaah di Masjid Nurul Iman Pondok Pesantren Hidayatun Najah tepat waktu pada pukul 04:25 WIB.',
    waktu: 'Hari ini, 04:30 WIB',
    kategori: 'Absensi',
    sudahDibaca: true
  },
  {
    id: 'MSG-003',
    santriId: 'SAN-2024-089',
    pengirim: 'Biro Keuangan Pondok',
    pengirimRole: 'Bagian Keuangan',
    judul: 'Penerbitan Invoice Syahriyah (SPP) November 2026',
    pesan: 'Tagihan SPP dan Katering Asrama bulan November 2026 telah terbit. Pembayaran dapat dilakukan langsung via portal ini melalui QRIS, BSI Virtual Account, atau transfer bank hingga 10 November 2026.',
    waktu: 'Kemarin, 08:00 WIB',
    kategori: 'Keuangan',
    sudahDibaca: true
  },
  {
    id: 'MSG-004',
    santriId: 'SAN-2024-089',
    pengirim: 'Poskestren Hidayatun Najah',
    pengirimRole: 'Musyrif Kamar',
    judul: 'Update Kesehatan Santri (Pemeriksaan Rutin)',
    pesan: 'Pemberitahuan kepada wali santri: Pada 4 November ananda sempat istirahat di klinik karena flu ringan. Alhamdulillah setelah diberikan vitamin dan madu herbal oleh dokter pondok, kondisi ananda sudah pulih total dan kembali aktif mengaji.',
    waktu: '04 Nov 2026, 15:45 WIB',
    kategori: 'Kesehatan',
    sudahDibaca: true
  }
];

export const INITIAL_AGENDA: AgendaPondok[] = [
  {
    id: 'AGD-01',
    judul: 'Pertemuan Akbar Wali Santri & Khotmil Qur’an Semester Ganjil',
    tanggalMasehi: '22 November 2026',
    tanggalHijriah: '12 Jumadil Awwal 1448 H',
    waktu: '08:00 - 14:00 WIB',
    lokasi: 'Auditorium Utama & Masjid Nurul Iman Pesantren',
    kategori: 'Kunjungan_Wali',
    deskripsi: 'Silaturahmi seluruh wali santri dengan Pengasuh & Dewan Masyayikh, laporan perkembangan pendidikan, serta tasmi’ 30 Juz santri teladan.',
    wajibWali: true
  },
  {
    id: 'AGD-02',
    judul: 'Ujian Imtihan Nihai (Ujian Semester Diniyah & Kitab Kuning)',
    tanggalMasehi: '01 - 10 Desember 2026',
    tanggalHijriah: '21 - 30 Jumadil Awwal 1448 H',
    waktu: '07:30 - 15:00 WIB',
    lokasi: 'Gedung Madrasah Diniyah Hidayatun Najah',
    kategori: 'Ujian_Imtihan',
    deskripsi: 'Evaluasi tertulis dan lisan hafalan matan Jurumiyah, Fathul Qorib, Shorof, dan hadits arba’in.',
    wajibWali: false
  },
  {
    id: 'AGD-03',
    judul: 'Kajian Akbar Bulanan Bersama Habib & Masyayikh',
    tanggalMasehi: '15 November 2026',
    tanggalHijriah: '05 Jumadil Awwal 1448 H',
    waktu: '19:45 WIB (Ba’da Isya)',
    lokasi: 'Masjid Nurul Iman Pesantren (Disiarkan Live Streaming)',
    kategori: 'Pengajian_Akbar',
    deskripsi: 'Kajian kitab Ihya Ulumuddin terbuka untuk asatidz, santri, dan wali santri secara daring maupun luring.',
    wajibWali: false
  },
  {
    id: 'AGD-04',
    judul: 'Libur Maulid Nabi & Perpulangan Terjadwal Santri',
    tanggalMasehi: '18 - 25 Desember 2026',
    tanggalHijriah: '08 - 15 Jumadil Akhir 1448 H',
    waktu: 'Mulai Pukul 08:00 WIB',
    lokasi: 'Penjemputan Gerbang Utama Pesantren',
    kategori: 'Libur_Pondok',
    deskripsi: 'Perpulangan santri semester ganjil setelah tuntas administrasi raport dan perizinan resmi bagian keamanan pondok.',
    wajibWali: true
  }
];

export const INITIAL_SECURITY_LOGS: AuditSecurityLog[] = [
  {
    id: 'SEC-101',
    waktu: '06 Nov 2026, 02:45 WIB',
    aktivitas: 'Sesi Login Wali Santri Terotentikasi',
    perangkat: 'Chrome on Android (Samsung SM-S918B)',
    ipMasked: '180.252.***.*** (Jakarta)',
    status: 'Berhasil'
  },
  {
    id: 'SEC-102',
    waktu: '05 Nov 2026, 19:12 WIB',
    aktivitas: 'Sinkronisasi Absensi Terenkripsi AES-256',
    perangkat: 'Tablet Operator Asrama (Android Tab)',
    ipMasked: '10.14.***.*** (Intranet Pondok)',
    status: 'Enkripsi Data'
  },
  {
    id: 'SEC-103',
    waktu: '05 Nov 2026, 09:14 WIB',
    aktivitas: 'Otorisasi Transaksi Pembayaran SPP via QRIS',
    perangkat: 'Mobile Banking Gateway (BSI API)',
    ipMasked: '103.247.***.*** (Gateway Fin)',
    status: 'Verifikasi PIN'
  },
  {
    id: 'SEC-104',
    waktu: '01 Nov 2026, 08:00 WIB',
    aktivitas: 'Perubahan Limit Belanja Saku Santri (Rp 25.000/hari)',
    perangkat: 'Portal Wali Santri Web App',
    ipMasked: '180.252.***.*** (Jakarta)',
    status: 'Verifikasi PIN'
  }
];

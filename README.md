# KosMate — Aplikasi Mobile Pengelola Keuangan & Kebutuhan Anak Kos 📱

> **KosMate** adalah aplikasi **pemrograman mobile** (*bukan aplikasi web*) berbasis **React Native** dan **Expo** yang dirancang khusus untuk membantu mahasiswa perantauan dan anak kos dalam mengelola alokasi budget bulanan, mencatat pengeluaran harian, serta merencanakan daftar kebutuhan belanja kos secara efisien dan offline-first.

---

## 📌 Ringkasan Proyek

- **Mata Kuliah / Bidang:** Pemrograman Mobile
- **Platform Sasaran:** Mobile Native (Android & iOS)
- **Teknologi Utama:** React Native, Expo SDK, TypeScript, AsyncStorage
- **Target Pengguna:** Mahasiswa dan anak kos yang mengelola keuangan mandiri

---

## 🎯 Fokus & Alasan Pemrograman Mobile (Bukan Web)

Aplikasi ini dibangun khusus dengan paradigma **mobile-first** karena kebutuhan anak kos bersifat *on-the-go*:
1. **Pencatatan Instan Saat Bertransaksi**: Mahasiswa membeli makanan, ojek, atau kebutuhan kos di luar kamar dan membutuhkan akses aplikasi cepat langsung dari saku (smartphone), tanpa perlu membuka laptop atau browser.
2. **Offline-First dengan Local Storage**: Menggunakan native storage (`AsyncStorage`) pada smartphone, sehingga data transaksi tetap dapat diakses dan dicatat tanpa tergantung koneksi internet.
3. **Sentuhan & Pengalaman Native**: Dirancang dengan interaksi mobile native (sentuhan cepat, checklist belanja saat di toko/supermarket, safe area navigation, fluid transitions).

---

## 🚀 Fitur Utama

### 1. 🏠 Home Dashboard
- **Budget Hero Card**: Menampilkan budget bulanan, total pengeluaran terpakai, dan sisa budget secara visual dengan indikator warna dinamis.
- **KosMate Insight**: Rekomendasi otomatis status kondisi keuangan (kondisi aman, peringatan boros, atau defisit).
- **Ringkasan per Kategori**: Pengelompokan pengeluaran otomatis (Makan, Transportasi, Laundry, Kebutuhan Kos, Hiburan).
- **Pengeluaran Terbaru**: Ringkasan daftar transaksi terakhir yang dicatat.

### 2. 💸 Pelacak Pengeluaran (Expense Tracker)
- Pencatatan transaksi pengeluaran (judul, nominal rupiah, kategori, tanggal transaksi, catatan opsional).
- Validasi input nominal dan kelengkapan data.
- Daftar riwayat transaksi dengan format mata uang Rupiah (`formatRupiah`).

### 3. 🛒 Manajemen Kebutuhan Kos (Needs & Shopping List)
- Daftar barang kebutuhan kamar/kos yang harus dibeli (misal: beras, deterjen, sabun, galon).
- Estimasi harga tiap barang untuk memperkirakan kebutuhan dana belanja.
- Checklist interaktif untuk menandai barang yang sudah dibeli (*purchased*) atau belum.
- Kalkulasi total estimasi belanja secara otomatis.

### 4. 💰 Alokasi Budget Bulanan
- Penentuan dan pembaruan batas budget bulanan mahasiswa.
- Sinkronisasi instan terhadap perhitungan sisa saldo di dashboard.

---

## 🛠️ Tech Stack (Mobile Architecture)

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework** | [React Native](https://reactnative.dev/) (v0.88) + [Expo](https://expo.dev/) (SDK 58) | Mobile application framework untuk Android & iOS |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety dan arsitektur kode yang terstruktur |
| **Routing & Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) | File-based native routing untuk mobile (`src/app/`) |
| **Local Storage** | `@react-native-async-storage/async-storage` | Penyimpanan lokal persisten di perangkat mobile |
| **UI Components** | React Native Core Components | `View`, `Text`, `ScrollView`, `TouchableOpacity`, `StyleSheet` |
| **Icons** | `@expo/vector-icons` | Ikon native mobile |

---

## 📁 Struktur Direktori Proyek

```text
KosMate/
├── frontend/                 # Aplikasi mobile (React Native + Expo)
│   ├── src/app/               # Screen dan route Expo Router
│   ├── src/components/        # Komponen UI
│   ├── src/context/           # State aplikasi
│   ├── src/storage/           # Penyimpanan lokal
│   └── package.json
├── backend/                   # REST API (Node.js + Express + TypeScript)
│   ├── src/config/
│   ├── src/controllers/
│   ├── src/database/
│   ├── src/middleware/
│   ├── src/models/
│   ├── src/routes/
│   └── package.json
├── prototypes/
│   └── figma-make-app/        # Prototipe web Vite, terpisah dari aplikasi mobile
├── Design/                    # Dokumen desain
├── PRD/                       # Product requirements
├── scripts/                   # Script utilitas
└── package.json               # Script praktis tingkat repository
```

---

## 📲 Panduan Menjalankan Aplikasi Mobile

### Prasyarat
- **Node.js** (LTS disarankan)
- Aplikasi **Expo Go** terpasang di smartphone Android (via Google Play Store) atau iOS (via App Store), **atau** emulator Android Studio / simulator iOS.

Setiap aplikasi memiliki dependensi dan lockfile sendiri; jalankan perintah
dari folder proyek yang sesuai.

### Aplikasi Mobile

```bash
cd frontend
npm ci
npm run start
```

### Backend (opsional)

```bash
cd backend
npm ci
npm run dev
```

### Prototipe Web (opsional)

Panduan khusus juga tersedia di [`prototypes/figma-make-app/README.md`](prototypes/figma-make-app/README.md).

```bash
cd prototypes/figma-make-app
npm ci
npm run dev
```

### 3. Membuka di Perangkat Mobile
- **Di Smartphone Fisik (Expo Go):** Buka aplikasi Expo Go, lalu scan QR code yang muncul di terminal / browser terminal Expo.
- **Di Android Emulator:** Tekan tombol `a` pada terminal setelah emulator Android Studio aktif (atau jalankan `npm run android`).
- **Di iOS Simulator:** Tekan tombol `i` pada terminal (khusus macOS dengan Xcode terpasang).

---

## 🎨 Sistem Desain & Antarmuka Mobile

- **Background:** `#FAF8F5` (Warm off-white canvas, nyaman di mata)
- **Primary:** `#312C51` (Deep Navy Purple untuk kartu utama & branding)
- **Secondary:** `#48426D` (Muted Purple untuk sub-elemen & highlight)
- **Accent 01 (Peach):** `#F0C38E` (Aksen perhatian/status positif)
- **Accent 02 (Coral):** `#F1AA9B` (Aksen pengeluaran/peringatan)
- **Surface:** `#FFFFFF` (Card & Input native)
- **Border:** `#E6E2EA` (Garis pembatas halus)

---

## 📄 Lisensi & Tim Pengembang
Dikembangkan untuk kebutuhan proyek praktikum **Pemrograman Mobile** — KosMate Team.

## 🧭 Pemetaan Konsep Asynchronous

| Konsep | File | Implementasi |
|---|---|---|
| **#1 — Data API ke interface** | `frontend/src/types/market.ts`, `frontend/src/utils/marketMapper.ts`, `frontend/src/config/api.ts` | Interface model, tipe respons mentah, mapper, URL API, dan data harga pangan simulasi. |
| **#2 — Async function** | `frontend/src/services/marketApi.ts`, `frontend/src/app/(tabs)/market.tsx` | Kurs dari API, `async/await`, penanganan error, cache AsyncStorage 30 menit, tampilan offline, dan `Promise.all`. |
| **#3 — Promise manual** | `frontend/src/services/transfer.ts`, `frontend/src/app/promise-lab.tsx` | `new Promise`, `resolve`, `reject`, `setTimeout`, aturan biaya transfer, serta rantai `.then().catch().finally()`. |
| **#4 — Perbandingan Promise** | `frontend/src/app/promise-lab.tsx` | Log proses dan pengukuran `Promise.all` dibanding `await` berurutan. |
| **Rekomendasi belanja hemat** | `frontend/src/app/(tabs)/recommendations.tsx` | Menyusun kebutuhan yang muat anggaran berdasarkan prioritas, lalu menampilkan harga contoh lokal dan tips hemat berbahasa Indonesia. |

Urutan tab: **Dashboard → List → Hemat → tambah → Keuangan → Info → Profil**. Tab Info menampilkan kurs IDR dari API dan harga pangan contoh lokal. Tips hemat ditulis dalam Bahasa Indonesia di tab Hemat; integrasi Advice Slip dan tombol Promise Lab telah dihapus dari alur utama. Data harga pangan tetap berupa contoh sampai tersedia akses API harga pangan dengan mekanisme penyimpanan API key yang aman.

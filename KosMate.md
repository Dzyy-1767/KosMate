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
| **Framework** | [React Native](https://reactnative.dev/) (v0.86) + [Expo](https://expo.dev/) (SDK 57) | Mobile application framework untuk Android & iOS |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety dan arsitektur kode yang terstruktur |
| **Routing & Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) | File-based native routing untuk mobile (`src/app/`) |
| **Local Storage** | `@react-native-async-storage/async-storage` | Penyimpanan lokal persisten di perangkat mobile |
| **UI Components** | React Native Core Components | `View`, `Text`, `ScrollView`, `TouchableOpacity`, `StyleSheet` |
| **Icons** | `@expo/vector-icons` | Ikon native mobile |

---

## 📁 Struktur Direktori Proyek

```text
KosMate/
├── src/
│   ├── app/                 # Screen & routing mobile (Expo Router)
│   │   ├── _layout.tsx      # Root native stack/tab layout
│   │   ├── index.tsx        # Dashboard / Home Screen
│   │   ├── budget.tsx       # Kelola Budget Screen
│   │   ├── expenses.tsx     # Daftar Pengeluaran
│   │   ├── expenses/add.tsx # Form Tambah Pengeluaran
│   │   ├── needs.tsx        # Daftar Kebutuhan Kos (Shopping List)
│   │   └── needs/add.tsx    # Form Tambah Kebutuhan Kos
│   ├── components/          # Reusable Native Mobile UI Components
│   │   ├── BudgetCard.tsx   # Kartu Hero Budget
│   │   ├── ExpenseItem.tsx  # Item Baris Pengeluaran
│   │   ├── NeedItem.tsx     # Item Checklist Kebutuhan Kos
│   │   └── EmptyState.tsx   # Tampilan State Kosong
│   ├── constants/           # Token Desain & Konstanta
│   │   ├── colors.ts        # Color Palette Design System
│   │   ├── typography.ts    # Typographic scales
│   │   ├── spacing.ts       # Spacing tokens
│   │   └── categories.ts    # Kategori pengeluaran default
│   ├── storage/             # Layanan AsyncStorage (Offline-first)
│   │   ├── budgetStorage.ts
│   │   ├── expenseStorage.ts
│   │   └── needStorage.ts
│   ├── types/               # Definisi Interface & Tipe TypeScript
│   │   ├── budget.ts
│   │   ├── expense.ts
│   │   └── need.ts
│   └── utils/               # Helper Utility (Perhitungan & Format Mata Uang)
│       ├── calculation.ts
│       └── currency.ts
├── PRD/                     # Product Requirements Document
├── Design/                  # Design Brief & Color Guidelines
├── app.json                 # Konfigurasi Native Expo App
├── package.json             # Dependensi proyek mobile
└── README.md                # Dokumentasi proyek
```

---

## 📲 Panduan Menjalankan Aplikasi Mobile

### Prasyarat
- **Node.js** (LTS disarankan)
- Aplikasi **Expo Go** terpasang di smartphone Android (via Google Play Store) atau iOS (via App Store), **atau** emulator Android Studio / simulator iOS.

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan Expo
```bash
npx expo start
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

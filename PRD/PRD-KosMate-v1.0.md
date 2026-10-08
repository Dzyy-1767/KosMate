# PRD — KosMate

**Versi:** 1.0
**Platform:** Mobile
**Framework:** React Native + Expo
**Bahasa:** TypeScript
**Storage:** AsyncStorage
**Navigation:** Expo Router
**State:** `useState`
**List:** `FlatList`
**UI:** React Native Components
**Styling:** `StyleSheet`
**Icon:** `@expo/vector-icons`
**Target:** Mahasiswa yang tinggal di kos
**MVP:** Home, Kebutuhan Kos, Pengeluaran
**Shopping List:** Digabung ke dalam Kebutuhan Kos
**Definition of Done:** seluruh flow MVP berjalan end-to-end, CRUD berfungsi, validasi berjalan, dan aplikasi siap didemokan.

---

## 1. Problem Statement

Mahasiswa yang tinggal di kos harus mengelola beberapa kebutuhan rutin secara mandiri: uang bulanan, biaya makan, transportasi, laundry, kebutuhan kamar, hingga pembelian barang seperti sabun, deterjen, beras, dan galon.

Masalah utamanya bukan hanya **berapa uang yang sudah dikeluarkan**, tetapi juga **ke mana uang tersebut digunakan dan kebutuhan apa yang belum dibeli**.

Tanpa pencatatan yang terstruktur, mahasiswa berisiko:

- Tidak mengetahui sisa budget bulan berjalan.
- Menghabiskan uang terlalu cepat sebelum akhir bulan.
- Lupa membeli kebutuhan penting.
- Tidak mengetahui total estimasi biaya kebutuhan kos.
- Kesulitan melihat pola pengeluaran.
- Mencampurkan pengeluaran kebutuhan kos dengan pengeluaran lainnya.

### Problem Utama

> **Mahasiswa yang tinggal di kos membutuhkan cara sederhana untuk mengelola budget bulanan, mencatat pengeluaran, dan mengontrol kebutuhan kos dalam satu aplikasi mobile.**

### Siapa yang Dirugikan?

**Mahasiswa pengguna kos**, terutama mahasiswa yang mengelola keuangan sendiri dan memiliki budget bulanan terbatas.

Dampaknya:

**Budget tidak terkontrol → pengeluaran tidak terpantau → kebutuhan terlupakan → uang habis sebelum waktunya.**

---

## 2. Target User + Persona

### 2.1 Target User

#### Primary User

Mahasiswa yang:

- Tinggal di kos.
- Mengelola uang sendiri.
- Memiliki pemasukan/budget bulanan.
- Membayar kebutuhan sehari-hari sendiri.
- Membutuhkan pencatatan keuangan sederhana.
- Menggunakan smartphone Android/iOS.

#### Secondary User

Mahasiswa yang tinggal di kos tetapi mendapatkan uang secara berkala dari orang tua/wali dan ingin mengetahui penggunaan uang tersebut.

---

### 2.2 Persona 1 — Mahasiswa Perantauan

| Field | Detail |
|---|---|
| **Nama** | Alya |
| **Usia** | 20 tahun |
| **Status** | Mahasiswa semester 4 |
| **Tempat tinggal** | Kos |
| **Pemasukan** | Uang bulanan dari orang tua |
| **Literasi finansial** | Dasar |

#### Behavior

- Mendapat uang bulanan sekaligus.
- Sering membeli makanan secara spontan.
- Kadang lupa mencatat pengeluaran.
- Membeli kebutuhan kos ketika barang sudah habis.
- Tidak memiliki spreadsheet keuangan.

#### Pain Points

> "Awal bulan masih merasa punya banyak uang, tapi akhir bulan bingung uangnya habis ke mana."

#### Need

- Mengetahui budget tersisa.
- Mencatat pengeluaran dengan cepat.
- Melihat kebutuhan kos yang belum dibeli.
- Mengetahui total kebutuhan yang harus dibeli.

---

### 2.3 Persona 2 — Mahasiswa Budget-conscious

| Field | Detail |
|---|---|
| **Nama** | Raka |
| **Usia** | 21 tahun |
| **Status** | Mahasiswa semester 5 |
| **Tempat tinggal** | Kos |
| **Pemasukan** | Uang bulanan + freelance kecil |
| **Literasi finansial** | Menengah |

#### Behavior

- Membuat budget bulanan.
- Memiliki banyak kebutuhan rutin.
- Sering membandingkan pengeluaran dengan budget.
- Ingin mengurangi pengeluaran yang tidak penting.

#### Pain Points

> "Saya tahu budget saya berapa, tapi sulit melihat apakah pengeluaran saya masih aman sampai akhir bulan."

#### Need

- Input budget.
- Mencatat pemasukan.
- Melihat total pengeluaran.
- Melihat sisa budget.
- Mengontrol kebutuhan kos.

---

## 3. Goals dan Non-goals

### 3.1 Product Goals

#### Goal 1 — Budget Visibility

User dapat mengetahui:

- Pemasukan bulan berjalan.
- Budget yang tersedia.
- Total pengeluaran.
- Sisa budget.

#### Goal 2 — Expense Tracking

User dapat mencatat pengeluaran berdasarkan kategori.

Kategori MVP:

1. Makan
2. Transportasi
3. Laundry
4. Kebutuhan Kos
5. Hiburan

#### Goal 3 — Kos Needs Management

User dapat:

- Menambahkan kebutuhan.
- Menentukan estimasi harga.
- Menandai kebutuhan sudah dibeli.
- Menghapus kebutuhan.
- Melihat total estimasi biaya.

#### Goal 4 — Simple and Fast

Pencatatan harus sederhana sehingga user dapat menambahkan transaksi tanpa workflow yang panjang.

---

### 3.2 Non-goals

Fitur berikut **tidak termasuk MVP**:

- Integrasi rekening bank.
- Integrasi e-wallet.
- Transfer uang.
- Pembayaran kos otomatis.
- Payment gateway.
- Notifikasi push.
- Cloud synchronization.
- Login/register.
- Multi-device synchronization.
- AI financial advisor.
- Investasi.
- Hutang/piutang.
- Grafik finansial kompleks.
- Marketplace kebutuhan kos.

---

## 4. User Stories

### 4.1 Home

- Sebagai mahasiswa kos, saya ingin melihat budget bulan ini supaya saya mengetahui kondisi keuangan saya.
- Sebagai mahasiswa kos, saya ingin melihat total pengeluaran supaya saya mengetahui berapa uang yang sudah digunakan.
- Sebagai mahasiswa kos, saya ingin melihat sisa budget supaya saya mengetahui apakah pengeluaran saya masih aman.
- Sebagai mahasiswa kos, saya ingin melihat ringkasan pengeluaran berdasarkan kategori supaya saya mengetahui kebutuhan terbesar saya.
- Sebagai mahasiswa kos, saya ingin melihat kebutuhan kos yang belum dibeli supaya saya tidak lupa membeli kebutuhan penting.

---

### 4.2 Kebutuhan Kos

- Sebagai mahasiswa kos, saya ingin menambahkan kebutuhan kos supaya saya dapat mencatat barang yang harus dibeli.
- Sebagai mahasiswa kos, saya ingin memasukkan estimasi harga supaya saya dapat memperkirakan biaya belanja.
- Sebagai mahasiswa kos, saya ingin menandai barang sebagai sudah dibeli supaya daftar kebutuhan tetap terorganisir.
- Sebagai mahasiswa kos, saya ingin menghapus kebutuhan supaya daftar tetap relevan.
- Sebagai mahasiswa kos, saya ingin melihat total estimasi biaya supaya saya dapat menyiapkan budget belanja.
- Sebagai mahasiswa kos, saya ingin melihat status barang supaya saya dapat membedakan barang yang sudah dan belum dibeli.

---

### 4.3 Pengeluaran

- Sebagai mahasiswa kos, saya ingin menambahkan pengeluaran supaya transaksi saya tercatat.
- Sebagai mahasiswa kos, saya ingin memilih kategori pengeluaran supaya transaksi lebih terorganisir.
- Sebagai mahasiswa kos, saya ingin mengubah pengeluaran supaya kesalahan pencatatan dapat diperbaiki.
- Sebagai mahasiswa kos, saya ingin menghapus pengeluaran supaya data yang salah dapat dihapus.
- Sebagai mahasiswa kos, saya ingin melihat daftar pengeluaran supaya saya dapat mengevaluasi penggunaan uang.

---

## 5. Daftar Fitur

### MVP

#### 1. Home

**Prioritas: MUST HAVE**

- Input pemasukan/budget bulan berjalan.
- Menampilkan total pemasukan.
- Menampilkan total pengeluaran.
- Menampilkan sisa budget.
- Menampilkan ringkasan pengeluaran berdasarkan kategori.
- Menampilkan preview kebutuhan kos.
- Menampilkan total estimasi kebutuhan kos.

---

#### 2. Kebutuhan Kos

**Prioritas: MUST HAVE**

Shopping List menjadi bagian dari fitur ini.

- Daftar kebutuhan.
- Tambah kebutuhan.
- Edit kebutuhan.
- Hapus kebutuhan.
- Input harga estimasi.
- Checklist sudah dibeli/belum.
- Total estimasi kebutuhan.
- Filter/status kebutuhan.

Contoh tampilan:

```
☐ Sabun             Rp15.000
☑ Deterjen          Rp25.000
☐ Beras 5kg         Rp75.000
☐ Galon             Rp20.000

Total: Rp135.000
```

---

#### 3. Pengeluaran

**Prioritas: MUST HAVE**

- Daftar pengeluaran.
- Tambah pengeluaran.
- Edit pengeluaran.
- Hapus pengeluaran.
- Kategori pengeluaran.
- Nominal.
- Tanggal.
- Catatan opsional.
- Total pengeluaran.

---

### V2

Fitur yang masuk setelah MVP stabil:

#### Home

- Grafik pengeluaran.
- Perbandingan pengeluaran antarbulan.
- Budget per kategori.
- Progress budget.

#### Pengeluaran

- Search transaksi.
- Filter berdasarkan tanggal.
- Filter kategori.
- Riwayat bulan sebelumnya.

#### Kebutuhan Kos

- Kategori kebutuhan.
- Prioritas kebutuhan.
- Filter kebutuhan.
- Riwayat barang yang pernah dibeli.

#### Budget

- Budget per kategori.
- Warning ketika budget hampir habis.

---

### Nanti (Long-term Roadmap)

- Login/register.
- Cloud database.
- Sinkronisasi antar-device.
- Backup data.
- Push notification.
- Pengingat bayar kos.
- Integrasi e-wallet.
- Integrasi bank.
- Pembayaran kos.
- Shared kos / roommate budgeting.
- AI financial assistant.
- Rekomendasi penghematan.

---

## 6. Functional Requirements MVP

### 6.1 Home

#### FR-HOME-01 — Menampilkan Budget

Sistem harus menampilkan budget bulan berjalan.

Format:
```
Budget Bulan Ini

Rp2.500.000
```

Budget berasal dari input user.

---

#### FR-HOME-02 — Menampilkan Total Pengeluaran

Sistem harus menghitung:

```
Total Pengeluaran =
Σ seluruh pengeluaran bulan berjalan
```

Contoh:
```
Pengeluaran
Rp1.250.000
```

---

#### FR-HOME-03 — Menghitung Sisa Budget

Formula:

```
Sisa Budget =
Budget - Total Pengeluaran
```

Contoh:
```
Budget       Rp2.500.000
Pengeluaran  Rp1.250.000
------------------------
Sisa         Rp1.250.000
```

Jika hasil negatif, sistem **tidak boleh mengubahnya menjadi 0**. Sistem harus tetap menunjukkan bahwa user telah melewati budget.

Contoh sisa negatif:
```
Sisa Budget
-Rp150.000
```

---

#### FR-HOME-04 — Ringkasan Kategori

Home harus menampilkan total pengeluaran berdasarkan kategori:

```
Makan           Rp600.000
Transportasi    Rp200.000
Laundry         Rp150.000
Kebutuhan Kos   Rp200.000
Hiburan         Rp100.000
```

---

#### FR-HOME-05 — Preview Kebutuhan Kos

Home menampilkan kebutuhan yang belum dibeli.

Contoh:
```
Kebutuhan Kos

☐ Sabun
☐ Beras
☐ Galon

Lihat semua →
```

---

#### FR-HOME-06 — Total Estimasi

Sistem menghitung total estimasi kebutuhan kos.

```
Total Estimasi
Rp135.000
```

**Open Question (OQ-03):** Apakah total estimasi menghitung **semua item**, atau hanya item yang **belum dibeli**? Keputusan ini perlu ditetapkan sebelum implementasi.

---

### 6.2 Kebutuhan Kos

#### FR-KOS-01 — Create

User dapat menambahkan kebutuhan.

Field minimum:

| Field | Required |
|---|---|
| Nama barang | Ya |
| Harga estimasi | Ya |

Contoh:
```
Nama:
Deterjen

Harga:
25000
```

---

#### FR-KOS-02 — Read

Sistem menampilkan seluruh kebutuhan menggunakan `FlatList`.

Setiap item minimal menampilkan:
```
☐ Deterjen
Rp25.000
```

---

#### FR-KOS-03 — Update

User dapat mengubah:

- Nama barang.
- Harga estimasi.
- Status dibeli.

---

#### FR-KOS-04 — Delete

User dapat menghapus item kebutuhan.

Sistem harus meminta konfirmasi sebelum penghapusan.

Contoh dialog:
```
Hapus kebutuhan?

"Deterjen" akan dihapus.

[Batal] [Hapus]
```

---

#### FR-KOS-05 — Checklist

User dapat mengubah status:

```
Belum dibeli → Sudah dibeli
```

dan:

```
Sudah dibeli → Belum dibeli
```

Status harus tersimpan di local storage.

---

#### FR-KOS-06 — Total Estimasi

Sistem menghitung:

```
Total = Σ harga seluruh item
```

Lihat **OQ-03** mengenai apakah item yang sudah dibeli ikut dihitung.

---

#### FR-KOS-07 — Validation

**Nama barang:**
- Wajib diisi.
- Tidak boleh hanya whitespace.

**Harga:**
- Wajib diisi.
- Harus berupa angka.
- Harus >= 0.
- Tidak boleh menggunakan format yang tidak valid.

---

### 6.3 Pengeluaran

#### FR-EXP-01 — Create

User dapat membuat transaksi.

| Field | Required |
|---|---|
| Nama transaksi/catatan | Ya |
| Nominal | Ya |
| Kategori | Ya |
| Tanggal | Ya |
| Catatan tambahan | Tidak |

Contoh:
```
Makan siang
Rp20.000
Makan
8 Oktober 2026
```

---

#### FR-EXP-02 — Kategori

MVP menggunakan kategori tetap:

```
Makan
Transportasi
Laundry
Kebutuhan Kos
Hiburan
```

User **belum dapat membuat kategori custom** pada MVP.

---

#### FR-EXP-03 — Read

Sistem menampilkan daftar pengeluaran terbaru.

Contoh:
```
Hari ini

Makan siang
Makan
Rp20.000

Laundry
Laundry
Rp35.000
```

---

#### FR-EXP-04 — Update

User dapat mengubah:

- Nama transaksi.
- Nominal.
- Kategori.
- Tanggal.
- Catatan.

---

#### FR-EXP-05 — Delete

User dapat menghapus transaksi. Sistem harus meminta konfirmasi.

---

#### FR-EXP-06 — Total Pengeluaran

Sistem menghitung seluruh transaksi bulan berjalan.

```
Total =
Σ nominal transaksi
```

---

#### FR-EXP-07 — Validation

| Field | Aturan |
|---|---|
| Nominal | Wajib, numeric, > 0 |
| Nama transaksi | Wajib, tidak boleh kosong |
| Kategori | Wajib, harus dari kategori yang tersedia |
| Tanggal | Wajib, harus tanggal valid |

---

### 6.4 Budget/Pemasukan

#### FR-BUDGET-01

User dapat memasukkan budget/pemasukan bulan berjalan.

Contoh:
```
Budget Bulanan

Rp2.500.000

[Simpan]
```

#### FR-BUDGET-02

User dapat mengubah budget.

#### FR-BUDGET-03

Budget tersimpan secara lokal.

#### FR-BUDGET-04

Budget digunakan oleh Home untuk menghitung sisa budget.

**Open Question (OQ-01):** Apakah "pemasukan" dan "budget" dianggap **satu angka yang sama**, atau user dapat memasukkan **pemasukan aktual** dan menetapkan **budget pengeluaran yang berbeda**?

---

## 7. Sketsa Data Model

Karena MVP menggunakan AsyncStorage, struktur data dibuat sederhana.

### 7.1 Budget

```typescript
type Budget = {
  id: string;
  month: string;   // format: "YYYY-MM"
  amount: number;
};
```

Contoh:
```json
{
  "id": "budget-001",
  "month": "2026-10",
  "amount": 2500000
}
```

---

### 7.2 Expense

```typescript
type Expense = {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;       // format: ISO 8601
  note?: string;
  createdAt: string;  // format: ISO 8601
};

type ExpenseCategory =
  | "Makan"
  | "Transportasi"
  | "Laundry"
  | "Kebutuhan Kos"
  | "Hiburan";
```

---

### 7.3 KosNeed

```typescript
type KosNeed = {
  id: string;
  name: string;
  estimatedPrice: number;
  isPurchased: boolean;
  createdAt: string;  // format: ISO 8601
};
```

Contoh:
```json
{
  "id": "need-001",
  "name": "Deterjen",
  "estimatedPrice": 25000,
  "isPurchased": false,
  "createdAt": "2026-10-08T10:00:00Z"
}
```

---

### 7.4 Relasi Logis

Tidak perlu database relational pada MVP.

```
Budget
   |
   +-- digunakan untuk menghitung
   |
   v
Expenses -----------> Home Summary
   |
   +-- category

KosNeeds -----------> Home Summary
   |
   +-- purchased status
```

---

## 8. Edge Case & Failure State

### Budget

| ID | Kondisi | Behavior |
|---|---|---|
| E-01 | Budget belum diinput | Tampilkan: "Budget belum diatur — Tambahkan budget bulan ini" |
| E-02 | Pengeluaran melebihi budget | Tampilkan sisa negatif. Jangan blokir transaksi. |
| E-03 | Budget = 0 | **Open Question (OQ-05)** |

---

### Kebutuhan Kos

| ID | Kondisi | Behavior |
|---|---|---|
| E-04 | Tidak ada kebutuhan | Tampilkan: "Belum ada kebutuhan kos. + Tambah Kebutuhan" |
| E-05 | Harga 0 | **Open Question (OQ-06)** |
| E-06 | Nama duplikat | **Open Question (OQ-07)** |
| E-07 | Semua sudah dibeli | Tampilkan: "Semua kebutuhan sudah dibeli" |

---

### Pengeluaran

| ID | Kondisi | Behavior |
|---|---|---|
| E-08 | Belum ada transaksi | Tampilkan: "Belum ada pengeluaran. + Tambah Pengeluaran" |
| E-09 | Nominal sangat besar | Simpan selama dalam batas angka yang aman (JS Number.MAX_SAFE_INTEGER) |
| E-10 | User menghapus transaksi | Tampilkan konfirmasi sebelum hapus |
| E-11 | Data AsyncStorage rusak | Handle parsing error tanpa crash. Tampilkan: "Terjadi masalah saat memuat data." |
| E-12 | Aplikasi ditutup setelah input | Data yang disimpan harus tetap tersedia setelah aplikasi dibuka kembali |
| E-13 | Bulan berganti | **Open Question (OQ-09)** |

---

## 9. Success Metrics

### 9.1 MVP Completion Rate

**Target: 100% core flow dapat diselesaikan end-to-end saat demo.**

Core flow:
```
Set Budget
   |
   v
Tambah Pengeluaran
   |
   v
Home menghitung pengeluaran
   |
   v
Home menghitung sisa budget
   |
   v
Tambah Kebutuhan Kos
   |
   v
Checklist kebutuhan
   |
   v
Home menampilkan kebutuhan
```

### 9.2 CRUD Success Rate

**Target: 100% CRUD operation berhasil tanpa crash.**

Meliputi:
- Create/Read/Update/Delete expense
- Create/Read/Update/Delete kos need
- Update budget

### 9.3 Validation Success

**Target: 100% input invalid menghasilkan validation feedback yang sesuai.**

Contoh kasus yang harus ditangani:
- Nominal kosong
- Nominal bukan angka
- Nama kosong
- Harga negatif
- Kategori kosong

### 9.4 Data Persistence

**Target: 100% data tersimpan tetap tersedia setelah aplikasi ditutup dan dibuka kembali.**

### 9.5 Usability

**Target: >=80% test user baru dapat menyelesaikan pencatatan satu pengeluaran tanpa bantuan developer.**

---

## 10. Open Questions

Berikut hal-hal yang **belum boleh diasumsikan developer** sebelum requirement dikunci.

| ID | Pertanyaan | Status |
|---|---|---|
| OQ-01 | Apakah Pemasukan = Budget, atau dua nilai berbeda? | Belum diputuskan |
| OQ-02 | Apakah pengeluaran bulan sebelumnya harus disimpan sebagai histori? | Belum diputuskan |
| OQ-03 | Total estimasi kebutuhan: semua item, atau hanya yang belum dibeli? | Belum diputuskan |
| OQ-04 | Apakah checklist kebutuhan otomatis membuat transaksi pengeluaran? | Belum diputuskan |
| OQ-05 | Apakah budget Rp0 valid? | Belum diputuskan |
| OQ-06 | Apakah harga kebutuhan Rp0 valid? | Belum diputuskan |
| OQ-07 | Apakah nama kebutuhan duplikat diperbolehkan? | Belum diputuskan |
| OQ-08 | Apakah tanggal transaksi boleh untuk tanggal masa lalu? | Belum diputuskan |
| OQ-09 | Apakah sistem otomatis membuat periode baru setiap bulan? | Belum diputuskan |
| OQ-10 | Apakah pengingat bayar kos masuk V2 atau dihapus dari roadmap? | Belum diputuskan |

### Detail Open Questions

#### OQ-01 — Budget vs Pemasukan

- **Opsi A:** Pemasukan = Budget (satu angka)
- **Opsi B:** Pemasukan berbeda dari Budget (dua angka terpisah)

Contoh opsi B:
```
Pemasukan: Rp3.000.000
Budget pengeluaran: Rp2.500.000
```

---

#### OQ-02 — Histori Bulanan

Apakah pengeluaran bulan sebelumnya harus disimpan?

Jika iya, Home harus menggunakan filter bulan dan data tidak boleh hilang.

---

#### OQ-03 — Total Estimasi Kebutuhan

Jika:
```
Belum  Sabun       Rp15.000
Sudah  Deterjen    Rp25.000
Belum  Beras       Rp75.000
```

Apakah total:
- **Rp115.000** — semua item (termasuk yang sudah dibeli)
- **Rp90.000** — hanya yang belum dibeli

---

#### OQ-04 — Checklist -> Transaksi Otomatis

Jika user mencentang kebutuhan yang sudah dibeli, apakah sistem otomatis membuat transaksi pengeluaran?

- **Opsi A:** Ya, buat transaksi otomatis kategori "Kebutuhan Kos"
- **Opsi B:** Tidak, checklist hanya mengubah status

---

#### OQ-09 — Pergantian Bulan

Recommended behavior:
```
Oktober
Budget: Rp2.500.000
Expenses: tersimpan

  -- bulan berganti --

November
Budget: belum diatur
Expenses: Rp0
```

Data Oktober tetap tersedia sebagai histori.

---

## 11. Arsitektur MVP

```
React Native + Expo
        |
        +-- Expo Router
        |
        +-- Screens
        |    +-- Home
        |    +-- Kebutuhan Kos
        |    +-- Pengeluaran
        |
        +-- Components
        |    +-- BudgetCard
        |    +-- ExpenseCard
        |    +-- NeedCard
        |    +-- EmptyState
        |
        +-- State
        |    +-- useState
        |
        +-- Persistence
             +-- AsyncStorage
```

### Screen Map

```
                    KOSMATE
                       |
          +------------+------------+
          |            |            |
        HOME      KEBUTUHAN KOS  PENGELUARAN
          |            |            |
     +----+----+       |       +----+-----+
     |    |    |       |       |    |     |
   Budget Total Sisa   CRUD   CRUD Category Date
          |            |       |
          |            |       +-- Makan
          |            |       +-- Transportasi
          |            |       +-- Laundry
          |            |       +-- Kebutuhan Kos
          |            |       +-- Hiburan
          |            |
          |            +-- Nama
          |            +-- Harga
          |            +-- Checklist
          |            +-- Total Estimasi
          |
          +-- Ringkasan Pengeluaran
```

---

## 12. Definition of Done

- [ ] Home dapat digunakan end-to-end.
- [ ] Budget dapat dibuat dan diubah.
- [ ] Pengeluaran dapat Create/Read/Update/Delete.
- [ ] Kebutuhan kos dapat Create/Read/Update/Delete.
- [ ] Checklist kebutuhan berfungsi.
- [ ] Total pengeluaran dihitung otomatis.
- [ ] Sisa budget dihitung otomatis.
- [ ] Total kebutuhan dihitung otomatis.
- [ ] Validation berjalan.
- [ ] Data tersimpan di AsyncStorage.
- [ ] Data tetap ada setelah aplikasi ditutup/dibuka kembali.
- [ ] Empty state tersedia.
- [ ] Delete memiliki confirmation.
- [ ] Seluruh flow dapat didemokan tanpa backend.
- [ ] Semua **Open Questions** sudah diputuskan sebelum coding final.

---

*Dokumen ini dibuat berdasarkan PRD KosMate v1.0 — Terakhir diperbarui: 8 Oktober 2026*

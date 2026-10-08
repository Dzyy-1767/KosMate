# Revised Design Brief — KosMate

**Versi:** 1.0
**Terakhir diperbarui:** 8 Oktober 2026

---

## 1. Design Principles

### 01 — Financial clarity first

Informasi yang berhubungan dengan uang harus menjadi hierarchy tertinggi.

User harus bisa memahami dalam ±3 detik:

> **Budget → Terpakai → Sisa**

Warna tidak boleh mengalahkan informasi numerik.

---

### 02 — Cozy, bukan corporate

KosMate adalah aplikasi untuk kehidupan anak kos, bukan mobile banking.

UI harus terasa:

**hangat + personal + youthful + rapi**

Palet ungu navy dan peach menjadi fondasi visual agar aplikasi terasa seperti **personal companion**, bukan financial dashboard.

---

### 03 — Simple enough to use every day

Setiap action utama harus singkat.

Contoh:

**Tambah Pengeluaran → isi → simpan**

Tidak boleh ada terlalu banyak modal, halaman, atau konfigurasi yang membuat user malas mencatat.

---

## 2. Visual Direction

### Visual concept: "Cozy Night at Your Kos"

Palet:

```
#312C51
#48426D
#F0C38E
#F1AA9B
```

Bayangan visual:

> **Malam di kamar kos, meja belajar, laptop terbuka, lampu warm, planner keuangan di sampingnya.**

Bukan literal memakai ilustrasi kamar kos di setiap halaman, tetapi mood tersebut diterjemahkan melalui warna, spacing, card, dan typography.

### Mood Keywords

| Mood | |
|---|---|
| Cozy | Calm |
| Mature | Youthful |
| Personal | Organized |

---

## 3. Color System

### Primary — Deep Navy Purple `#312C51`

Digunakan untuk:

- Primary button
- Header penting
- Primary text pada beberapa surface
- Active navigation
- FAB
- Budget emphasis
- Icon utama

Ini menjadi **brand color KosMate**.

Kenapa?

Ungu navy memberikan kombinasi:

```
ungu  = personal / creative
navy  = trustworthy / stable
```

Hasilnya cocok untuk mahasiswa tanpa terasa seperti aplikasi finance korporat.

---

### Secondary — Muted Purple `#48426D`

Digunakan untuk:

- Secondary button
- Secondary text tertentu
- Icon background
- Selected state
- Section accent
- Supporting visual

Hubungan warnanya:

```
#312C51  →  Deep / strong
#48426D  →  Soft / supporting
```

Hierarchy tetap jelas.

---

### Accent 01 — Warm Peach `#F0C38E`

Digunakan sebagai warna **positive / attention accent**, bukan sebagai warna background seluruh aplikasi.

Contoh penggunaan:

- Budget highlight
- Icon background
- Illustration accent
- Progress indicator
- Highlight pada card
- CTA secondary

Peach membuat ungu yang relatif gelap tidak terasa terlalu berat.

---

### Accent 02 — Soft Coral `#F1AA9B`

Digunakan sebagai:

- Warning
- Expense accent
- Notification badge
- Highlight
- Decorative accent
- Empty-state illustration

Coral memberi sedikit energy agar UI tidak terlalu serius.

> **Catatan penting:** Coral **tidak otomatis berarti error**. Untuk error, tetap gunakan semantic red yang memiliki contrast dan makna jelas.

---

## 4. Neutral Palette

Empat warna utama tidak cukup untuk membangun UI. Kita membutuhkan neutral system.

| Token | Value | Penggunaan |
|---|---|---|
| Background | `#FAF8F5` | Warm off-white, background utama app |
| Surface | `#FFFFFF` | Card dan input |
| Primary Text | `#25233A` | Teks utama |
| Secondary Text | `#666277` | Teks pendukung |
| Border | `#E6E2EA` | Garis batas card/input |
| Disabled | `#B9B5C2` | State disabled |

### Kenapa warm white bukan pure white?

```
Purple + Pure White   →  terasa corporate / harsh
Purple + Warm White   →  terasa cozy / lifestyle
```

---

## 5. Semantic Colors

Brand palette dan semantic palette harus **dipisahkan**.

| Semantic | Value | Penggunaan |
|---|---|---|
| Success | `#2E7D5B` | Berhasil disimpan, item sudah dibeli, success feedback |
| Warning | `#B7791F` | Budget hampir habis, perhatian |
| Error | `#C94C4C` | Invalid input, gagal menyimpan, destructive state |

> **Jangan menggunakan `#F1AA9B` sebagai error utama**, karena coral tersebut adalah brand accent.

---

## 6. Color Usage Ratio

Jangan menggunakan empat warna utama dengan proporsi sama.

```
Neutral / Background     60 – 70%
#312C51                  15 – 20%
#48426D                   5 – 10%
#F0C38E                   5%
#F1AA9B                   3 – 5%
```

Prinsipnya:

> **Purple is the identity. Peach and coral are seasoning.**

Kalau semua card diberi warna peach/coral, KosMate akan terlihat seperti aplikasi dekoratif dan kehilangan kredibilitas finansial.

---

## 7. Typography

### Primary Font — Inter

KosMate memiliki banyak angka:

```
Rp2.500.000
Rp150.000
Rp35.000
Rp20.000
```

Inter memiliki readability yang baik untuk:

- Nominal
- Label
- Form
- List
- Mobile screen

Visual personality akan datang dari **color + layout + illustration**, bukan font dekoratif.

---

### Type Scale

| Style | Size | Weight | Penggunaan |
|---|---|---|---|
| Display | 32px | 700 | Budget utama, hero number |
| H1 | 24px | 700 | Page title |
| H2 | 20px | 700 | Section title |
| H3 | 16px | 600 | Card title |
| Body | 16px | 400 | Konten utama |
| Body Small | 14px | 400 | Secondary info |
| Caption | 12px | 500 | Label kecil |
| Button | 15px | 600 | CTA |

### Budget Number

Budget utama menggunakan **32px / Bold**.

Contoh:

> **Rp2.500.000**

Tujuannya menjadikan nominal sebagai **visual anchor utama**.

---

## 8. Spacing

Menggunakan 4pt system:

```
4   8   12   16   20   24   32   40   48   64
```

| Konteks | Value |
|---|---|
| Screen padding | 16px |
| Card padding | 16px |
| Section spacing | 24px |
| Item spacing | 12px |

---

## 9. Border Radius

| Elemen | Radius |
|---|---|
| Small | 8px |
| Input | 10px |
| Card | 16px |
| Large Card | 20px |
| Bottom Sheet | 24px |
| Pill | 999px |

Default card: **16px**

Kenapa 16px bukan 12px?

Ungu navy + radius 12 terasa lebih formal. Radius 16 memberikan rasa friendly tanpa menjadi childish.

---

## 10. Shadow

Shadow sangat subtle.

```
Card:
  Y:       2
  Blur:    8
  Opacity: 6 – 8%
```

Untuk sebagian besar card, gunakan **background + border** daripada shadow berat.

Contoh:
```
background: #FFFFFF
border:     #E6E2EA
radius:     16
```

Ini lebih clean dan lebih terasa cozy.

---

## 11. Component Color Mapping

### Primary Button

```
Background:        #312C51
Text:              #FFFFFF
Background Pressed: #48426D
```

### Secondary Button

```
Background: #F0C38E
Text:       #312C51
```

Ini menjadi salah satu **signature visual KosMate**.

### Ghost Button

```
Background: transparent
Text:       #312C51
```

### FAB (Floating Action Button)

```
Background: #312C51
Icon:       #FFFFFF
```

---

## 12. Budget Card (Hero Component)

Budget card menjadi **hero component** KosMate.

Wireframe:

```
+----------------------------------+
| Budget Oktober                   |
|                                  |
| Rp2.500.000                      |
|                                  |
| [===========          ]          |
|                                  |
| Terpakai        Sisa             |
| Rp1.250.000     Rp1.250.000      |
+----------------------------------+
```

| Property | Value |
|---|---|
| Background | `#312C51` |
| Text | `#FFFFFF` |
| Progress / Accent | `#F0C38E` |

Begitu user membuka aplikasi, mereka langsung melihat **brand + kondisi finansial** dalam satu pandangan.

---

## 13. Expense Visualization

Jangan membuat setiap kategori menjadi warna random.

Gunakan satu visual system dengan primary visual `#48426D` dan accent bergantian antara `#F0C38E` dan `#F1AA9B`.

```
● Makan
● Transportasi
● Laundry
● Kebutuhan Kos
● Hiburan
```

Warna bukan satu-satunya pembeda. **Nama kategori dan nominal tetap wajib ditampilkan**.

---

## 14. Kebutuhan Kos Screen

Ini tempat terbaik menggunakan **peach**.

Wireframe:

```
+--------------------------------+
| Estimasi Belanja               |
|                                |
| Rp135.000                      |
|                                |
| ------------------------------ |
|                                |
| Belum dibeli                   |
|                                |
| O  Sabun             Rp15.000  |
| O  Beras             Rp75.000  |
| O  Galon             Rp20.000  |
+--------------------------------+
```

| Property | Value |
|---|---|
| Checkbox active background | `#312C51` |
| Checkbox check color | `#FFFFFF` |
| Section accent | `#F0C38E` |

---

## 15. Expense Screen

Gunakan purple sebagai struktur dan coral sebagai accent.

Wireframe:

```
Pengeluaran

Total
Rp1.250.000

Hari ini

+----------------------------+
|  *  Makan siang            |
|     Makan                  |
|                  Rp20.000  |
+----------------------------+

+----------------------------+
|  *  Laundry                |
|     Laundry                |
|                  Rp35.000  |
+----------------------------+
```

Coral `#F1AA9B` dapat digunakan sebagai **small icon container / accent**, bukan seluruh card.

---

## 16. Bottom Navigation

```
+----------------------------------+
|                                  |
|    [Home]  [Kebutuhan]  [Keluar] |
|                                  |
+----------------------------------+
```

| State | Icon | Text | Background |
|---|---|---|---|
| Active | `#312C51` | `#312C51` | `#FFFFFF` |
| Inactive | `#8D8998` | `#8D8998` | `#FFFFFF` |

Active indicator dapat menggunakan `#F0C38E` dalam bentuk pill kecil.

---

## 17. Visual Personality Hierarchy

```
Dominant
  Deep Purple     #312C51

     |

Supporting
  Muted Purple    #48426D

     |

Warmth
  Peach           #F0C38E

     |

Energy
  Soft Coral      #F1AA9B

     |

Canvas
  Warm White      #FAF8F5
```

---

## 18. Final Direction

### Positioning KosMate

> ### Cozy Finance Companion for Students

**Bukan:**

- ❌ Banking app
- ❌ Expense tracker yang kaku
- ❌ Shopping checklist biasa
- ❌ Cute / gamified student app

**Melainkan:**

> **Aplikasi pendamping anak kos untuk mengatur uang dan kebutuhan sehari-hari dengan visual yang hangat dan mudah dipahami.**

---

### Color Role Summary

| Warna | Peran |
|---|---|
| `#312C51` | Brand identity + trust + primary action |
| `#48426D` | Hierarchy kedua + supporting |
| `#F0C38E` | Warmth + positive highlight |
| `#F1AA9B` | Accent + attention |
| `#FAF8F5` | Canvas — menjaga interface tetap bersih |

Palet ini memberi dasar yang cukup kuat untuk membuat **UI kit / Figma design system** sebelum masuk implementasi React Native.

---

*Design Brief KosMate v1.0 — Terakhir diperbarui: 8 Oktober 2026*

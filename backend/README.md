# 🚀 KosMate Backend REST API Service

Backend REST API untuk aplikasi mobile **KosMate (Pengelola Keuangan & Kebutuhan Anak Kos)**.

---

## 📁 Struktur Direktori

```text
backend/
├── src/
│   ├── config/              # Konfigurasi Environment & Database Store
│   │   ├── env.ts
│   │   └── database.ts
│   ├── controllers/         # Logika Bisnis & Request Handler
│   │   ├── authController.ts
│   │   ├── transactionController.ts
│   │   ├── needController.ts
│   │   └── summaryController.ts
│   ├── database/            # Skema SQL & Data Awal (Seed)
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── middleware/          # Auth Guard & Error Handling
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── models/              # Interface & Type Definition TypeScript
│   │   ├── User.ts
│   │   ├── Transaction.ts
│   │   └── ShoppingItem.ts
│   ├── routes/              # Routing Endpoint API
│   │   ├── authRoutes.ts
│   │   ├── transactionRoutes.ts
│   │   ├── needRoutes.ts
│   │   ├── summaryRoutes.ts
│   │   └── index.ts
│   ├── app.ts               # Inisialisasi Express & Middleware
│   └── server.ts            # Entry Point Server Listener
├── .env.example             # Contoh konfigurasi variabel lingkungan
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Cara Menjalankan Server

1. **Buka terminal dan masuk ke folder `backend`:**
   ```bash
   cd backend
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server dalam mode development:**
   ```bash
   npm run dev
   ```

Server akan aktif di: **`http://localhost:5000`**

---

## 📡 Daftar Endpoint API (v1)

Base URL: `http://localhost:5000/api/v1`

### 1. Autentikasi (`/auth`)
* `POST /auth/register` — Mendaftar akun baru
* `POST /auth/login` — Masuk ke akun
* `GET /auth/profile` — Mengambil data profil user saat ini
* `PUT /auth/profile` — Mengubah nama, info kos, atau budget bulanan

### 2. Transaksi Keuangan (`/transactions`)
* `GET /transactions` — Mengambil seluruh daftar pengeluaran & pemasukan
  * *Query params:* `?type=expense` atau `?type=income`
* `GET /transactions/:id` — Detail transaksi berdasarkan ID
* `POST /transactions` — Menambahkan catatan transaksi baru
* `PUT /transactions/:id` — Mengubah data transaksi
* `DELETE /transactions/:id` — Menghapus transaksi

### 3. Kebutuhan Belanja Kos (`/needs`)
* `GET /needs` — Mengambil daftar kebutuhan belanja
  * *Query params:* `?purchased=false`
* `GET /needs/:id` — Detail kebutuhan
* `POST /needs` — Menambahkan barang kebutuhan baru
* `PATCH /needs/:id/toggle` — Mengubah status sudah dibeli / belum
* `PUT /needs/:id` — Mengubah detail kebutuhan
* `DELETE /needs/:id` — Menghapus barang kebutuhan

### 4. Ringkasan & Dashboard (`/summary`)
* `GET /summary/dashboard` — Menghitung saldo, sisa budget bulanan, total pengeluaran/pemasukan, dan breakdown per kategori

---

## 🗄️ Skema Database (SQL)

Dapat dilihat pada file [`src/database/schema.sql`](file:///c:/Users/waode/KosMate/backend/src/database/schema.sql) yang mencakup 4 tabel utama:
1. `users`: Akun anak kos, kontak, nomor kamar, dan batas anggaran bulanan.
2. `categories`: Kategori default (Makan, Kos, Transport, Tagihan, Laundry, dll.).
3. `transactions`: Catatan pengeluaran & pemasukan harian.
4. `shopping_items`: Daftar belanjaan, tingkat prioritas, status beli, dan estimasi harga.

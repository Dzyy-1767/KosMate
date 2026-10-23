-- ==============================================================
-- KosMate Database Schema DDL (SQL)
-- Compatible with MySQL / PostgreSQL / SQLite
-- ==============================================================

-- 1. Table: users (Informasi Pengguna & Profil Anak Kos)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    kos_name VARCHAR(100),
    room_number VARCHAR(20),
    monthly_budget DECIMAL(12, 2) DEFAULT 1500000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: categories (Kategori Pengeluaran & Pemasukan)
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'expense' atau 'income'
    icon VARCHAR(50) DEFAULT 'tag',
    color VARCHAR(20) DEFAULT '#312C51',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: transactions (Catatan Pengeluaran & Pemasukan Harian)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'expense' atau 'income'
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Table: shopping_items (Daftar Kebutuhan & Belanja Anak Kos)
CREATE TABLE IF NOT EXISTS shopping_items (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Sedang', -- 'Tinggi', 'Sedang', 'Rendah'
    price DECIMAL(12, 2) DEFAULT 0.00,
    purchased BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_shopping_items_user ON shopping_items(user_id);

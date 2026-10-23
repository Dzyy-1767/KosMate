-- ==============================================================
-- KosMate Database Seed Data
-- ==============================================================

-- Seed Default Categories
INSERT INTO categories (id, name, type, icon, color) VALUES
('cat_food', 'Makan & Minum', 'expense', 'coffee', '#F38181'),
('cat_kos', 'Kebutuhan Kos', 'expense', 'home', '#4A90E2'),
('cat_transport', 'Transportasi', 'expense', 'navigation', '#F5A623'),
('cat_bills', 'Tagihan & Pulsa', 'expense', 'zap', '#7ED321'),
('cat_laundry', 'Laundry', 'expense', 'droplet', '#9013FE'),
('cat_allowance', 'Kiriman Ortu', 'income', 'credit-card', '#27AE60'),
('cat_salary', 'Gaji / Magang', 'income', 'briefcase', '#2ECC71'),
('cat_other', 'Lainnya', 'expense', 'more-horizontal', '#95A5A6')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Demo User
INSERT INTO users (id, name, email, password_hash, phone, kos_name, room_number, monthly_budget) VALUES
('user_demo_1', 'Rian Kos', 'rian@kosmate.id', 'hashed_demo_password', '081234567890', 'Kos Berkah Jaya', 'Kamar 12', 1500000.00)
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Transactions
INSERT INTO transactions (id, user_id, title, amount, type, category, date, note) VALUES
('tx_1', 'user_demo_1', 'Kiriman Bulanan Ortu', 1500000.00, 'income', 'Kiriman Ortu', '2026-10-01', 'Uang bulanan awal bulan'),
('tx_2', 'user_demo_1', 'Makan Siang Nasi Padang', 18000.00, 'expense', 'Makan & Minum', '2026-10-20', 'Nasi padang lauk ayam rendang'),
('tx_3', 'user_demo_1', 'Beli Galon Air Mineral', 7000.00, 'expense', 'Kebutuhan Kos', '2026-10-21', 'Refill galon isi ulang'),
('tx_4', 'user_demo_1', 'Bensin Motor', 25000.00, 'expense', 'Transportasi', '2026-10-22', 'Pertalite full tank')
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Shopping Items
INSERT INTO shopping_items (id, user_id, name, category, priority, price, purchased) VALUES
('need_1', 'user_demo_1', 'Deterjen Bubuk 1kg', 'Kebutuhan Kos', 'Tinggi', 22000.00, FALSE),
('need_2', 'user_demo_1', 'Shampoo & Sabun Mandi', 'Kebutuhan Kos', 'Tinggi', 35000.00, TRUE),
('need_3', 'user_demo_1', 'Kopi Sachet 1 Renceng', 'Makan & Minum', 'Sedang', 15000.00, FALSE),
('need_4', 'user_demo_1', 'Token Listrik Kamar', 'Tagihan & Pulsa', 'Tinggi', 50000.00, FALSE)
ON CONFLICT (id) DO NOTHING;

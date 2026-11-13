import { FormEvent, ReactNode, useMemo, useState } from "react";

type Screen = "dashboard" | "list" | "finance" | "profile";
type TransactionType = "income" | "expense";
type ShoppingPriority = "Tinggi" | "Sedang" | "Rendah";
type IconName =
  | "home"
  | "list"
  | "wallet"
  | "user"
  | "plus"
  | "arrow-up"
  | "arrow-down"
  | "cart"
  | "food"
  | "transport"
  | "house"
  | "book"
  | "check"
  | "chevron"
  | "close"
  | "calendar"
  | "edit"
  | "bell"
  | "shield"
  | "info";

type Transaction = {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  note: string;
  category: string;
};

type ShoppingItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  purchased: boolean;
  priority: ShoppingPriority;
  targetDate: string;
  actualPrice?: number;
};

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: "income",
    amount: 3500000,
    date: "2025-06-01",
    note: "Uang bulanan",
    category: "Keluarga",
  },
  {
    id: 2,
    type: "income",
    amount: 1250000,
    date: "2025-06-05",
    note: "Proyek desain",
    category: "Freelance",
  },
  {
    id: 3,
    type: "income",
    amount: 450000,
    date: "2025-06-08",
    note: "Jual buku bekas",
    category: "Lainnya",
  },
  {
    id: 4,
    type: "expense",
    amount: 1250000,
    date: "2025-06-02",
    note: "Sewa kos bulan Juni",
    category: "Kos",
  },
  {
    id: 5,
    type: "expense",
    amount: 185000,
    date: "2025-06-10",
    note: "Belanja mingguan",
    category: "Makanan",
  },
  {
    id: 6,
    type: "expense",
    amount: 75000,
    date: "2025-06-11",
    note: "Isi ulang kartu transportasi",
    category: "Transportasi",
  },
  {
    id: 7,
    type: "expense",
    amount: 48000,
    date: "2025-06-12",
    note: "Kopi dan makan siang",
    category: "Makanan",
  },
  {
    id: 8,
    type: "expense",
    amount: 129000,
    date: "2025-06-13",
    note: "Internet kos",
    category: "Tagihan",
  },
];

const initialShoppingItems: ShoppingItem[] = [
  {
    id: 1,
    name: "Rak sepatu minimalis",
    category: "Kamar",
    price: 185000,
    purchased: false,
    priority: "Tinggi",
    targetDate: "2025-06-16",
  },
  {
    id: 2,
    name: "Deterjen & pewangi",
    category: "Kebersihan",
    price: 72000,
    purchased: false,
    priority: "Sedang",
    targetDate: "2025-06-18",
  },
  {
    id: 3,
    name: "Lampu meja belajar",
    category: "Belajar",
    price: 149000,
    purchased: false,
    priority: "Rendah",
    targetDate: "2025-06-25",
  },
  {
    id: 4,
    name: "Galon air mineral",
    category: "Dapur",
    price: 23000,
    actualPrice: 22000,
    purchased: true,
    priority: "Tinggi",
    targetDate: "2025-06-12",
  },
  {
    id: 5,
    name: "Gantungan baju",
    category: "Kamar",
    price: 48000,
    actualPrice: 45000,
    purchased: true,
    priority: "Sedang",
    targetDate: "2025-06-10",
  },
  {
    id: 6,
    name: "Kotak penyimpanan",
    category: "Kamar",
    price: 89000,
    actualPrice: 92000,
    purchased: true,
    priority: "Rendah",
    targetDate: "2025-06-08",
  },
];

const navItems: { id: Screen; label: string; icon: IconName }[] = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "list", label: "List", icon: "list" },
  { id: "finance", label: "Keuangan", icon: "wallet" },
  { id: "profile", label: "Profil", icon: "user" },
];

const expenseCategories = [
  "Makanan",
  "Transportasi",
  "Kos",
  "Tagihan",
  "Belanja",
  "Pendidikan",
  "Lainnya",
];

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatShortIDR = (amount: number) =>
  `Rp${new Intl.NumberFormat("id-ID").format(amount)}`;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));

const formatTargetDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h12M9 12h12M9 18h12" />
        <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H19v16H5.5A2.5 2.5 0 0 1 3 17.5z" />
        <path d="M3 7h16M15 12h6v4h-6a2 2 0 0 1 0-4Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    "arrow-up": (
      <>
        <path d="m7 10 5-5 5 5M12 5v14" />
      </>
    ),
    "arrow-down": (
      <>
        <path d="m7 14 5 5 5-5M12 19V5" />
      </>
    ),
    cart: (
      <>
        <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    food: (
      <>
        <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c-3 2-3 8 0 10" />
      </>
    ),
    transport: (
      <>
        <rect x="4" y="3" width="16" height="16" rx="3" />
        <path d="M4 11h16M8 19v2M16 19v2M8 7h.01M16 7h.01" />
      </>
    ),
    house: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10M9 21v-7h6v7" />
      </>
    ),
    book: (
      <>
        <path d="M4 4a3 3 0 0 1 3-1h5v17H7a3 3 0 0 0-3 1zM20 4a3 3 0 0 0-3-1h-5v17h5a3 3 0 0 1 3 1z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "text";
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button button-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action && (
        <button className="text-action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  options,
  optionPlaceholder = "Pilih kategori",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  optionPlaceholder?: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span>
        {label} {required && <b>*</b>}
      </span>
      {options ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{optionPlaceholder}</option>
          {options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          placeholder={placeholder}
          min={type === "number" ? 0 : undefined}
        />
      )}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";
  const categoryIcon: IconName =
    transaction.category === "Makanan"
      ? "food"
      : transaction.category === "Transportasi"
        ? "transport"
        : transaction.category === "Kos"
          ? "house"
          : isIncome
            ? "arrow-down"
            : "wallet";
  return (
    <div className="transaction-row">
      <div className={`transaction-icon ${isIncome ? "income" : ""}`}>
        <Icon name={categoryIcon} size={19} />
      </div>
      <div className="transaction-main">
        <strong>{transaction.note}</strong>
        <span>
          {transaction.category} · {formatDate(transaction.date)}
        </span>
      </div>
      <strong className={isIncome ? "amount-income" : "amount-expense"}>
        {isIncome ? "+" : "-"}
        {formatShortIDR(transaction.amount)}
      </strong>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state">{text}</div>;
}

function Dashboard({
  transactions,
  onOpenProfile,
}: {
  transactions: Transaction[];
  onOpenProfile: () => void;
}) {
  const budget = 4000000;
  const expenses = transactions.filter((item) => item.type === "expense");
  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget - spent;
  const ratio = remaining / budget;
  const insight =
    ratio > 0.45
      ? {
          status: "Aman",
          className: "safe",
          title: "Keuanganmu masih terkendali",
          text: "Pengeluaranmu masih dalam batas sehat. Pertahankan ritme ini sampai akhir bulan.",
        }
      : ratio > 0.2
        ? {
            status: "Kurang Aman",
            className: "warning",
            title: "Saatnya lebih berhati-hati",
            text: "Kurangi pengeluaran tidak penting agar anggaranmu cukup sampai akhir bulan.",
          }
        : {
            status: "Tidak Aman",
            className: "danger",
            title: "Anggaranmu hampir habis",
            text: "Prioritaskan kebutuhan utama dan hentikan pengeluaran impulsif untuk sementara.",
          };
  const categories = Object.entries(
    expenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="screen-content">
      <header className="page-header greeting">
        <div>
          <h1>Hai, Naya!</h1>
        </div>
        <button
          className="avatar-button"
          aria-label="Buka profil"
          onClick={onOpenProfile}
        >
          NA
        </button>
      </header>

      <section className="budget-card">
        <div className="budget-top">
          <div>
            <span>Anggaran bulan ini</span>
            <strong>{formatIDR(budget)}</strong>
          </div>
          <span className="month-pill">Juni 2025</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, (spent / budget) * 100)}%` }}
          />
        </div>
        <div className="budget-stats">
          <div>
            <span>Terpakai</span>
            <strong>{formatShortIDR(spent)}</strong>
          </div>
          <div>
            <span>Sisa anggaran</span>
            <strong>{formatShortIDR(remaining)}</strong>
          </div>
        </div>
      </section>

      <section className={`insight-card ${insight.className}`}>
        <div className="insight-badge">
          <span />
          {insight.status}
        </div>
        <h3>{insight.title}</h3>
        <p>{insight.text}</p>
      </section>

      <section>
        <SectionTitle title="Pengeluaran terbesar" />
        <div className="category-card">
          {categories.map(([name, amount], index) => {
            const icon: IconName =
              name === "Kos"
                ? "house"
                : name === "Makanan"
                  ? "food"
                  : "transport";
            return (
              <div className="category-tile" key={name}>
                <div className={`category-icon tone-${index + 1}`}>
                  <Icon name={icon} size={20} />
                </div>
                <span className="category-percent">
                  {Math.round((amount / spent) * 100)}%
                </span>
                <strong>{name}</strong>
                <span className="category-amount">
                  {formatShortIDR(amount)}
                </span>
                <span className="category-note">dari pengeluaran</span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="Transaksi terbaru" />
        <div className="list-card">
          {expenses
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
            .slice(0, 3)
            .map((item) => (
              <TransactionRow transaction={item} key={item.id} />
            ))}
        </div>
      </section>
    </div>
  );
}

function ShoppingList({
  items,
  onToggle,
  onAdd,
}: {
  items: ShoppingItem[];
  onToggle: (item: ShoppingItem) => void;
  onAdd: () => void;
}) {
  const [expanded, setExpanded] = useState<"unpurchased" | "purchased" | null>(
    null,
  );
  const unpurchased = items.filter((item) => !item.purchased);
  const purchased = items.filter((item) => item.purchased);
  const estimated = unpurchased.reduce((sum, item) => sum + item.price, 0);

  const renderItem = (item: ShoppingItem) => (
    <div
      className={`shopping-row ${item.purchased ? "purchased" : ""}`}
      key={item.id}
    >
      <button
        className="check-button"
        onClick={() => onToggle(item)}
        aria-label={
          item.purchased
            ? `Tandai ${item.name} belum dibeli`
            : `Tandai ${item.name} sudah dibeli`
        }
      >
        {item.purchased && <Icon name="check" size={15} />}
      </button>
      <div className="shopping-main">
        <strong>{item.name}</strong>
        <div className="shopping-meta">
          <span>{item.category}</span>
          <span
            className={`priority-badge priority-${item.priority.toLowerCase()}`}
          >
            {item.priority}
          </span>
          <span className="target-date">
            <Icon name="calendar" size={12} />
            {formatTargetDate(item.targetDate)}
          </span>
        </div>
      </div>
      <div className="shopping-price">
        <strong>
          {formatShortIDR(
            item.purchased ? (item.actualPrice ?? item.price) : item.price,
          )}
        </strong>
        <small>{item.purchased ? "Aktual" : "Estimasi"}</small>
      </div>
    </div>
  );

  return (
    <div className="screen-content shopping-screen">
      <header className="page-header">
        <div>
          <h1>List Kebutuhan</h1>
        </div>
      </header>

      <section className="estimate-card" aria-live="polite">
        <div className="estimate-icon">
          <Icon name="cart" size={24} />
        </div>
        <div className="estimate-copy">
          <div className="estimate-stat">
            <span>Total estimasi</span>
            <strong>{formatShortIDR(estimated)}</strong>
          </div>
          <div className="estimate-stat estimate-count">
            <span>Belum dibeli</span>
            <strong>{unpurchased.length} barang</strong>
          </div>
        </div>
      </section>

      <Button className="wide-button" onClick={onAdd}>
        <Icon name="plus" size={18} />
        Tambah kebutuhan
      </Button>

      <section>
        <SectionTitle
          title="Belum dibeli"
          action={expanded === "unpurchased" ? "Tutup" : "Lihat Semua"}
          onAction={() =>
            setExpanded(expanded === "unpurchased" ? null : "unpurchased")
          }
        />
        <div className="list-card">
          {(expanded === "unpurchased"
            ? unpurchased
            : unpurchased.slice(0, 3)
          ).map(renderItem)}
          {!unpurchased.length && (
            <EmptyState text="Semua kebutuhan sudah terbeli." />
          )}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Sudah dibeli"
          action={expanded === "purchased" ? "Tutup" : "Lihat Semua"}
          onAction={() =>
            setExpanded(expanded === "purchased" ? null : "purchased")
          }
        />
        <div className="list-card">
          {(expanded === "purchased" ? purchased : purchased.slice(0, 3)).map(
            renderItem,
          )}
          {!purchased.length && (
            <EmptyState text="Belum ada barang yang dibeli." />
          )}
        </div>
      </section>
    </div>
  );
}

function Finance({ transactions }: { transactions: Transaction[] }) {
  const [expanded, setExpanded] = useState<TransactionType | null>(null);
  const income = transactions
    .filter((item) => item.type === "income")
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const expenses = transactions
    .filter((item) => item.type === "expense")
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="screen-content finance-screen">
      <header className="page-header">
        <div>
          <h1>Keuangan</h1>
        </div>
        <time className="month-pill light" dateTime="2025-06">
          Juni 2025
        </time>
      </header>

      <div className="summary-grid">
        <section className="summary-card income-summary">
          <div className="summary-icon">
            <Icon name="arrow-down" size={18} />
          </div>
          <span>Total pemasukan</span>
          <strong>{formatShortIDR(totalIncome)}</strong>
        </section>
        <section className="summary-card expense-summary">
          <div className="summary-icon">
            <Icon name="arrow-up" size={18} />
          </div>
          <span>Total pengeluaran</span>
          <strong>{formatShortIDR(totalExpense)}</strong>
        </section>
      </div>

      <section className="balance-card">
        <div>
          <span>Uang aktual tersisa</span>
          <strong>{formatIDR(totalIncome - totalExpense)}</strong>
        </div>
        <div className="balance-mark">
          <Icon name="wallet" size={24} />
        </div>
      </section>

      <section>
        <SectionTitle
          title="Pemasukan terbaru"
          action={expanded === "income" ? "Tutup" : "Lihat Semua"}
          onAction={() => setExpanded(expanded === "income" ? null : "income")}
        />
        <div className="list-card">
          {(expanded === "income" ? income : income.slice(0, 3)).map((item) => (
            <TransactionRow transaction={item} key={item.id} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Pengeluaran terbaru"
          action={expanded === "expense" ? "Tutup" : "Lihat Semua"}
          onAction={() =>
            setExpanded(expanded === "expense" ? null : "expense")
          }
        />
        <div className="list-card">
          {(expanded === "expense" ? expenses : expenses.slice(0, 3)).map(
            (item) => (
              <TransactionRow transaction={item} key={item.id} />
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      className={`toggle ${checked ? "on" : ""}`}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
    >
      <span />
    </button>
  );
}

function Profile() {
  const [name, setName] = useState("Naya Ardhani");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [notifications, setNotifications] = useState(true);
  const [budgetReminder, setBudgetReminder] = useState(true);

  const saveName = () => {
    if (draft.trim()) setName(draft.trim());
    setEditing(false);
  };

  return (
    <div className="screen-content profile-screen">
      <header className="page-header">
        <div>
          <h1>Profil</h1>
        </div>
      </header>

      <section className="profile-card">
        <div className="profile-avatar">NA</div>
        {editing ? (
          <div className="edit-name">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoFocus
              aria-label="Nama profil"
            />
            <Button onClick={saveName}>Simpan</Button>
          </div>
        ) : (
          <>
            <h2>{name}</h2>
            <p>naya.ardhani@email.com</p>
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Icon name="edit" size={16} />
              Edit profil
            </Button>
          </>
        )}
      </section>

      <section>
        <SectionTitle title="Preferensi" />
        <div className="settings-card">
          <div className="setting-row">
            <div className="setting-icon">
              <Icon name="bell" size={19} />
            </div>
            <div>
              <strong>Notifikasi transaksi</strong>
              <span>Info saat ada aktivitas baru</span>
            </div>
            <Toggle
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </div>
          <div className="setting-row">
            <div className="setting-icon">
              <Icon name="shield" size={19} />
            </div>
            <div>
              <strong>Pengingat anggaran</strong>
              <span>Peringatan saat mendekati batas</span>
            </div>
            <Toggle
              checked={budgetReminder}
              onChange={() => setBudgetReminder(!budgetReminder)}
            />
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="Tentang" />
        <div className="settings-card">
          <button className="setting-row about-row">
            <div className="setting-icon">
              <Icon name="info" size={19} />
            </div>
            <div>
              <strong>Tentang KosMate</strong>
              <span>Versi 1.0.0</span>
            </div>
            <Icon name="chevron" size={18} />
          </button>
        </div>
      </section>
      <p className="profile-note">Dibuat untuk menemani hidup mandirimu.</p>
    </div>
  );
}

function Sheet({
  title,
  children,
  onClose,
}: {
  title?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="sheet-layer" role="presentation" onMouseDown={onClose}>
      <section
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        {title && (
          <div className="sheet-header">
            <h2>{title}</h2>
            <button onClick={onClose} aria-label="Tutup">
              <Icon name="close" />
            </button>
          </div>
        )}
        {children}
      </section>
    </div>
  );
}

function AddTransactionForm({
  type,
  onCancel,
  onSave,
}: {
  type: TransactionType;
  onCancel: () => void;
  onSave: (transaction: Omit<Transaction, "id">) => void;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2025-06-14");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isExpense = type === "expense";

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!amount || Number(amount) <= 0)
      nextErrors.amount = "Masukkan nominal yang valid.";
    if (!date) nextErrors.date = "Tanggal wajib dipilih.";
    if (isExpense && !category)
      nextErrors.category = "Pilih kategori pengeluaran.";
    if (isExpense && !note.trim())
      nextErrors.note = "Catatan pengeluaran wajib diisi.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      type,
      amount: Number(amount),
      date,
      note: note.trim() || "Pemasukan baru",
      category: isExpense ? category : "Lainnya",
    });
  };

  return (
    <form onSubmit={submit} className="form-stack">
      <Field
        label="Nominal"
        value={amount}
        onChange={setAmount}
        type="number"
        placeholder="Contoh: 250000"
        required
        error={errors.amount}
      />
      <Field
        label="Tanggal"
        value={date}
        onChange={setDate}
        type="date"
        required
        error={errors.date}
      />
      {isExpense && (
        <Field
          label="Kategori"
          value={category}
          onChange={setCategory}
          options={expenseCategories}
          required
          error={errors.category}
        />
      )}
      <Field
        label="Catatan"
        value={note}
        onChange={setNote}
        placeholder={isExpense ? "Contoh: Makan siang" : "Contoh: Bonus proyek"}
        required={isExpense}
        error={errors.note}
      />
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

function AddShoppingForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (item: Omit<ShoppingItem, "id" | "purchased">) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState<ShoppingPriority | "">("");
  const [targetDate, setTargetDate] = useState("2025-06-20");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const categories = [
    "Kamar",
    "Dapur",
    "Kebersihan",
    "Belajar",
    "Elektronik",
    "Lainnya",
  ];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Nama barang wajib diisi.";
    if (!category) nextErrors.category = "Pilih kategori barang.";
    if (!price || Number(price) <= 0)
      nextErrors.price = "Masukkan estimasi harga yang valid.";
    if (!priority) nextErrors.priority = "Pilih prioritas kebutuhan.";
    if (!targetDate) nextErrors.targetDate = "Target tanggal wajib diisi.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      name: name.trim(),
      category,
      price: Number(price),
      priority: priority as ShoppingPriority,
      targetDate,
    });
  };

  return (
    <form onSubmit={submit} className="form-stack">
      <Field
        label="Nama barang"
        value={name}
        onChange={setName}
        placeholder="Contoh: Sprei kasur"
        required
        error={errors.name}
      />
      <Field
        label="Kategori"
        value={category}
        onChange={setCategory}
        options={categories}
        required
        error={errors.category}
      />
      <Field
        label="Estimasi harga"
        value={price}
        onChange={setPrice}
        type="number"
        placeholder="Contoh: 150000"
        required
        error={errors.price}
      />
      <Field
        label="Prioritas"
        value={priority}
        onChange={(value) => setPriority(value as ShoppingPriority)}
        options={["Tinggi", "Sedang", "Rendah"]}
        optionPlaceholder="Pilih prioritas"
        required
        error={errors.priority}
      />
      <Field
        label="Target tanggal"
        value={targetDate}
        onChange={setTargetDate}
        type="date"
        required
        error={errors.targetDate}
      />
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Tambah</Button>
      </div>
    </form>
  );
}

function ConfirmPurchaseForm({
  item,
  onCancel,
  onSave,
}: {
  item: ShoppingItem;
  onCancel: () => void;
  onSave: (actualPrice: number) => void;
}) {
  const [actualPrice, setActualPrice] = useState(String(item.price));
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!actualPrice || Number(actualPrice) <= 0) {
      setError("Masukkan harga aktual yang valid.");
      return;
    }
    onSave(Number(actualPrice));
  };

  return (
    <form onSubmit={submit} className="form-stack">
      <div className="purchase-context">
        <span>{item.name}</span>
        <strong>Estimasi {formatShortIDR(item.price)}</strong>
      </div>
      <Field
        label="Harga aktual"
        value={actualPrice}
        onChange={setActualPrice}
        type="number"
        placeholder="Masukkan harga saat dibeli"
        required
        error={error}
      />
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Tandai dibeli</Button>
      </div>
    </form>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [shoppingItems, setShoppingItems] = useState(initialShoppingItems);
  const [sheet, setSheet] = useState<
    "quick" | "income" | "expense" | "shopping" | "purchase" | null
  >(null);
  const [selectedShoppingId, setSelectedShoppingId] = useState<number | null>(
    null,
  );
  const [toast, setToast] = useState("");
  const selectedShoppingItem = shoppingItems.find(
    (item) => item.id === selectedShoppingId,
  );

  const latestId = useMemo(
    () =>
      Math.max(
        ...transactions.map((item) => item.id),
        ...shoppingItems.map((item) => item.id),
      ) + 1,
    [transactions, shoppingItems],
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    setTransactions((current) => [
      ...current,
      { ...transaction, id: latestId },
    ]);
    setSheet(null);
    setScreen("finance");
    showToast(
      transaction.type === "income"
        ? "Pemasukan berhasil ditambahkan"
        : "Pengeluaran berhasil ditambahkan",
    );
  };

  const addShoppingItem = (item: Omit<ShoppingItem, "id" | "purchased">) => {
    setShoppingItems((current) => [
      ...current,
      { ...item, id: latestId, purchased: false },
    ]);
    setSheet(null);
    showToast("Kebutuhan baru berhasil ditambahkan");
  };

  return (
    <main className="app-shell">
      <div className="phone-frame">
        <div className="app-scroll">
          {screen === "dashboard" && (
            <Dashboard
              transactions={transactions}
              onOpenProfile={() => setScreen("profile")}
            />
          )}
          {screen === "list" && (
            <ShoppingList
              items={shoppingItems}
              onAdd={() => setSheet("shopping")}
              onToggle={(item) => {
                if (item.purchased) {
                  setShoppingItems((current) =>
                    current.map((currentItem) =>
                      currentItem.id === item.id
                        ? {
                            ...currentItem,
                            purchased: false,
                            actualPrice: undefined,
                          }
                        : currentItem,
                    ),
                  );
                  showToast("Item dikembalikan ke daftar belum dibeli");
                  return;
                }
                setSelectedShoppingId(item.id);
                setSheet("purchase");
              }}
            />
          )}
          {screen === "finance" && <Finance transactions={transactions} />}
          {screen === "profile" && <Profile />}
        </div>

        <nav className="bottom-nav" aria-label="Navigasi utama">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.id}
              className={screen === item.id ? "active" : ""}
              onClick={() => setScreen(item.id)}
            >
              <Icon name={item.icon} size={21} />
              <span>{item.label}</span>
            </button>
          ))}
          <button
            className="plus-nav"
            onClick={() => setSheet("quick")}
            aria-label="Tambah transaksi"
          >
            <Icon name="plus" size={27} />
          </button>
          {navItems.slice(2).map((item) => (
            <button
              key={item.id}
              className={screen === item.id ? "active" : ""}
              onClick={() => setScreen(item.id)}
            >
              <Icon name={item.icon} size={21} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {sheet === "quick" && (
          <Sheet onClose={() => setSheet(null)}>
            <div className="quick-actions">
              <h2>Tambah transaksi</h2>
              <div className="quick-action-grid">
                <button
                  className="quick-action income-action"
                  onClick={() => setSheet("income")}
                >
                  <span>
                    <Icon name="arrow-down" />
                  </span>
                  <div>
                    <strong>Tambah Pemasukan</strong>
                    <small>Gaji, uang saku, atau pendapatan lain</small>
                  </div>
                  <Icon name="chevron" size={18} />
                </button>
                <button
                  className="quick-action expense-action"
                  onClick={() => setSheet("expense")}
                >
                  <span>
                    <Icon name="arrow-up" />
                  </span>
                  <div>
                    <strong>Tambah Pengeluaran</strong>
                    <small>Belanja, tagihan, atau kebutuhan harian</small>
                  </div>
                  <Icon name="chevron" size={18} />
                </button>
              </div>
              <Button
                variant="secondary"
                className="wide-button"
                onClick={() => setSheet(null)}
              >
                Batal
              </Button>
            </div>
          </Sheet>
        )}
        {(sheet === "income" || sheet === "expense") && (
          <Sheet
            title={
              sheet === "income" ? "Tambah Pemasukan" : "Tambah Pengeluaran"
            }
            onClose={() => setSheet(null)}
          >
            <AddTransactionForm
              type={sheet}
              onCancel={() => setSheet(null)}
              onSave={addTransaction}
            />
          </Sheet>
        )}
        {sheet === "shopping" && (
          <Sheet title="Tambah Kebutuhan" onClose={() => setSheet(null)}>
            <AddShoppingForm
              onCancel={() => setSheet(null)}
              onSave={addShoppingItem}
            />
          </Sheet>
        )}
        {sheet === "purchase" && selectedShoppingItem && (
          <Sheet title="Konfirmasi Pembelian" onClose={() => setSheet(null)}>
            <ConfirmPurchaseForm
              item={selectedShoppingItem}
              onCancel={() => setSheet(null)}
              onSave={(actualPrice) => {
                setShoppingItems((current) =>
                  current.map((item) =>
                    item.id === selectedShoppingItem.id
                      ? { ...item, purchased: true, actualPrice }
                      : item,
                  ),
                );
                setSelectedShoppingId(null);
                setSheet(null);
                showToast("Harga aktual disimpan dan item ditandai dibeli");
              }}
            />
          </Sheet>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </main>
  );
}

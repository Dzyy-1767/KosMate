// KONSEP #3: Kode error bertipe agar pemanggil dapat membedakan alasan transfer gagal.
export type TransferErrorCode = 'INSUFFICIENT_BALANCE' | 'INVALID_ACCOUNT' | 'SERVER_BUSY' | 'INVALID_AMOUNT';

export class TransferError extends Error {
  constructor(
    message: string,
    public readonly code: TransferErrorCode
  ) {
    super(message);
    this.name = 'TransferError';
  }
}

export interface BalanceApproval {
  transferAmount: number;
  adminFee: number;
  totalDebit: number;
  remainingBalance: number;
}

export interface ValidatedAccount {
  accountNumber: string;
}

export interface TransferReceipt {
  referenceId: string;
  accountNumber: string;
  transferAmount: number;
  adminFee: number;
  totalDebit: number;
  remainingBalance: number;
  completedAt: string;
}

export interface TransferInput {
  accountNumber: string;
  transferAmount: number;
  balance: number;
}

export interface TransferLifecycleCallbacks {
  onFinally?: () => void;
}

const TRANSFER_FEE = 2500;
const FEE_FREE_MINIMUM = 100000;

// KONSEP #3: Fungsi ini menghitung biaya; transfer tepat Rp100.000 sudah bebas biaya.
export function calculateTransferFee(amount: number): number {
  return amount < FEE_FREE_MINIMUM ? TRANSFER_FEE : 0;
}

// KONSEP #3: Promise manual menunda validasi saldo lalu resolve atau reject setelah simulasi.
export function checkBalance(balance: number, transferAmount: number): Promise<BalanceApproval> {
  return new Promise<BalanceApproval>((resolve, reject) => {
    setTimeout(() => {
      if (!Number.isFinite(balance) || balance < 0 || !Number.isFinite(transferAmount) || transferAmount <= 0) {
        reject(new TransferError('Nominal transfer tidak valid.', 'INVALID_AMOUNT'));
        return;
      }

      const adminFee = calculateTransferFee(transferAmount);
      const totalDebit = transferAmount + adminFee;

      if (balance < totalDebit) {
        reject(new TransferError('Saldo tidak cukup untuk nominal dan biaya admin.', 'INSUFFICIENT_BALANCE'));
        return;
      }

      resolve({
        transferAmount,
        adminFee,
        totalDebit,
        remainingBalance: balance - totalDebit,
      });
    }, 350);
  });
}

// KONSEP #3: Promise manual memeriksa rekening dengan aturan nomor rekening 10 sampai 16 digit.
export function validateAccount(accountNumber: string): Promise<ValidatedAccount> {
  return new Promise<ValidatedAccount>((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{10,16}$/.test(accountNumber)) {
        reject(new TransferError('Nomor rekening harus terdiri dari 10–16 digit.', 'INVALID_ACCOUNT'));
        return;
      }

      resolve({ accountNumber });
    }, 350);
  });
}

// KONSEP #3: Promise manual mensimulasikan server sibuk dengan peluang gagal sebesar 10 persen.
export function processTransfer(approval: BalanceApproval, accountNumber: string): Promise<TransferReceipt> {
  return new Promise<TransferReceipt>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new TransferError('Server sedang sibuk. Silakan coba lagi.', 'SERVER_BUSY'));
        return;
      }

      resolve({
        referenceId: `TRF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        accountNumber,
        transferAmount: approval.transferAmount,
        adminFee: approval.adminFee,
        totalDebit: approval.totalDebit,
        remainingBalance: approval.remainingBalance,
        completedAt: new Date().toISOString(),
      });
    }, 700);
  });
}

// KONSEP #3: Alur ini mengonsumsi Promise manual memakai then, catch, dan finally berurutan.
export function executeTransfer(
  input: TransferInput,
  callbacks: TransferLifecycleCallbacks = {}
): Promise<TransferReceipt> {
  return validateAccount(input.accountNumber)
    .then((account) => checkBalance(input.balance, input.transferAmount)
      .then((approval) => processTransfer(approval, account.accountNumber)))
    .catch((error: unknown) => {
      if (error instanceof TransferError) throw error;
      throw new TransferError('Transfer gagal karena kesalahan yang tidak diketahui.', 'SERVER_BUSY');
    })
    .finally(() => callbacks.onFinally?.());
}

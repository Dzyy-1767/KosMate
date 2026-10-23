import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO } from '../models/Transaction.js';

export class TransactionController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || 'usr_demo_1';
    const { type, category } = req.query;

    let list = Array.from(db.transactions.values()).filter((t) => t.userId === userId);

    if (type && (type === 'expense' || type === 'income')) {
      list = list.filter((t) => t.type === type);
    }

    if (category) {
      list = list.filter((t) => t.category.toLowerCase() === String(category).toLowerCase());
    }

    // Sort descending by date
    list.sort((a, b) => b.date.localeCompare(a.date));

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const tx = db.transactions.get(id);

    if (!tx) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
      return;
    }

    res.json({ success: true, data: tx });
  }

  public static async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || 'usr_demo_1';
    const { title, amount, type, category, date, note }: CreateTransactionDTO = req.body;

    if (!title || !amount || !type || !category || !date) {
      res.status(400).json({
        success: false,
        message: 'Field title, amount, type, category, dan date wajib diisi',
      });
      return;
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      userId,
      title,
      amount: Number(amount),
      type,
      category,
      date,
      note: note || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.transactions.set(newTx.id, newTx);

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil disimpan',
      data: newTx,
    });
  }

  public static async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const tx = db.transactions.get(id);

    if (!tx) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
      return;
    }

    const { title, amount, type, category, date, note }: UpdateTransactionDTO = req.body;

    if (title !== undefined) tx.title = title;
    if (amount !== undefined) tx.amount = Number(amount);
    if (type !== undefined) tx.type = type;
    if (category !== undefined) tx.category = category;
    if (date !== undefined) tx.date = date;
    if (note !== undefined) tx.note = note;
    tx.updatedAt = new Date();

    db.transactions.set(id, tx);

    res.json({
      success: true,
      message: 'Transaksi berhasil diperbarui',
      data: tx,
    });
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    if (!db.transactions.has(id)) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
      return;
    }

    db.transactions.delete(id);

    res.json({
      success: true,
      message: 'Transaksi berhasil dihapus',
    });
  }
}

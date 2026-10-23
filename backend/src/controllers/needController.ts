import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { ShoppingItem, CreateShoppingItemDTO, UpdateShoppingItemDTO } from '../models/ShoppingItem.js';

export class NeedController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || 'usr_demo_1';
    const { purchased } = req.query;

    let list = Array.from(db.shoppingItems.values()).filter((item) => item.userId === userId);

    if (purchased !== undefined) {
      const isPurchased = purchased === 'true';
      list = list.filter((item) => item.purchased === isPurchased);
    }

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const item = db.shoppingItems.get(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item kebutuhan tidak ditemukan' });
      return;
    }

    res.json({ success: true, data: item });
  }

  public static async create(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || 'usr_demo_1';
    const { name, category, priority, price }: CreateShoppingItemDTO = req.body;

    if (!name || !category) {
      res.status(400).json({
        success: false,
        message: 'Nama dan kategori kebutuhan wajib diisi',
      });
      return;
    }

    const newItem: ShoppingItem = {
      id: `need_${Date.now()}`,
      userId,
      name,
      category,
      priority: priority || 'Sedang',
      price: price ? Number(price) : undefined,
      purchased: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    db.shoppingItems.set(newItem.id, newItem);

    res.status(201).json({
      success: true,
      message: 'Kebutuhan berhasil ditambahkan ke daftar',
      data: newItem,
    });
  }

  public static async toggleStatus(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { actualPrice } = req.body;
    const item = db.shoppingItems.get(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item kebutuhan tidak ditemukan' });
      return;
    }

    item.purchased = !item.purchased;
    item.purchasedAt = item.purchased ? new Date() : undefined;
    if (actualPrice !== undefined) {
      item.price = Number(actualPrice);
    }
    item.updatedAt = new Date();

    db.shoppingItems.set(id, item);

    res.json({
      success: true,
      message: item.purchased ? 'Item ditandai sudah dibeli' : 'Status diubah ke belum dibeli',
      data: item,
    });
  }

  public static async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const item = db.shoppingItems.get(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Item kebutuhan tidak ditemukan' });
      return;
    }

    const { name, category, priority, price, purchased }: UpdateShoppingItemDTO = req.body;

    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (priority !== undefined) item.priority = priority;
    if (price !== undefined) item.price = Number(price);
    if (purchased !== undefined) item.purchased = purchased;
    item.updatedAt = new Date();

    db.shoppingItems.set(id, item);

    res.json({
      success: true,
      message: 'Kebutuhan berhasil diperbarui',
      data: item,
    });
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    if (!db.shoppingItems.has(id)) {
      res.status(404).json({ success: false, message: 'Item kebutuhan tidak ditemukan' });
      return;
    }

    db.shoppingItems.delete(id);

    res.json({
      success: true,
      message: 'Item kebutuhan berhasil dihapus',
    });
  }
}

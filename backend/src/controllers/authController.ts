import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { RegisterDTO, LoginDTO, User } from '../models/User.js';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, phone, kosName, roomNumber, monthlyBudget }: RegisterDTO = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Nama, email, dan password wajib diisi',
        });
        return;
      }

      // Check if user already exists
      const existing = Array.from(db.users.values()).find((u) => u.email === email);
      if (existing) {
        res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar. Silakan login.',
        });
        return;
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name,
        email,
        passwordHash: `hash_${password}`,
        phone,
        kosName,
        roomNumber,
        monthlyBudget: monthlyBudget || 1500000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      db.users.set(newUser.id, newUser);

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            kosName: newUser.kosName,
            roomNumber: newUser.roomNumber,
            monthlyBudget: newUser.monthlyBudget,
          },
          token: `token_${newUser.id}`,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDTO = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email dan password wajib diisi',
        });
        return;
      }

      const user = Array.from(db.users.values()).find((u) => u.email === email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Email atau password salah',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            kosName: user.kosName,
            roomNumber: user.roomNumber,
            monthlyBudget: user.monthlyBudget,
          },
          token: `token_${user.id}`,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || 'usr_demo_1';
    const user = db.users.get(userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        kosName: user.kosName,
        roomNumber: user.roomNumber,
        monthlyBudget: user.monthlyBudget,
      },
    });
  }

  public static async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || 'usr_demo_1';
    const user = db.users.get(userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      return;
    }

    const { name, phone, kosName, roomNumber, monthlyBudget } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (kosName !== undefined) user.kosName = kosName;
    if (roomNumber !== undefined) user.roomNumber = roomNumber;
    if (monthlyBudget !== undefined) user.monthlyBudget = Number(monthlyBudget);
    user.updatedAt = new Date();

    db.users.set(userId, user);

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: user,
    });
  }
}

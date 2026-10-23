import { Request, Response } from 'express';
import { db } from '../config/database.js';

export class SummaryController {
  public static async getDashboardStats(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || 'usr_demo_1';
    const user = db.users.get(userId);
    const txs = Array.from(db.transactions.values()).filter((t) => t.userId === userId);
    const needs = Array.from(db.shoppingItems.values()).filter((n) => n.userId === userId);

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    txs.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const monthlyBudget = user?.monthlyBudget || 1500000;
    const remainingBudget = monthlyBudget - totalExpense;
    const currentBalance = totalIncome - totalExpense;

    const unpurchasedNeedsCount = needs.filter((n) => !n.purchased).length;
    const estimatedNeedsCost = needs
      .filter((n) => !n.purchased && n.price)
      .reduce((sum, n) => sum + (n.price || 0), 0);

    // Percentage of budget used
    const budgetUsagePercent = Math.min(Math.round((totalExpense / monthlyBudget) * 100), 100);

    res.json({
      success: true,
      data: {
        currentBalance,
        totalIncome,
        totalExpense,
        monthlyBudget,
        remainingBudget,
        budgetUsagePercent,
        unpurchasedNeedsCount,
        estimatedNeedsCost,
        categoryBreakdown: categoryTotals,
      },
    });
  }
}

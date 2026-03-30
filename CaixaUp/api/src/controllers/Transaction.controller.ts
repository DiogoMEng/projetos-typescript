import TransactionService from '../services/Transaction.service';
import { Request, Response } from 'express';

const transactionService = new TransactionService();

class TransactionController {
  static async register(req: Request, res: Response) {
    const { boxBottomId, categoryId } = req.params;
    const { 
      movementType, value, transactionDate, description
     } = req.body;
    try {
      const transaction = await transactionService.create({
        boxBottomId, categoryId, movementType, value, transactionDate, description
      });
      res.status(201).json({ 
        message: `Transaction created successfully.`,
        transaction 
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getAllTransactions(req: Request, res: Response) {
    const userId = req.userId as string;
    try {
      const transactions = await transactionService.getAllTransactionsByUser(userId);
      res.status(200).json(transactions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getTransactionById(req: Request, res: Response) {
    const { transactionId } = req.params;
    try {
      const transaction = await transactionService.getById(transactionId);
      res.status(200).json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      }
    }
  }

  static async editTransaction(req: Request, res: Response) {
    const { transactionId } = req.params;
    const dto = req.body;
    try {
      const updatedRecord = await transactionService.update(transactionId, dto);
      if (!updatedRecord) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async deleteTransaction(req: Request, res: Response) {
    const { transactionId } = req.params;
    try {
      await transactionService.delete(transactionId);
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) { 
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default TransactionController;
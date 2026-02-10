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
      const transaction = await transactionService.register({
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
    const { id } = req.params;
    try {
      const transactions = await transactionService.getAllTransactions(id);
      res.status(200).json(transactions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getTransactionById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const transaction = await transactionService.getTransactionById(id);
      res.status(200).json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      }
    }
  }

  static async editTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const dto = req.body;
    try {
      const updatedRecord = await transactionService.editTransaction(id, dto);
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
    const { id } = req.params;
    try {
      await transactionService.deleteTransaction(id);
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) { 
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default TransactionController;
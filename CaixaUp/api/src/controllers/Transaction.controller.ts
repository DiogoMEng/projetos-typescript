import { catchAsync } from 'utils/catchAsync';
import TransactionService from '../services/Transaction.service';
import { Request, Response } from 'express';

const transactionService = new TransactionService();

class TransactionController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId, categoryId } = req.params;
    const {
      movementType, value, transactionDate, description,
    } = req.body;
    const transaction = await transactionService.create({
      boxBottomId, categoryId, movementType, value, transactionDate, description,
    });
    res.status(201).json({
      message: 'Transaction created successfully.',
      transaction,
    });
  });

  static getAllTransactions = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const transactions = await transactionService.getAllTransactionsByUser(userId);
    res.status(200).json(transactions);
  });

  static getTransactionById = catchAsync(async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const transaction = await transactionService.getById(transactionId);
    res.status(200).json(transaction);
  });

  static editTransaction = catchAsync(async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const dto = req.body;
    const updatedRecord = await transactionService.update(transactionId, dto);
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction updated successfully' });
  });

  static deleteTransaction = catchAsync(async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    await transactionService.delete(transactionId);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  });
}

export default TransactionController;
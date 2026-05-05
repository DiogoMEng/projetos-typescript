import { Request, Response } from 'express';
import { Controller } from './Controller';
import TransactionService from '../services/Transaction.service';
import { catchAsync } from '../utils/catchAsync';

class TransactionController extends Controller {
  constructor() {
    super(new TransactionService());
  }

  protected override getEntityName() { return 'Transaction'; }
  protected override getParamIdName() { return 'transactionId'; }

  protected override getCreateParams(req: Request) {
    return {
      ...req.body,
      boxBottomId: req.params.boxBottomId,
      categoryId: req.params.categoryId,
    };
  }

  getAllTransactions = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const transactions = await (this.service as TransactionService).getAllTransactionsByUser(userId);
    res.status(200).json(transactions);
  });
}

export default new TransactionController();
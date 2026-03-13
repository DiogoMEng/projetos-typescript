import { Router } from "express";
import TransactionController from "../controllers/Transaction.controller";

const router = Router();

router
  .post('/transactions/register/:boxBottomId/:categoryId', TransactionController.register)
  .get('/transactions/:userId', TransactionController.getAllTransactions)
  .get('/transaction/:transactionId', TransactionController.getTransactionById) 
  .put('/transaction/:id', TransactionController.editTransaction)
  .delete('/transaction/:id', TransactionController.deleteTransaction);

export default router;
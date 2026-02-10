import { Router } from "express";
import TransactionController from "../controllers/Transaction.controller";

const router = Router();

router
  .post('/transactions/register/:boxBottomId/:categoryId', TransactionController.register)
  .get('/transactions/:id', TransactionController.getAllTransactions)
  .get('/transaction/:id', TransactionController.getTransactionById)
  .put('/transaction/:id', TransactionController.editTransaction)
  .delete('/transaction/:id', TransactionController.deleteTransaction);

export default router;
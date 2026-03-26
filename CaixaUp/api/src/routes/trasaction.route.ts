import { Router } from "express";
import TransactionController from "../controllers/Transaction.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth)
router
  .post('/transactions/register/:boxBottomId/:categoryId', TransactionController.register)
  .get('/transactions/', TransactionController.getAllTransactions)
  .get('/transaction/:transactionId', TransactionController.getTransactionById) 
  .put('/transaction/:transactionId', TransactionController.editTransaction)
  .delete('/transaction/:transactionId', TransactionController.deleteTransaction);

export default router;
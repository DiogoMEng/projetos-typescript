import { Router } from "express";
import TransactionController from "../controllers/Transaction.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth)
router
  .post('/box-bottom/:boxBottomId/category/:categoryId', TransactionController.register)
  .get('/', TransactionController.getAllTransactions)
  .get('/:transactionId', TransactionController.getTransactionById) 
  .put('/:transactionId', TransactionController.editTransaction)
  .delete('/:transactionId', TransactionController.deleteTransaction);

export default router;
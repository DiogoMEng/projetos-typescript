import { Router } from 'express';
import TransactionController from '#controllers/Transaction.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import checkRole from '#middlewares/checkRole.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
  createTransactionParamsSchema,
  transactionParamsSchema,
} from '#validations/Transaction.validation.js';

const router = Router();

router.use(checkAuth);
router
  .post('/box-bottom/:boxBottomId/category/:categoryId', validateRequest(createTransactionParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR']), validateRequest(createTransactionSchema, 'body'), TransactionController.register)
  .get('/box-bottom/:boxBottomId', validateRequest(createTransactionParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR', 'ANALYST', 'VIEWER']), TransactionController.getAllTransactions)
  .get('/:transactionId/box-bottom/:boxBottomId', validateRequest(transactionParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR', 'ANALYST', 'VIEWER']), TransactionController.getById)
  .put('/:transactionId/box-bottom/:boxBottomId', validateRequest(transactionParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER', 'EDITOR']), validateRequest(updateTransactionSchema, 'body'), TransactionController.edit)
  .delete('/:transactionId/box-bottom/:boxBottomId', validateRequest(transactionParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER', 'EDITOR']), TransactionController.delete);

export default router;
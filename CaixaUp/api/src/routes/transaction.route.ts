import { Router } from 'express';
import TransactionController from '#controllers/Transaction.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import checkRole from '#middlewares/checkRole.js';

const router = Router();

router.use(checkAuth);
router
  .post('/box-bottom/:boxBottomId/category/:categoryId', checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR']), TransactionController.register)
  .get('/box-bottom/:boxBottomId', checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR', 'ANALYST', 'VIEWER']), TransactionController.getAllTransactions)
  .get('/:transactionId/box-bottom/:boxBottomId', checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR', 'ANALYST', 'VIEWER']), TransactionController.getById)
  .put('/:transactionId/box-bottom/:boxBottomId', checkRole(['OWNER', 'MANAGER', 'EDITOR']), TransactionController.edit)
  .delete('/:transactionId/box-bottom/:boxBottomId', checkRole(['OWNER', 'MANAGER', 'EDITOR']), TransactionController.delete);

export default router;
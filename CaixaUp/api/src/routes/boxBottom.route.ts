import { Router } from 'express';
import BoxBottomController from '../controllers/BoxBottom.controller';
import checkAuth from '../middlewares/checkAuth';
import checkRole from '../middlewares/checkRole';

const router = Router();

router.use(checkAuth);

router
  .post('/', BoxBottomController.register)
  .get('/', BoxBottomController.getAllBoxBottomsByUser)
  .get('/:boxBottomId', checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR', 'ANALYST', 'VIEWER']), BoxBottomController.getById)
  .put('/:boxBottomId', checkRole(['OWNER', 'MANAGER']), BoxBottomController.edit)
  .delete('/:boxBottomId', checkRole(['OWNER']), BoxBottomController.delete);

export default router;
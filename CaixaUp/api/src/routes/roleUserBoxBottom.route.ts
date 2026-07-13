import { Router } from 'express';
import RoleUserBoxBottomController from '#controllers/RoleUserBoxBottom.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import checkRole from '#middlewares/checkRole.js';

const router = Router();

router.use(checkAuth);
router
  .post('/box-bottom/:boxBottomId/register/', checkRole(['OWNER', 'MANAGER']), RoleUserBoxBottomController.register)
  .get('/box-bottom/:boxBottomId', checkRole(['OWNER', 'MANAGER', 'ANALYST']), RoleUserBoxBottomController.getAllMembers)
  .put('/box-bottom/:userId/:boxBottomId', checkRole(['OWNER', 'MANAGER']), RoleUserBoxBottomController.editRole)
  .delete('/:roleUserBoxBottomId/box-bottom/:boxBottomId', checkRole(['OWNER', 'MANAGER']), RoleUserBoxBottomController.deleteBoxBottom);

export default router;
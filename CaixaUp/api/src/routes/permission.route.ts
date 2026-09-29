import { Router } from 'express';
import PermissionController from '#controllers/Permission.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import checkRole from '#middlewares/checkRole.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import {
  createRoleUserBoxBottomSchema,
  editRoleUserBoxBottomSchema,
  roleUserBoxBottomCreateParamsSchema,
  roleUserBoxBottomGetParamsSchema,
  roleUserBoxBottomEditParamsSchema,
  roleUserBoxBottomDeleteParamsSchema,
} from '#validations/RoleUserBoxBottom.validation.js';

const router = Router();

router.use(checkAuth);
router
  .post('/box-bottom/:boxBottomId/register/', validateRequest(roleUserBoxBottomCreateParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER']), validateRequest(createRoleUserBoxBottomSchema, 'body'), PermissionController.register)
  .get('/box-bottom/:boxBottomId', validateRequest(roleUserBoxBottomGetParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER', 'ANALYST']), PermissionController.getAllMembers)
  .put('/box-bottom/:userId/:boxBottomId', validateRequest(roleUserBoxBottomEditParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER']), validateRequest(editRoleUserBoxBottomSchema, 'body'), PermissionController.editRole)
  .delete('/:permissionId/box-bottom/:boxBottomId', validateRequest(roleUserBoxBottomDeleteParamsSchema, 'params'), checkRole(['OWNER', 'MANAGER']), PermissionController.deleteBoxBottom);

export default router;
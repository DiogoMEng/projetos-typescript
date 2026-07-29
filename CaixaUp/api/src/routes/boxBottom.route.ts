import { Router } from 'express';
import BoxBottomController from '#controllers/BoxBottom.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import checkRole from '#middlewares/checkRole.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import { createBoxBottomSchema, updateBoxBottomSchema } from '#validations/BoxBottom.validation.js';
import { uuidParam } from '#validations/common.validation.js';

const router = Router();

router.use(checkAuth);

const boxBottomIdSchema = uuidParam('boxBottomId');

router
  .post('/', validateRequest(createBoxBottomSchema, 'body'), BoxBottomController.register)
  .get('/', BoxBottomController.getAllBoxBottomsByUser)
  .get('/:boxBottomId', validateRequest(boxBottomIdSchema, 'params'), checkRole(['OWNER', 'MANAGER', 'EDITOR', 'CONTRIBUTOR', 'ANALYST', 'VIEWER']), BoxBottomController.getById)
  .put('/:boxBottomId', validateRequest(boxBottomIdSchema, 'params'), checkRole(['OWNER', 'MANAGER']), validateRequest(updateBoxBottomSchema, 'body'), BoxBottomController.edit)
  .delete('/:boxBottomId', validateRequest(boxBottomIdSchema, 'params'), checkRole(['OWNER']), BoxBottomController.delete);

export default router;
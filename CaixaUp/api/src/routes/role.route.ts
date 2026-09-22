import { Router } from 'express';
import RoleController from '#controllers/Role.controller.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import { createRoleSchema } from '#validations/Role.validation.js';

const router = Router();

router
  .post(
    '/register',
    validateRequest(createRoleSchema, 'body'),
    RoleController.register,
  )
  .get('/', RoleController.getAll);

export default router;

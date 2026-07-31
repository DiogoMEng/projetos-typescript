import { Router } from 'express';
import UserController from '#controllers/User.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import { createUserSchema, updateUserSchema } from '#validations/User.validation.js';
import { objectIdParam } from '#validations/common.validation.js';

const router = Router();
const userIdParamSchema = objectIdParam('id');

router
  .post('/', validateRequest(createUserSchema, 'body'), UserController.register)
  .get('/', checkAuth, UserController.getAll)
  .get('/:id', validateRequest(userIdParamSchema, 'params'), checkAuth, UserController.getById)
  .put('/:id', validateRequest(userIdParamSchema, 'params'), validateRequest(updateUserSchema, 'body'), checkAuth, UserController.edit)
  .delete('/:id', validateRequest(userIdParamSchema, 'params'), checkAuth, UserController.delete);

export default router;
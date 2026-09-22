import { Router } from 'express';
import UserController from '#controllers/User.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import {
  createUserSchema,
  updateUserSchema,
} from '#validations/User.validation.js';
import { uuidParam } from '#validations/common.validation.js';

const router = Router();
const userIdParamSchema = uuidParam('userId');

router
  .post('/', validateRequest(createUserSchema, 'body'), UserController.register)
  .get('/', checkAuth, UserController.getAll)
  .get(
    '/:userId',
    validateRequest(userIdParamSchema, 'params'),
    checkAuth,
    UserController.getById,
  )
  .put(
    '/:userId',
    validateRequest(userIdParamSchema, 'params'),
    validateRequest(updateUserSchema, 'body'),
    checkAuth,
    UserController.edit,
  )
  .delete(
    '/:userId',
    validateRequest(userIdParamSchema, 'params'),
    checkAuth,
    UserController.delete,
  );

export default router;

import { Router } from 'express';
import AuthController from '#controllers/auth.controller.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import { loginSchema } from '#validations/Auth.validation.js';

const router = Router();

router
  .post('/login', validateRequest(loginSchema, 'body'), AuthController.login);

export default router;
import { Router } from 'express';
import UserController from '#controllers/User.controller.js';
import checkAuth from '#middlewares/checkAuth.js';

const router = Router();

router
  .post('/', UserController.register)
  .get('/', checkAuth, UserController.getAll)
  .get('/:id', checkAuth, UserController.getById)
  .put('/:id', checkAuth, UserController.edit)
  .delete('/:id', checkAuth, UserController.delete);

export default router;
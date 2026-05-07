import { Router } from 'express';
import UserController from '../controllers/User.controller';
import checkAuth from '../middlewares/checkAuth';

const router = Router();

router
  .post('/', UserController.register)
  .get('/', checkAuth, UserController.getAll)
  .get('/:id', checkAuth, UserController.getById)
  .put('/:id', checkAuth, UserController.edit)
  .delete('/:id', checkAuth, UserController.delete);

export default router;
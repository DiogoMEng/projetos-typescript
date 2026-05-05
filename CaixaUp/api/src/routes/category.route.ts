import { Router } from 'express';
import CategoryController from '../controllers/Category.controller';
import checkAuth from '../middlewares/checkAuth';

const router = Router();

router.use(checkAuth);
router
  .post('/', CategoryController.register)
  .get('/', CategoryController.getAllCategoriesByUser)
  .get('/:categoryId', CategoryController.getById)
  .put('/:categoryId', CategoryController.edit)
  .delete('/:categoryId', CategoryController.delete);

export default router;
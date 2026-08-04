import { Router } from 'express';
import CategoryController from '#controllers/Category.controller.js';
import checkAuth from '#middlewares/checkAuth.js';
import { validateRequest } from '#middlewares/validateRequest.js';
import { createCategorySchema, updateCategorySchema } from '#validations/Category.validation.js';
import { uuidParam } from '#validations/common.validation.js';

const router = Router();

router.use(checkAuth);
const categoryIdSchema = uuidParam('categoryId');

router
  .post('/', validateRequest(createCategorySchema, 'body'), CategoryController.register)
  .get('/', CategoryController.getAllCategoriesByUser)
  .get('/:categoryId', validateRequest(categoryIdSchema, 'params'), CategoryController.getById)
  .put('/:categoryId', validateRequest(categoryIdSchema, 'params'), validateRequest(updateCategorySchema, 'body'), CategoryController.edit)
  .delete('/:categoryId', validateRequest(categoryIdSchema, 'params'), CategoryController.delete);

export default router;
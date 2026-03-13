import { Router } from "express";
import CategoryController from "../controllers/Category.controller";

const router = Router();

router
  .post('/category/register/:userId', CategoryController.register)
  .get('/categories/:userId', CategoryController.getAllCategoriesByUser)
  .get('/category/:categoryId', CategoryController.getCategoryById)
  .put('/category/:categoryId', CategoryController.editCategory)
  .delete('/category/:categoryId', CategoryController.deleteCategory);

export default router;
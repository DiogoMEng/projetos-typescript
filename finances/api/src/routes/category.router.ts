import { Router } from "express";
import CategoryController from "../controllers/Category.controller";

const router = Router();

router
  .post('/category/register/:id', CategoryController.register)
  .get('/categories/:id', CategoryController.getAllCategoriesByUser)
  .get('/category/:id', CategoryController.getCategoryById)
  .put('/category/:id', CategoryController.editCategory)
  .delete('/category/:id', CategoryController.deleteCategory);

export default router;
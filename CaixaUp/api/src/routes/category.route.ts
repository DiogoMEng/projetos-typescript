import { Router } from "express";
import CategoryController from "../controllers/Category.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth)
router
  .post('/category/register/', CategoryController.register)
  .get('/categories/', CategoryController.getAllCategoriesByUser)
  .get('/category/:categoryId', CategoryController.getCategoryById)
  .put('/category/:categoryId', CategoryController.editCategory)
  .delete('/category/:categoryId', CategoryController.deleteCategory);

export default router;
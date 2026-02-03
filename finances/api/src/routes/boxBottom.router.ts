import { Router } from "express";
import BoxBottomController from "../controllers/BoxBottom.controller";

const router = Router();

router
  .post('/boxBottom/register/:id', BoxBottomController.register)
  .get('/boxBottom/:id', BoxBottomController.getAllBoxBottomsByUser);
  // .get('/category/:id', CategoryController.getCategoryById)
  // .put('/category/:id', CategoryController.editCategory)
  // .delete('/category/:id', CategoryController.deleteCategory);

export default router;
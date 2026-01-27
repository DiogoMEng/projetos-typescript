import { Router } from "express";
import CategoryController from "../controllers/Category.controller";

const router = Router();

router
  .post('/category/register/:id', CategoryController.register)
  .get('/categories/:id', CategoryController.getAllCategoriesByUser)
  // .get('/user/:id', UserController.getUserById)
  // .put('/user/:id', UserController.editUser)
  // .delete('/user/:id', UserController.deleteUser);

export default router;
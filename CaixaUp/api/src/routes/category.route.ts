import { Router } from "express";
import CategoryController from "../controllers/Category.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth);
router
  .post("/", CategoryController.register)
  .get("/", CategoryController.getAllCategoriesByUser)
  .get("/:categoryId", CategoryController.getCategoryById)
  .put("/:categoryId", CategoryController.editCategory)
  .delete("/:categoryId", CategoryController.deleteCategory);

export default router;
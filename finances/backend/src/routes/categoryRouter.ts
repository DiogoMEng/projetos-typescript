import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import Category from "../controllers/category.controller";

const CategoryRouter = Router();
const control =  new Category();

CategoryRouter.get("/show", authMiddleware, control.show.bind(control));
CategoryRouter.post("/create", authMiddleware, control.create.bind(control));
CategoryRouter.delete("/delete/:id", authMiddleware, control.delete.bind(control));
CategoryRouter.put("/update/:id", authMiddleware, control.update.bind(control));

export default CategoryRouter;
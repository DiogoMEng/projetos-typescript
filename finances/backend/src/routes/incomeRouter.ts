import { Router } from "express";
import IncomeController from "../controllers/income.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const incomeRouter = Router();
const control =  new IncomeController();

incomeRouter.get("/show", authMiddleware, control.show.bind(control));
incomeRouter.post("/create", authMiddleware, control.create.bind(control));
incomeRouter.delete("/delete/:id", authMiddleware, control.delete.bind(control));
export default incomeRouter;

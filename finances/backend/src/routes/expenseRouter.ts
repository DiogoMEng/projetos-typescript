import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import Expense from "../controllers/expenses.controller";

const ExpenseRouter = Router();
const control =  new Expense();

ExpenseRouter.get("/show", authMiddleware, control.show.bind(control));
ExpenseRouter.post("/create", authMiddleware, control.create.bind(control));
ExpenseRouter.delete("/delete/:id", authMiddleware, control.delete.bind(control));
ExpenseRouter.put("/update/:id", authMiddleware, control.update.bind(control));

export default ExpenseRouter;

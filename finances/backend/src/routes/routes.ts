import { Router } from "express";
import userRouter from "./userRouter";
import tokenRouter from "./tokenRouter";
import incomeRouter from "./incomeRouter";
import monthlygoalRouter from "./monthlyGoalRouter";
import paymentMethodRouter from "./paymentMethodRouter";
import CategoryRouter from "./categoryRouter";
import ExpenseRouter from "./expenseRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/tokens", tokenRouter);
router.use("/incomes", incomeRouter);
router.use("/monthlygoal", monthlygoalRouter);
router.use("/paymentmethod", paymentMethodRouter);
router.use("/category", CategoryRouter);
router.use("/expense", ExpenseRouter);

export default router;

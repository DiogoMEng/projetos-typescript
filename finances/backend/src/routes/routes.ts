import { Router } from "express";
import userRouter from "./userRouter";
import tokenRouter from "./tokenRouter";
import incomeRouter from "./incomeRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/tokens", tokenRouter);
router.use("/incomes", incomeRouter);

export default router;

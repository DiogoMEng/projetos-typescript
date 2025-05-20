import { Router } from "express";
import userRouter from "./userRouter";
import tokenRouter from "./tokenRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/tokens", tokenRouter);

export default router;

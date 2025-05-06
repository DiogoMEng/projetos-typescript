import { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();
const control =  new UserController();

userRouter.get("/user", control.show.bind(control));
userRouter.post("/user", control.create.bind(control));
userRouter.post("/login", control.login.bind(control));
userRouter.get("/profile", authMiddleware, control.getProfile.bind(control));

export default userRouter;

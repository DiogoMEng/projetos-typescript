import { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/user.controller";

const userRouter = Router();
const control =  new UserController();

userRouter.get("/user", control.get.bind(control));

export default userRouter;

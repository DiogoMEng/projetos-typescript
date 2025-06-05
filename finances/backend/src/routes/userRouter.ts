import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();
const control =  new UserController();

userRouter.get("/user", control.show.bind(control));
userRouter.post("/create", control.create.bind(control));
userRouter.delete("/user/:id", control.delete.bind(control));

export default userRouter;

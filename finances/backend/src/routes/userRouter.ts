import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();
const control =  new UserController();

userRouter.get("/user", authMiddleware,control.show.bind(control));
userRouter.post("/create", control.create.bind(control));
userRouter.delete("/delete/:id", authMiddleware,control.delete.bind(control));
userRouter.put("/update/:id", authMiddleware,control.update.bind(control));

export default userRouter;

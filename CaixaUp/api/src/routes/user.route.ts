import { Router } from "express";
import UserController from "../controllers/User.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router
  .post("/", UserController.register)
  .get("/", checkAuth, UserController.getAllUsers)
  .get("/:id", checkAuth, UserController.getUserById)
  .put("/:id", checkAuth, UserController.editUser)
  .delete("/:id", checkAuth, UserController.deleteUser);

export default router;
import { Router } from "express";
import UserController from "../controllers/User.controller";

const router = Router();

router
  .post('/users/register', UserController.register)
  .get('/users', UserController.getAllUsers)
  .get('/user/:id', UserController.getUserById)
  .put('/user/:id', UserController.editUser)
  .delete('/user/:id', UserController.deleteUser);

export default router;
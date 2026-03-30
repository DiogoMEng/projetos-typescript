import { Router } from "express";
import UserController from "../controllers/User.controller";

const router = Router();

router
  .post('/', UserController.register)
  .get('/', UserController.getAllUsers)
  .get('/:id', UserController.getUserById)
  .put('/:id', UserController.editUser)
  .delete('/:id', UserController.deleteUser);

export default router;
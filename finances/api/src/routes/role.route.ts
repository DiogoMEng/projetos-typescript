import { Router } from "express";
import RoleController from "../controllers/Role.controller";

const router = Router();

router
  .get('/roles/', RoleController.getAllRoles)
  
export default router;
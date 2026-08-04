import { Router } from 'express';
import RoleController from '#controllers/Role.controller.js';

const router = Router();

router
  .get('/', RoleController.getAll);

export default router;
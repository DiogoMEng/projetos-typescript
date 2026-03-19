import { Router } from "express";
import RoleUserBoxBottomController from "../controllers/RoleUserBoxBottom.controller";

const router = Router();

router
  .post('/permission/:userId/:boxBottomId/register/', RoleUserBoxBottomController.register)
  .get('/members/:boxBottomId', RoleUserBoxBottomController.getAllMembers)
  .put('/permission/:userId/:boxBottomId', RoleUserBoxBottomController.editRole)
  .delete('/permission/:roleUserBoxBottomId', RoleUserBoxBottomController.deleteBoxBottom);

export default router;
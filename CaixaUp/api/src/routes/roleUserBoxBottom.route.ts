import { Router } from "express";
import RoleUserBoxBottomController from "../controllers/RoleUserBoxBottom.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth);
router
  .post('/box-bottom/:boxBottomId/register/', RoleUserBoxBottomController.register)
  .get('/box-bottom/:boxBottomId', RoleUserBoxBottomController.getAllMembers)
  .put('/box-bottom/:userId/:boxBottomId', RoleUserBoxBottomController.editRole)
  .delete('/:roleUserBoxBottomId', RoleUserBoxBottomController.deleteBoxBottom);

export default router;
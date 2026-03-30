import { Router } from "express";
import RoleUserBoxBottomController from "../controllers/RoleUserBoxBottom.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth);
router
  .post('/box-bottom/:boxBottomId/register/', checkAuth, RoleUserBoxBottomController.register)
  .get('/box-bottom/:boxBottomId', checkAuth, RoleUserBoxBottomController.getAllMembers)
  .put('/box-bottom/:userId/:boxBottomId', checkAuth, RoleUserBoxBottomController.editRole)
  .delete('/:roleUserBoxBottomId', checkAuth, RoleUserBoxBottomController.deleteBoxBottom);

export default router;
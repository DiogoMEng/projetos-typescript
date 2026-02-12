import { Router } from "express";
import RoleUserBoxBottomController from "../controllers/RoleUserBoxBottom.controller";

const router = Router();

router
  .post('/permission/:userId/:boxBottomId/register/', RoleUserBoxBottomController.register)
  // .get('/boxBottoms/:id', BoxBottomController.getAllBoxBottomsByUser)
  // .get('/boxBottom/:id', BoxBottomController.getBoxBottomById)
  // .put('/boxBottom/:id', BoxBottomController.editBoxBottom)
  // .delete('/boxBottom/:id', BoxBottomController.deleteBoxBottom);

export default router;
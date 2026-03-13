import { Router } from "express";
import BoxBottomController from "../controllers/BoxBottom.controller";

const router = Router();

router
  .post('/boxBottom/register/:userId', BoxBottomController.register)
  .get('/boxBottoms/:userId', BoxBottomController.getAllBoxBottomsByUser)
  .get('/boxBottom/:boxBottomId', BoxBottomController.getBoxBottomById)
  .put('/boxBottom/:boxBottomId', BoxBottomController.editBoxBottom)
  .delete('/boxBottom/:boxBottomId', BoxBottomController.deleteBoxBottom);

export default router;
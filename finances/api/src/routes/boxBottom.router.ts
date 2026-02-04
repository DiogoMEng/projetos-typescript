import { Router } from "express";
import BoxBottomController from "../controllers/BoxBottom.controller";

const router = Router();

router
  .post('/boxBottom/register/:id', BoxBottomController.register)
  .get('/boxBottoms/:id', BoxBottomController.getAllBoxBottomsByUser)
  .get('/boxBottom/:id', BoxBottomController.getBoxBottomById)
  .put('/boxBottom/:id', BoxBottomController.editBoxBottom)
  .delete('/boxBottom/:id', BoxBottomController.deleteBoxBottom);

export default router;
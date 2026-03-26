import { Router } from "express";
import BoxBottomController from "../controllers/BoxBottom.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth);

router
  .post('/boxBottom/register/', BoxBottomController.register)
  .get('/boxBottoms/', BoxBottomController.getAllBoxBottomsByUser)
  .get('/boxBottom/:boxBottomId', BoxBottomController.getBoxBottomById)
  .put('/boxBottom/:boxBottomId', BoxBottomController.editBoxBottom)
  .delete('/boxBottom/:boxBottomId', BoxBottomController.deleteBoxBottom);

export default router;
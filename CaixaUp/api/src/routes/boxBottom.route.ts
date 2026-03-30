import { Router } from "express";
import BoxBottomController from "../controllers/BoxBottom.controller";
import checkAuth from "../middlewares/checkAuth";

const router = Router();

router.use(checkAuth);

router
  .post('/', BoxBottomController.register)
  .get('/', BoxBottomController.getAllBoxBottomsByUser)
  .get('/:boxBottomId', BoxBottomController.getBoxBottomById)
  .put('/:boxBottomId', BoxBottomController.editBoxBottom)
  .delete('/:boxBottomId', BoxBottomController.deleteBoxBottom);

export default router;
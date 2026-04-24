import { Router } from "express";
import BoxBottomController from "../controllers/BoxBottom.controller";
import checkAuth from "../middlewares/checkAuth";
import checkRole from "../middlewares/checkRole";

const router = Router();

router.use(checkAuth);

router
  .post("/", BoxBottomController.register)
  .get("/", BoxBottomController.getAllBoxBottomsByUser)
  .get("/:boxBottomId", checkRole(["OWNER", "MANAGER", "EDITOR", "CONTRIBUTOR", "ANALYST", "VIEWER"]), BoxBottomController.getBoxBottomById)
  .put("/:boxBottomId", checkRole(["OWNER", "MANAGER"]), BoxBottomController.editBoxBottom)
  .delete("/:boxBottomId", checkRole(["OWNER"]), BoxBottomController.deleteBoxBottom);

export default router;
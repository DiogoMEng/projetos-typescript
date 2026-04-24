import { Router } from "express";
import TransactionController from "../controllers/Transaction.controller";
import checkAuth from "../middlewares/checkAuth";
import checkRole from "../middlewares/checkRole";

const router = Router();

router.use(checkAuth);
router
  .post("/box-bottom/:boxBottomId/category/:categoryId", checkRole(["OWNER", "MANAGER", "EDITOR", "CONTRIBUTOR"]), TransactionController.register)
  .get("/box-bottom/:boxBottomId", checkRole(["OWNER", "MANAGER", "EDITOR", "CONTRIBUTOR", "ANALYST", "VIEWER"]), TransactionController.getAllTransactions)
  .get("/:transactionId/box-bottom/:boxBottomId", checkRole(["OWNER", "MANAGER", "EDITOR", "CONTRIBUTOR", "ANALYST", "VIEWER"]), TransactionController.getTransactionById)
  .put("/:transactionId/box-bottom/:boxBottomId", checkRole(["OWNER", "MANAGER", "EDITOR"]), TransactionController.editTransaction)
  .delete("/:transactionId/box-bottom/:boxBottomId", checkRole(["OWNER", "MANAGER", "EDITOR"]), TransactionController.deleteTransaction);

export default router;
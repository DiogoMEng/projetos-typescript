import { Router } from "express";
import TransationController from "../controllers/Transaction.controller";

const router = Router();

router
  .post('/transactions/register/:boxBottomId/:categoryId', TransationController.register)
  // .get('/boxBottoms/:id', TransactionController.getAllBoxBottomsByUser)
  // .get('/boxBottom/:id', TransactionController.getBoxBottomById)
  // .put('/boxBottom/:id', TransactionController.editBoxBottom)
  // .delete('/boxBottom/:id', TransactionController.deleteBoxBottom);

export default router;
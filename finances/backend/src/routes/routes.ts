import express from "express";
import {
  account,
  accountCreditExpenses,
  accountExpenses,
} from "../controllers/accountInformation.controller";
import {
  credit,
  deleteExpenseFromAccount,
  expense,
  receipt,
} from "../controllers/accountMovement.controller";

const router = express.Router();

// VIEWS
router.get("/balances", account);
router.get("/balances/expenses", accountExpenses);
router.get("/balances/credit", accountCreditExpenses);

// ENTRIES
router.post("/balance", receipt);
router.post("/balance/expense", expense);
router.post("/balance/credit", credit);

// EXITS
router.delete("/balance/expense/:idExpense", deleteExpenseFromAccount);

export default router;

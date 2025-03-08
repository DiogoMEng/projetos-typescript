"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {
//   account,
//   accountCreditExpenses,
//   accountExpenses,
// } from "../controllers/accountInformation.controller";
// import {
//   credit,
//   deleteExpenseFromAccount,
//   expense,
//   receipt,
// } from "../controllers/accountMovement.controller";
const router = express_1.default.Router();
// // VIEWS
// router.get("/balances", account);
// router.get("/balances/expenses", accountExpenses);
// router.get("/balances/credit", accountCreditExpenses);
// // ENTRIES
// router.post("/balance", receipt);
// router.post("/balance/expense", expense);
// router.post("/balance/credit", credit);
// // EXITS
// router.delete("/balance/expense/:idExpense", deleteExpenseFromAccount);
exports.default = router;

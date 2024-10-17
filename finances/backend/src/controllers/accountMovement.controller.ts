import { Request, Response } from "express";
import {
  addCredit,
  addExpense,
  addBalance,
  deleteExpense,
} from "../services/account.service";

export async function receipt(req: Request, res: Response): Promise<void> {
  const accountValue: number = req.body.accountValue;
  const receiptStatus: boolean = req.body.receiptStatus === "on" ? true : false;

  await addBalance(accountValue, receiptStatus);

  res.json({
    msg: "Recebimento Realizado",
    addedValues: {
      accountValue: accountValue,
      receiptStatus: receiptStatus,
    },
  });
}

export async function expense(req: Request, res: Response): Promise<void> {
  const expense: string = req.body.expense;
  const expenseAmount: number = req.body.expenseAmount;
  const expenseStatus: boolean = req.body.expenseStatus === "on" ? true : false;

  await addExpense(expense, expenseAmount, expenseStatus);

  res.json({
    msg: "Recebimento Realizado",
    addedValues: {
      expense: expense,
      expenseAmount: expenseAmount,
      expenseStatus: expenseStatus,
    },
  });
}

export async function credit(req: Request, res: Response): Promise<void> {
  const creditExpense: string = req.body.creditExpense;
  const creditExpenseAmount: number = req.body.creditExpenseAmount;
  const description: string = req.body.description;

  await addCredit(
    creditExpense,
    creditExpenseAmount,
    description
  );

  res.json({
    msg: "Recebimento Realizado",
    addedValues: {
      creditExpense: creditExpense,
      creditExpenseAmount: creditExpenseAmount,
      description: description,
    },
  });
}

export async function deleteExpenseFromAccount(req: Request, res: Response): Promise<void> {
  const idExpense: number = parseInt(req.params.idExpense);
  const isCredit: boolean = req.body.isCredit;

  await deleteExpense(idExpense, isCredit);

  res.json({
    msg: "Despesa Removida"
  })
}
"use strict";
// import { RowDataPacket } from "mysql2";
// import pool from "../db/connection";
// import { formattedDate } from "../utils/formattedDate";
// // ACCOUNT VIEWS
// export async function balanceDetails(): Promise<RowDataPacket[]> {
//   const conn = await pool.getConnection();
//   const details_data: RowDataPacket[] = await conn.query<RowDataPacket[]>(
//     "SELECT c.idconta, c.dt_recebimento, c.valor_conta, c.status_recebimento FROM conta c"
//   ).then(([data]) => data);
//   conn.release();
//   return details_data;
// }
// export async function expensesDetails(): Promise<RowDataPacket[]> {
//   const conn = await pool.getConnection();
//   const details_data: RowDataPacket[] = await conn.query<RowDataPacket[]>(
//     "SELECT d.id_despesa, d.dt_despesa, d.despesa, d.valor_despesa, d.status_despesa FROM despesas d"
//   ).then(([data]) => data);
//   conn.release();
//   return details_data;
// }
// export async function creditExpensesDetails(): Promise<RowDataPacket[]> {
//   const conn = await pool.getConnection();
//   const details_data: RowDataPacket[] = await conn.query<RowDataPacket[]>(
//     "SELECT dc.id_credito, dc.dt_despesa_credito, dc.despesa_credito, dc.valor_credito, dc.descricao FROM despesas_credito dc"
//   ).then(([data]) => data);
//   conn.release();
//   return details_data;
// }
// // ACCOUNT MOVEMENTS - ENTRIES
// export async function addBalance(
//   accountValue: number,
//   receiptStatus: boolean
// ): Promise<void> {
//   const conn = await pool.getConnection();
//   const data: RowDataPacket[] = await conn.query<RowDataPacket[]>(
//     `INSERT INTO conta(dt_recebimento, valor_conta, status_recebimento) VALUES ("${formattedDate()}", ${accountValue}, ${receiptStatus})`
//   ).then(([data]) => data);
//   conn.release();
// }
// export async function addExpense(
//   expense: string,
//   expenseAmount: number,
//   expenseStatus: boolean
// ): Promise<void> {
//   const conn = await pool.getConnection();
//   const accountId = `(SELECT DISTINCT c.idconta FROM conta c WHERE YEAR(c.dt_recebimento) = YEAR(${formattedDate()}) AND MONTH(c.dt_recebimento) = MONTH("${formattedDate()}"))`;
//   const data: RowDataPacket[] = await conn.query<RowDataPacket[]>(
//     `INSERT INTO despesas(dt_despesa, despesa, valor_despesa, status_despesa, idconta) VALUES ("${formattedDate()}", "${expense}", ${expenseAmount}, ${expenseStatus}, ${accountId})`
//   ).then(([data]) => data);
//   conn.release();
// }
// export async function addCredit(
//   creditExpense: string,
//   creditExpenseAmount: number,
//   description: string
// ): Promise<void> {
//   const conn = await pool.getConnection();
//   const accountId = `(SELECT DISTINCT c.idconta FROM conta c WHERE YEAR(c.dt_recebimento) = YEAR(${formattedDate()}) AND MONTH(c.dt_recebimento) = MONTH("${formattedDate()}"))`;
//   const data: RowDataPacket[] = await conn.query<RowDataPacket[]>(
//     `INSERT INTO despesas_credito(dt_despesa_credito, despesa_credito, valor_credito, descricao, idconta) VALUES ("${formattedDate()}", "${creditExpense}", ${creditExpenseAmount}, "${description}", ${accountId})`
//   ).then(([data]) => data);
//   conn.release();
// }
// // ACCOUNT MOVEMENTS - EXITS
// export async function deleteExpense(idExpense: number, isCredit: boolean): Promise<void> {
//   const conn = await pool.getConnection();
//   const query = (isCredit != true) ? "DELETE FROM despesas WHERE id_despesa" : "DELETE FROM despesas_credito WHERE id_credito"
//   const data: RowDataPacket[] = await conn.query<RowDataPacket[]>(`${query} = ${idExpense}`).then(([data]) => data);
//   conn.release();
// }

import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import Expense from "../database/models/Expense";
import ExpenseSchema from "../schemas/expense.schema";

/**
 * CONTROLLER RESPONSIBLE FOR HANDLING EXPENSE OPERATIONS:
 * - CREATE, LIST, UPDATE AND DELETE EXPENSE RECORDS FOR AUTHENTICATED USERS.
 */
class ExpenseController {
  private model: ModelStatic<Expense> = Expense;

  /**
  * CREATE A NEW EXPENSE ENTRY FOR THE AUTHENTICATED USER:
  * - Filters out system-generated fields before validation.
  * - Validates only user-provided fields.
  * - Creates the expense record in the database with all necessary fields.
  */
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    const { categoryId, paymentMethodId, ...userProvidedFields } = req.body;

    const { error } = ExpenseSchema.createExpense().validate(userProvidedFields, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { userId } = req.user as AuthenticatedUser;
      const {
        description,
        value,
        date,
        observation,
        situation,
        categoryId,
        paymentMethodId
      } = req.body;

      await this.model.create({ description, value, date, observation, situation, userId, categoryId, paymentMethodId });

      return res.status(200).json({ message: "Uma nova despesa foi adicionada a conta com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
  * LIST ALL EXPENSE ENTRIES FOR THE AUTHENTICATED USER:
  * - Fetches all expense records associated with the user's userId.
  */
  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;
      const expenses = await this.model.findAll({ where: { userId } });
      return res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
  * DELETE AN EXPENSE ENTRY BY ITS ID:
  * - Validates the route parameter (id).
  * - Checks if the expense record exists.
  * - Deletes the record if found.
  */
  async delete(req: Request, res: Response, next: NextFunction) {

    const { error } = ExpenseSchema.idParam().validate(req.params, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const expense = await this.model.findByPk(id);

      if (!expense) {
        return res.status(404).json({ message: "Não há registros para esta despesa" });
      }

      await expense.destroy();

      return res.status(200).json({ message: "Despesa deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
  

  /**
  * UPDATE AN EXISTING EXPENSE ENTRY BY ITS ID:
  * - Validates the id parameter and the request body.
  * - Checks if the expense record exists.
  * - Updates the record with new values if found.
  */
  async update(req: Request, res: Response, next: NextFunction) {

    const paramValidation = ExpenseSchema.idParam().validate(req.params, { abortEarly: false });

    if (paramValidation.error) {
      return res.status(400).json({
        message: paramValidation.error.details.map((d: any) => d.message).join("; ")
      });
    }

    const { error } = ExpenseSchema.updateExpense().validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const {
        description,
        value,
        date,
        observation,
        situation,
        categoryId,
        paymentMethodId
      } = req.body;

      const expense = await this.model.findByPk(id);

      if (!expense) {
        return res.status(404).json({ message: "Despesa não encontrada" });
      }

      await expense.update({ description, value, date, observation, situation, categoryId, paymentMethodId });

      return res.status(200).json({
        message: "Despesa atualizada com sucesso",
        updatedExpense: {
          description,
          value,
          date,
          observation,
          situation,
          categoryId,
          paymentMethodId
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
}

export default ExpenseController;
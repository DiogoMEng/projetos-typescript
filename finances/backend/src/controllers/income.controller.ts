import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import Income from "../database/models/Income";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import IncomeSchema from "../schemas/income.schema";


/**
 *  CONTROLLER RESPONSIBLE FOR HANDLING INCOME (ENTRY) OPERATIONS:
 *  - CREATE, LIST, UPDATE AND DELETE INCOME RECORDS FOR AUTHENTICATED USERS. 
 */
class IncomeController {
  private model: ModelStatic<Income> = Income;

  /**
   * CREATE A NEW INCOME ENTRE FOR THE AUTHENTICATED USER:
   * - Adds userId to the request body.
   * - Validates the complete payload (including userId).
   * - If validation passes, creates the income record in the database.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    const { userId } = req.user as AuthenticatedUser;
    const bodyWithUser = { ...req.body, userId };
    const { error } = IncomeSchema.createIncome().validate(bodyWithUser, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { description, value, dateReceipt, type } = req.body;
      await this.model.create({ description, value, dateReceipt, type, userId });
      return res.status(200).json({ message: "Novo valor de entrada adicionado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
   *  LIST ALL INCOME ENTRIES FOR THE AUTHENTICATED USER:
   *  - Fetches all income records associated with the user's userId.
   */
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user as AuthenticatedUser;
      const entry = await this.model.findAll({ where: { userId } });
      return res.status(200).json(entry);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }


  /**
   *  DELETE AN INCOME ENTRY BY ITS ID:
   *  - Validates the route parameter (id).
   *  - Checks if the income record exists.
   *  - Deletes the record if found.
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    const { error } = IncomeSchema.deleteIncome().validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const income = await this.model.findByPk(id);

      if (!income) {
        return res.status(404).json({ message: "Receita não encontrada" });
      }

      await income.destroy();
      return res.status(200).json({ message: "Receita deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  

  /**
   *  UPDATE AN EXISTING INCOME ENTRY BY ITS ID:
   *  - Validates the id parameter and the request body.
   *  - Checks if the income record exists.
   *  - Updates the record with new values if found.
   */
  async update(req: Request, res: Response, next: NextFunction) {

    const paramValidation = IncomeSchema.deleteIncome().validate(req.params, { abortEarly: false });
    if (paramValidation.error) {
      return res.status(400).json({
        message: paramValidation.error.details.map((d: any) => d.message).join("; ")
      });
    }

    const { error } = IncomeSchema.updateIncome().validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const { description, value, dateReceipt, type } = req.body;
      const income = await this.model.findByPk(id);

      if (!income) {
        return res.status(404).json({ message: "Receita não encontrada" });
      }

      await income.update({ description, value, dateReceipt, type });
      return res.status(200).json({
        message: "Receita atualizada com sucesso",
        updatedIncome: { description, value, dateReceipt, type }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
    
  }
}

export default IncomeController;
import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import MonthlyGoal from "../database/models/MonthlyGoal";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import MonthlyGoalSchema from "../schemas/monthlyGoal.schema";

/**
 *  CONTROLLER RESPONSIBLE FOR HANDLING INCOME (ENTRY) OPERATIONS:
 *  - CREATE, LIST, UPDATE AND DELETE INCOME RECORDS FOR AUTHENTICATED USERS.
 */
class MonthlyGoalController {
  private model: ModelStatic<MonthlyGoal> = MonthlyGoal;

  /**
   *  CREATE A NEW INCOME ENTRY FOR THE AUTHENTICATED USER:
   *  - adds userId to the request body.
   *  - validates the complete payload (including userId).
   *  - if validation passes, creates the income record in the database. 
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
    const { userId } = req.user as AuthenticatedUser;
    const bodyWithUser = req.body;

    const { error } = MonthlyGoalSchema.createMonthlyGoal().validate(bodyWithUser, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { month, year, limitValue } = req.body;
      await this.model.create({ month, year, limitValue, userId });
      return res.status(200).json({ message: "Nova meta estabelecida" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
   *  LIST ALL INCOME ENTRIES FOR THE AUTHENTICATED USER:
   *  - Fetches all income records associated with the user's userId.
   *  - returns an array of income entries belonging to the current user 
   */
  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;
      const goals = await this.model.findAll({ where: { userId } });
      return res.status(200).json(goals);
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
    const { error } = MonthlyGoalSchema.idParam().validate(req.params, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const goal = await this.model.findByPk(id);

      if (!goal) {
        return res.status(404).json({ message: "Esta meta não existe." });
      }

      await goal.destroy();
      return res.status(200).json({ message: "Meta deletada com sucesso" });
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
    
    const paramValidation = MonthlyGoalSchema.idParam().validate(req.params, { abortEarly: false });

    if (paramValidation.error) {
      return res.status(400).json({
        message: paramValidation.error.details.map((d: any) => d.message).join("; ")
      });
    }

    const { error } = MonthlyGoalSchema.updateMonthlyGoal().validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const { month, year, limitValue } = req.body;
      const goal = await this.model.findByPk(id);

      if (!goal) {
        return res.status(404).json({ message: "Registro inexistente ou inválido" });
      }

      await goal.update({ month, year, limitValue });
      return res.status(200).json({ message: "Meta Atualizada", newGoal: { month, year, limitValue } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
}

export default MonthlyGoalController;
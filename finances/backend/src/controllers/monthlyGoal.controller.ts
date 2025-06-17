import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import MonthlyGoal from "../database/models/MonthlyGoal";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import MonthlyGoalSchema from "../schemas/monthlyGoal.schema";

class MonthlyGoalController {
  private model: ModelStatic<MonthlyGoal> = MonthlyGoal;

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { id: userId } = req.user as AuthenticatedUser;
    const bodyWithUser = { ...req.body, userId };

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

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user as AuthenticatedUser;
      const goals = await this.model.findAll({ where: { userId } });
      return res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

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
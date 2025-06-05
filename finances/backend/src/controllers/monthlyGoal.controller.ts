import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import MonthlyGoal from "../database/models/MonthlyGoal";

class MonthlyGoalController {
  private model: ModelStatic<MonthlyGoal> = MonthlyGoal;

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
    try {
      const { userId } = req.user as AuthenticatedUser;
      const {
        month,
        year,
        limitValue
      } = req.body

      await this.model.create({ month, year, limitValue, userId });

      return res.status(200).json({ message: "Nova meta estabelecida" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;

      const goals = await this.model.findAll({ where: { userId } });

      return res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
  

  async delete(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;

      const goal = await this.model.findByPk(id);

      if (!goal) {
        return res.status(404).json({ message: "Esta meta não existe. " });
      }

      await goal.destroy();

      return res.status(200).json({ message: "Meta deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

  async update(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const {
        month,
        year,
        limitValue
      } = req.body

      const goal = await this.model.findByPk(id);

      if (!goal) {
        return res.status(404).json({ message: "Registro inexistente ou inválido" });
      }

      console.log("goal", goal);

      await goal.update({ month, year, limitValue });

      console.log("goal updated", goal);

      return res.status(200).json({message: "Meta Atualizado", newGoal: { month, year, limitValue } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

}

export default MonthlyGoalController;
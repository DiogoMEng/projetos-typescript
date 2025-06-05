import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import Expense from "../database/models/Expense";

class ExpenseController {
  private model: ModelStatic<Expense> = Expense;

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
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
      } = req.body

      console.log("Expense:", req.body, "\nuserId:", userId, "\n");

      await this.model.create({ description, value, date, observation, situation, userId, categoryId, paymentMethodId });

      return res.status(200).json({ message: "Uma nova despesa foi adicionada a conta com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;

      const expenses = await this.model.findAll({ where: { userId } });

      return res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
  

  async delete(req: Request, res: Response, next: NextFunction) {

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

  async update(req: Request, res: Response, next: NextFunction) {

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
      } = req.body

      const expense = await this.model.findByPk(id);

      if (!expense) {
        return res.status(404).json({ message: "Categoria de despesa deletado com sucesso" });
      }

      await expense.update({ description, value, date, observation, situation, categoryId, paymentMethodId });

      return res.status(200).json({
        message: "Categoria Atualizada", 
        newCategory: { 
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
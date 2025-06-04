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
        name,
        description
      } = req.body

      console.log("Category:", req.body);

      await this.model.create({ name, description, userId });

      return res.status(200).json({ message: "Nova Categoria de despesa adicionada" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;

      const categories = await this.model.findAll({ where: { userId } });

      return res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
  

  async delete(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;

      const category = await this.model.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Esta categoria não existe" });
      }

      await category.destroy();

      return res.status(200).json({ message: "Categoria de despesa deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

  async update(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const {
        name,
        description
      } = req.body

      const category = await this.model.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Categoria de despesa deletado com sucesso" });
      }

      await category.update({ name, description });

      return res.status(200).json({message: "Categoria Atualizada", newCategory: { name, description } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

}

export default ExpenseController;
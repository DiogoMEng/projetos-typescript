import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import Income from "../database/models/Income";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import IncomeSchema from "../schemas/income.schema";

class IncomeController {
  private model: ModelStatic<Income> = Income;

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { id: userId } = req.user as AuthenticatedUser;
    const bodyWithUser = { ...req.body, userId };

    const { error } = IncomeSchema.createIncome().validate(bodyWithUser, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { description, amount, date, category } = req.body;
      await this.model.create({ description, amount, date, category, userId });
      return res.status(200).json({ message: "Nova receita adicionada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    // Se for para mostrar um único registro, valide o parâmetro id
    if (req.params.id) {
      const { error } = IncomeSchema.showIncome().validate(req.params, { abortEarly: false });
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
        return res.status(200).json(income);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      // Listar todas as receitas do usuário
      try {
        const { id: userId } = req.user as AuthenticatedUser;
        const incomes = await this.model.findAll({ where: { userId } });
        return res.status(200).json(incomes);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

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
      const { description, amount, date, category } = req.body;
      const income = await this.model.findByPk(id);

      if (!income) {
        return res.status(404).json({ message: "Receita não encontrada" });
      }

      await income.update({ description, amount, date, category });
      return res.status(200).json({
        message: "Receita atualizada com sucesso",
        updatedIncome: { description, amount, date, category }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default IncomeController;
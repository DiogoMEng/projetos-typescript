import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import Income from "../database/models/Income";
import { AuthenticatedUser } from "../interfaces/user.protocol";

class IncomeController {
  private model: ModelStatic<Income> = Income;

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
    try {
      const { userId } = req.user as AuthenticatedUser;

      const newEntry = await this.model.create(req.body);

      return res.status(200).json({ message: "Novo valor de entrada registrado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;

      const entrys = await this.model.findAll({ where: { userId } });

      return res.status(200).json(entrys);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
  

  async delete(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;
      const { id } = req.params;

      const user = await this.model.findAll({ where: { userId } });

      if (!user) {
        return res.status(404).json({ message: "Usuário não registrado. Realize o seu cadastro" });
      }

      const entry = await this.model.findByPk(id);

      if (!entry) {
        return res.status(404).json({ message: "Ocorreu um erro ao tentar deletar o registro" });
      }

      await entry.destroy();

      return res.status(200).json({ message: "Registro de entrada deletado" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

  async update(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;
      const { id } = req.params;

      const user = await this.model.findAll({ where: { userId } });

      if (!user) {
        return res.status(404).json({ message: "Usuário não registrado. Realize o seu cadastro" });
      }

      const entry = await this.model.findByPk(id);

      if (!entry) {
        return res.status(404).json({ message: "Registro inexistente ou inválido" });
      }

      const newEntry = await entry.update(req.body);

      const { description, value, dateReceipt, type } = newEntry.get({ plain: true });

      return res.status(200).json({ description, value, dateReceipt, type });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

}

export default IncomeController;
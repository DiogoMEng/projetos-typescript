import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import Income from "../database/models/Income";
import { AuthenticatedUser } from "../interfaces/user.protocol";

class IncomeController {
  private model: ModelStatic<Income> = Income;

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
    try {
      const { 
        description, 
        value, 
        dateReceipt,
        type
      } = req.body;

      const { userId } = req.user as AuthenticatedUser;

      const newEntry = await this.model.create({ description, value, dateReceipt, type, userId });

      const { ...entry } = newEntry.get({ plain: true });

      return res.status(200).json({ message: "Entry created successfully" });
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
      const { id } = req.params;

      const entry = await this.model.findByPk(id);

      if (!entry) {
        return res.status(404).json({ message: "Registro inválido" });
      }

      await entry.destroy();

      return res.status(200).json({ message: "Registro de entrada deletado" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

}

export default IncomeController;
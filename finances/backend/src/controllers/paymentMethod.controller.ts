import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import PaymentMethod from "../database/models/PaymentMethod";
import { AuthenticatedUser } from "../interfaces/user.protocol";

class PaymentMethodController {
  private model: ModelStatic<PaymentMethod> = PaymentMethod;

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
    try {
      const { userId } = req.user as AuthenticatedUser;
      const {
        type,
        description
      } = req.body

      await this.model.create({ type, description, userId });

      return res.status(200).json({ message: "Novo método de pagamento adicionado" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;

      const methods = await this.model.findAll({ where: { userId } });

      return res.status(200).json(methods);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
  

  async delete(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;

      const method = await this.model.findByPk(id);

      console.log(method);

      if (!method) {
        return res.status(404).json({ message: "Este método de pagamento ainda não existe" });
      }

      await method.destroy();

      return res.status(200).json({ message: "Método de pagamento deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

  async update(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const {
        type,
        description
      } = req.body

      const method = await this.model.findByPk(id);

      if (!method) {
        return res.status(404).json({ message: "Este método de pagamento ainda não existe" });
      }

      await method.update({message: "Método de Pagamento Atualizado", newMethod: { type, description } });

      return res.status(200).json({  });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

}

export default PaymentMethodController;
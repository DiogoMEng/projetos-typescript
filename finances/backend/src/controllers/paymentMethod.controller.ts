import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import PaymentMethod from "../database/models/PaymentMethod";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import PaymentMethodSchema from "../schemas/paymentMethod.schema";

/**
 *  CONTROLLER RESPONSIBLE FOR HANDLING PAYMENT METHOD OPERATIONS:
 *  - CREATE, LIST, UPDATE AND DELETE PAYMENT METHOD RECORDS FOR AUTHENTICATED USERS.
 */
class PaymentMethodController {
  private model: ModelStatic<PaymentMethod> = PaymentMethod;

  /**
   * CREATE A NEW PAYMENT METHOD FOR THE AUTHENTICATED USER:
   * - Extracts userId from authenticated user.
   * - Validates the request body against schema rules.
   * - If validation passes, creates the payment method record in the database.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    const { id: userId } = req.user as AuthenticatedUser;
    const bodyWithUser = req.body;

    const { error } = PaymentMethodSchema.createPaymentMethod().validate(bodyWithUser, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { type, description } = req.body;
      await this.model.create({ type, description, userId });
      return res.status(200).json({ message: "Novo método de pagamento adicionado" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
  * LIST ALL PAYMENT METHODS FOR THE AUTHENTICATED USER:
  * - Fetches all payment method records associated with the user's userId.
  * - Returns an array of payment methods belonging to the current user.
  */
  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { id: userId } = req.user as AuthenticatedUser;
      const methods = await this.model.findAll({ where: { userId } });
      return res.status(200).json(methods);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
  * DELETE A PAYMENT METHOD BY ITS ID:
  * - Validates the route parameter (id).
  * - Checks if the payment method record exists.
  * - Deletes the record if found.
  */
  async delete(req: Request, res: Response, next: NextFunction) {

    const { error } = PaymentMethodSchema.idParam().validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const method = await this.model.findByPk(id);

      if (!method) {
        return res.status(404).json({ message: "Este método de pagamento não existe." });
      }

      await method.destroy();
      return res.status(200).json({ message: "Método de pagamento deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
  * UPDATE AN EXISTING PAYMENT METHOD BY ITS ID:
  * - Validates the id parameter and the request body.
  * - Checks if the payment method record exists.
  * - Updates the record with new values if found.
  */
  async update(req: Request, res: Response, next: NextFunction) {

    const paramValidation = PaymentMethodSchema.idParam().validate(req.params, { abortEarly: false });
    if (paramValidation.error) {
      return res.status(400).json({
        message: paramValidation.error.details.map((d: any) => d.message).join("; ")
      });
    }

    const { error } = PaymentMethodSchema.updatePaymentMethod().validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const { type, description } = req.body;
      const method = await this.model.findByPk(id);

      if (!method) {
        return res.status(404).json({ message: "Este método de pagamento não existe." });
      }

      await method.update({ type, description });
      return res.status(200).json({ message: "Método de Pagamento Atualizado", updatedMethod: { type, description } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
}

export default PaymentMethodController;
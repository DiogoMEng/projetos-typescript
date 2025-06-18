import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import Category from "../database/models/Category";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import CategorySchema from "../schemas/category.schema";


/**
 *  CONTROLLER RESPONSIBLE FOR HANDLING INCOME (ENTRY) OPERATIONS:
 *  - CREATE, LIST, UPDATE AND DELETE INCOME RECORDS FOR AUTHENTICATED USERS. 
 */
class CategoryController {
  private model: ModelStatic<Category> = Category;

  /**
  * CREATE A NEW INCOME ENTRY FOR THE AUTHENTICATED USER:
  * - Adds userId to the request body.
  * - Validates the complete payload (including userId).
  * - If validation passes, creates the income record in the database.
  */
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    const { userId } = req.user as AuthenticatedUser;
    const bodyWithUser = req.body;
    const { error } = CategorySchema.createCategory().validate(bodyWithUser, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { name, description } = req.body;
      await this.model.create({ name, description, userId });
      return res.status(200).json({ message: "Nova Categoria de despesa adicionada" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }


  /**
  *  LIST ALL INCOME ENTRIES FOR THE AUTHENTICATED USER:
  *  - Fetches all income records associated with the user's userId.
  */
  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const { userId } = req.user as AuthenticatedUser;
      const categories = await this.model.findAll({ where: { userId } });
      return res.status(200).json(categories);
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

    const { error } = CategorySchema.deleteCategory().validate(req.params, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const category = await this.model.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Esta categoria não existe" });
      }

      await category.destroy();
      return res.status(200).json({ message: "Categoria de despesa deletada com sucesso" });
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

    const paramValidation = CategorySchema.deleteCategory().validate(req.params, { abortEarly: false });

    if (paramValidation.error) {
      return res.status(400).json({
        message: paramValidation.error.details.map((d: any) => d.message).join("; ")
      });
    }

    const { error } = CategorySchema.updateCategory().validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: error.details.map((d: any) => d.message).join("; ")
      });
    }

    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const category = await this.model.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: "Esta categoria não existe" });
      }

      await category.update({ name, description });
      return res.status(200).json({ message: "Categoria Atualizada", newCategory: { name, description } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }
}

export default CategoryController;
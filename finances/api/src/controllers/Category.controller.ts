import CategoryService from '../services/Category.service';
import { Request, Response } from 'express';

const categoryService = new CategoryService();

class CategoryController {
  static async register(req: Request, res: Response) {
    const { id } = req.params;
    const { name, type } = req.body;
    try {
      const category = await categoryService.register({
        name, type, userId: id
      });
      res.status(201).json({ message: `Category ${category.name} created successfully.` });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getAllCategoriesByUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const categories = await categoryService.getAllCategoriesByUser(id);
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default CategoryController;
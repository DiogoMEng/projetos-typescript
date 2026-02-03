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

  static async getCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const category = await categoryService.getCategoryById(id);
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      }
    }
  }

  static async editCategory(req: Request, res: Response) {
    const { id } = req.params;
    const dto = req.body;
    try {
      const updatedRecord = await categoryService.editCategory(id, dto);
      if (!updatedRecord) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await categoryService.deleteCategory(id);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) { 
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default CategoryController;
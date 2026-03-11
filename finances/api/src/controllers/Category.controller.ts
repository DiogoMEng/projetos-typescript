import CategoryService from '../services/Category.service';
import { Request, Response } from 'express';

const categoryService = new CategoryService();

class CategoryController {
  static async register(req: Request, res: Response) {
    const { userId } = req.params;
    const { name, type } = req.body;
    try {
      const category = await categoryService.create({
        name, type, userId
      });
      res.status(201).json({ message: `Category ${category.name} created successfully.` });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getAllCategoriesByUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const categories = await categoryService.getAllCategoriesByUser(userId);
      res.status(200).json(categories);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    const { categoryId } = req.params;
    try {
      const category = await categoryService.getById(categoryId);
      res.status(200).json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      }
    }
  }

  static async editCategory(req: Request, res: Response) {
    const { categoryId } = req.params;
    const dto = req.body;
    try {
      const updatedRecord = await categoryService.update(categoryId, dto);
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
    const { categoryId } = req.params;
    try {
      await categoryService.delete(categoryId);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) { 
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default CategoryController;
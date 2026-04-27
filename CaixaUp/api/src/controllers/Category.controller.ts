import CategoryService from '../services/Category.service';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

const categoryService = new CategoryService();

class CategoryController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { name, type } = req.body;
    const category = await categoryService.create({ name, type, userId });
    res.status(201).json({ message: `Category ${category.name} created successfull.` });
  });

  static getAllCategoriesByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const categories = await categoryService.getAllCategoriesByUser(userId);
    res.status(200).json(categories);
  });

  static getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const category = await categoryService.getById(categoryId);
    res.status(200).json(category);
  });

  static editCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const dto = req.body;
    const updatedRecord = await categoryService.update(categoryId, dto);
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    await categoryService.delete(categoryId);
    res.status(200).json({ message: 'Category deleted successfully' });
  });
}

export default CategoryController;
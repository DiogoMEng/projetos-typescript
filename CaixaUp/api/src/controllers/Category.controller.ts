import { Request, Response } from 'express';
import { Controller } from './Controller';
import CategoryService from '../services/Category.service';
import { catchAsync } from '../utils/catchAsync';

class CategoryController extends Controller {
  constructor() {
    super(new CategoryService());
  }

  protected override getEntityName(): string {
    return 'Category';
  }

  protected override getParamIdName(): string {
    return 'categoryId';
  }

  protected override getCreateParams(req: Request) {
    return {
      ...req.body,
      userId: req.userId as string,
    };
  }

  getAllCategoriesByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const categories = await (this.service as CategoryService).getAllCategoriesByUser(userId);
    res.status(200).json(categories);
  });
}

export default new CategoryController();
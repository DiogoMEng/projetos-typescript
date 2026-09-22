import { Request, Response } from 'express';
import { Controller } from './Controller';
import CategoryService from '#services/Category.service.js';
import { catchAsync } from '#utils/catchAsync.js';
import { NotFoundError } from '#errors/httpErrors.js';

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
    const categories = await (
      this.service as CategoryService
    ).getAllCategoriesByUser(userId);
    res.status(200).json(categories);
  });

  override getById = catchAsync(async (req: Request, res: Response) => {
    const category = await (this.service as CategoryService).getByIdForUser(
      req.params.categoryId,
      req.userId as string,
    );
    res.status(200).json(category);
  });

  override edit = catchAsync(async (req: Request, res: Response) => {
    const updated = await (this.service as CategoryService).updateForUser(
      req.params.categoryId,
      req.userId as string,
      req.body,
    );
    if (!updated) throw new NotFoundError('Category não encontrado');
    res.status(200).json({ message: 'Category updated successfully' });
  });

  override delete = catchAsync(async (req: Request, res: Response) => {
    const deleted = await (this.service as CategoryService).deleteForUser(
      req.params.categoryId,
      req.userId as string,
    );
    if (!deleted) throw new NotFoundError('Category não encontrado');
    res.status(200).json({ message: 'Category deleted successfully' });
  });
}

export default new CategoryController();

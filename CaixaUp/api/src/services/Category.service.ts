import { DB } from '#models/index.js';
import { Category } from '#interfaces/category.interface.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '#errors/httpErrors.js';
import { Service } from './Service';

class CategoryService extends Service<any, Category> {
  constructor() {
    super(DB.Categories, 'categoryId');
  }

  protected async beforeCreate(dto: Category): Promise<void> {
    const validTypes = ['receita', 'despesa'];

    if (!validTypes.includes(dto.type)) {
      throw new BadRequestError('Tipo de categoria inválido.');
    }

    const categoryExists = await DB.Categories.findOne({
      where: { name: dto.name, userId: dto.userId },
    });
    if (categoryExists)
      throw new ConflictError('Categoria já existe para este usuário.');
  }

  async getAllCategoriesByUser(userId: string): Promise<Category[]> {
    return await super.getAll({
      where: { userId },
      include: [
        { model: DB.Users, as: 'categoryOwner', attributes: ['name', 'email'] },
      ],
    });
  }

  async getByIdForUser(categoryId: string, userId: string): Promise<Category> {
    const category = await this.model.findOne({
      where: { categoryId, userId },
    });
    if (!category) throw new NotFoundError('Category não encontrado');
    return category;
  }

  async updateForUser(
    categoryId: string,
    userId: string,
    dto: Partial<Category>,
  ): Promise<boolean> {
    const [affectedCount] = await this.model.update(dto, {
      where: { categoryId, userId },
    });
    return affectedCount > 0;
  }

  async deleteForUser(categoryId: string, userId: string): Promise<boolean> {
    const deletedCount = await this.model.destroy({
      where: { categoryId, userId },
    });
    return deletedCount > 0;
  }
}

export default CategoryService;

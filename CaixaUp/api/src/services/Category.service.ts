import { DB } from '../database/models';
import { Category } from '../interfaces/category.interface';
import { Service } from './Service';

class CategoryService extends Service<any, Category> {
  constructor() {
    super(DB.Categories, 'categoryId');
  }

  protected async beforeCreate(dto: Category): Promise<void> {
    const categoryExists = await DB.Categories.findOne({
      where: { name: dto.name, userId: dto.userId }
    });
    if (categoryExists) throw new Error('Categoria já existe para este usuário.');
  }

  async getAllCategoriesByUser(userId: string): Promise<Category[]> {
    return await super.getAll({
      where: { userId },
      include: [{ model: DB.Users, as: 'categoryOwner', attributes: ['name', 'email'] }]
    });
  }
}

export default CategoryService;

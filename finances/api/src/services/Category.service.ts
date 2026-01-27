import { DB } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../interfaces/category.interface';

class CategoryService {
  async register(dto: Category): Promise<Category> {
    const category = await DB.Categories.findOne({
      where: {
        name: dto.name,
        userId: dto.userId,
      },
    });
    console.log("category:", category);
    if (category) {
      throw new Error('Category already exists');
    }
    try {
      const newCategory = await DB.Categories.create({
        categoryId: uuidv4(),
        userId: dto.userId,
        name: dto.name,
        type: dto.type,
      });
      return newCategory;
    } catch (error) {
      throw new Error('Error registering category.');
    }
  }

  async getAllCategoriesByUser(id: string): Promise<Category[]> {
    const categories = await DB.Categories.findAll({
      where: {
        userId: id
      },
      include: [
        {
          model: DB.Users,
          as: 'categoryOwner',
          attributes: ['name', 'email']
        }
      ]
    });
    return categories;
  }
}

export default CategoryService;

import { DB } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import { BoxBottom } from '../interfaces/boxBottom.interface';

class BoxBottomService {
  async register(dto: BoxBottom): Promise<BoxBottom> {
    const boxBottom = await DB.BoxBottoms.findOne({
      where: {
        name: dto.name,
        userId: dto.userId,
      },
    });
    if (boxBottom) {
      throw new Error('BoxBottom already exists');
    }
    try {
      const newBoxBottom = await DB.BoxBottoms.create({
        boxBottomId: uuidv4(),
        userId: dto.userId,
        name: dto.name,
        description: dto.description,
        targetValue: dto.targetValue,
      });
      return newBoxBottom;
    } catch (error) {
      throw new Error('Error registering box bottom.');
    }
  }

  async getAllBoxBottomsByUser(id: string): Promise<BoxBottom[]> {
    const boxBottoms = await DB.BoxBottoms.findAll({
      where: {
        userId: id
      },
      attributes: {
        exclude: ['userId']
      }
    });
    return boxBottoms;
  }

  // async getCategoryById(id: string): Promise<Category | null> {
  //   const category = await DB.Categories.findByPk(id);
  //   if(!category) {
  //     throw new Error('Category not found');
  //   }
  //   return category;
  // }

  // async editCategory(id: string, dto: Partial<Category>): Promise<boolean | void> {
  //   const listUpdateData = await DB.Categories.update(dto, {
  //     where: { categoryId: id },
  //   });
  //   if (listUpdateData[0] === 0) {
  //     return false;
  //   }
  //   return true;
  // }

  // async deleteCategory(id: string): Promise<void> {
  //   await DB.Categories.destroy({
  //     where: { categoryId: id },
  //   });
  // }
}

export default BoxBottomService;

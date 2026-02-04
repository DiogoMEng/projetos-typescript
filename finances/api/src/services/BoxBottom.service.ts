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

  async getBoxBottomById(id: string): Promise<BoxBottom | null> {
    const boxBottom = await DB.BoxBottoms.findByPk(id, {
      attributes: {
        exclude: ['userId']
      }
    });
    if(!boxBottom) {
      throw new Error('BoxBottom not found');
    }
    return boxBottom;
  }

  async editBoxBottom(id: string, dto: Partial<BoxBottom>): Promise<boolean | void> {
    const listUpdateData = await DB.BoxBottoms.update(dto, {
      where: { boxBottomId: id },
    });
    if (listUpdateData[0] === 0) {
      return false;
    }
    return true;
  }

  async deleteBoxBottom(id: string): Promise<void> {
    await DB.BoxBottoms.destroy({
      where: { boxBottomId: id },
    });
  }
}

export default BoxBottomService;

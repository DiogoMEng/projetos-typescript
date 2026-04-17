import { Op } from 'sequelize';
import { DB } from '../database/models';
import { BoxBottom } from '../interfaces/boxBottom.interface';
import { Service} from './Service';

class BoxBottomService extends Service<any, BoxBottom> {
  constructor () {
    super(DB.BoxBottoms, 'boxBottomId');
  }

  protected async beforeCreate(dto: BoxBottom): Promise<void> {
    const boxExists = await DB.BoxBottoms.findOne({
      where: {
        name: dto.name,
        userId: dto.userId,
      }
    });
    if (boxExists) throw new Error('Caixinha já existe para este usuário');
  }

async getAllBoxBottomsByUser(userId: string): Promise<BoxBottom[]> {
  return await super.getAll({
    where: {
      [Op.or]: [
        { userId },
        { '$boxMembers.user_id$': userId },
      ]
    },
    include: [
      {
        model: DB.RoleUserBoxBottoms,
        as: 'boxMembers',
        attributes: ['roleId'],
        required: false,
      },
      {
        model: DB.Users,
        as: 'BoxCreator',
        attributes: ['userId', 'name'],
      }
    ],
    distinct: true,
    subQuery: false,
  });
}
}

export default BoxBottomService;

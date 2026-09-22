import { Op, Transaction } from 'sequelize';
import { DB } from '#models/index.js';
import { BoxBottom } from '#interfaces/boxBottom.interface.js';
import { ConflictError, NotFoundError } from '#errors/httpErrors.js';
import { Service } from './Service';
import RoleUserBoxBottomService from './RoleUserBoxBottom.service';

const roleUserBoxBottomService = new RoleUserBoxBottomService();

class BoxBottomService extends Service<any, BoxBottom> {
  constructor() {
    super(DB.BoxBottoms, 'boxBottomId');
  }

  override async create(
    dto: BoxBottom,
    options: { transaction?: Transaction } = {},
  ): Promise<any> {
    if (options.transaction) return super.create(dto, options);

    const transaction = await DB.sequelize.transaction();
    try {
      const record = await super.create(dto, { transaction });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAllBoxBottomsByUser(userId: string): Promise<BoxBottom[]> {
    return await super.getAll({
      where: {
        [Op.or]: [{ userId }, { '$boxMembers.user_id$': userId }],
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
        },
      ],
      distinct: true,
      subQuery: false,
    });
  }

  protected async beforeCreate(
    dto: BoxBottom,
    transaction?: Transaction,
  ): Promise<void> {
    const boxExists = await DB.BoxBottoms.findOne({
      where: {
        name: dto.name,
        userId: dto.userId,
      },
      transaction,
    });
    if (boxExists)
      throw new ConflictError('Caixinha já existe para este usuário');
  }

  protected async afterCreate(
    record: BoxBottom,
    transaction?: Transaction,
  ): Promise<void> {
    const ownerRole = await DB.Roles.findOne({
      where: { name: 'OWNER' },
      transaction,
    });
    if (!ownerRole) throw new NotFoundError('Role OWNER não encontrada');

    const ownerPermission = {
      userId: record.userId,
      boxBottomId: record.boxBottomId,
      roleId: ownerRole.roleId,
    };

    if (transaction) {
      await roleUserBoxBottomService.create(ownerPermission, { transaction });
      return;
    }

    await roleUserBoxBottomService.create(ownerPermission);
  }
}

export default BoxBottomService;

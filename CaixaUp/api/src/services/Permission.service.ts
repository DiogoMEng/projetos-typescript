import { DB } from '#models/index.js';
import { Permission } from '#interfaces/permission.interface.js';
import { ConflictError, NotFoundError } from '#errors/httpErrors.js';
import { Service } from './Service';
import { Transaction } from 'sequelize';

class PermissionService extends Service<any, Permission> {
  constructor() {
    super(DB.Permissions, 'PermissionId');
  }

  async getAllMembers(boxBottomId: string): Promise<Permission[]> {
    return await super.getAll({
      where: { boxBottomId },
      include: [
        { model: DB.Users, as: 'assignedUser', attributes: ['name', 'email'] },
        { model: DB.Roles, as: 'assignedRole', attributes: ['name'] },
      ],
    });
  }

  async editRole(
    userId: string,
    boxBottomId: string,
    roleId: string,
  ): Promise<boolean> {
    const [affectedRows] = await DB.Permissions.update(
      { roleId },
      { where: { userId, boxBottomId } },
    );
    return affectedRows > 0;
  }

  protected async beforeCreate(
    dto: Permission,
    transaction?: Transaction,
  ): Promise<void> {
    const [user, box, role] = await Promise.all([
      DB.Users.findByPk(dto.userId, { transaction }),
      DB.BoxBottoms.findByPk(dto.boxBottomId, { transaction }),
      DB.Roles.findByPk(dto.roleId, { transaction }),
    ]);

    if (!user || !box || !role)
      throw new NotFoundError('Usuário, Caixa ou Função não encontrados');

    const existingPermission = await DB.Permissions.findOne({
      where: { userId: dto.userId, boxBottomId: dto.boxBottomId },
      transaction,
    });
    if (existingPermission)
      throw new ConflictError('O usuário já possui permissão nesta caixa.');
  }
}

export default PermissionService;

import { DB } from '../database/models';
import { RUBB } from '../interfaces/roleUserBoxBottom.interface';
import { Service } from './Service';

class RoelUserBoxBottomService extends Service<any, RUBB> {
  constructor() {
    super(DB.RoleUserBoxBottoms, 'roleUserBoxBottomId');
  }

  protected async beforeCreate(dto: RUBB): Promise<void> {
    const [user, box, role] = await Promise.all([
      DB.Users.findByPk(dto.userId),
      DB.BoxBottoms.findByPk(dto.boxBottomId),
      DB.Roles.findByPk(dto.roleId)
    ]);

    if (!user || !box  || !role) throw new Error('Usuário, Caixa ou Função não encontrados');

    const existingPermission = await DB.RoleUserBoxBottoms.findOne({
      where: { userId: dto.userId, boxBottomId: dto.boxBottomId }
    });
    if (existingPermission) throw new Error('O usuário já possui permissão nesta caixa.');
  }

  async getAllMembers(boxBottomId: string): Promise<RUBB[]> {
    return await super.getAll({
      where: { boxBottomId },
      include: [
        { model: DB.Users, as: 'assignedUser', attributes: ['name', 'email'] },
        { model: DB.Roles, as: 'assignedRole', attributes: ['name'] }
      ]
    })
  };

  async editRole(userId: string, boxBottomId: string, roleId: string): Promise<boolean> {
    const [affectedRows] = await DB.RoleUserBoxBottoms.update(
      { roleId },
      { where: { userId, boxBottomId } }
    );
    return affectedRows > 0;
  }
}

export default RoelUserBoxBottomService;

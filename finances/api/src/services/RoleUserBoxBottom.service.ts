import { DB } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import { RUBB } from '../interfaces/roleUserBoxBottom.interface';
import { where } from 'sequelize';

class RoelUserBoxBottomService {
  async register(dto: RUBB): Promise<RUBB> {
    const [user, boxBottom, role] = await Promise.all([
      DB.Users.findByPk(dto.userId),
      DB.BoxBottoms.findByPk(dto.boxBottomId),
      DB.Roles.findByPk(dto.roleId),
    ])
    if (!user) throw new Error('User not found.');
    if (!boxBottom) throw new Error('BoxBottom not found.');
    if (!role) throw new Error('Role not found.');
    const existingPermission = await DB.RoleUserBoxBottoms.findOne({
      where: {
        userId: dto.userId,
        boxBottomId: dto.boxBottomId,
      },
    });
    if (existingPermission) {
      throw new Error('User already has a permission level in this box.');
    }
    try {
      const permissionLevel = await DB.RoleUserBoxBottoms.create({
        roleUserBoxBottomId: uuidv4(),
        boxBottomId: dto.boxBottomId,
        userId: dto.userId,
        roleId: dto.roleId,
      });
      return permissionLevel;
    } catch (error) {
      throw new Error('Failed to create access record.');
    }
  }

  async getAllMembers(boxBottomId: string): Promise<RUBB[]> {
    const members = await DB.RoleUserBoxBottoms.findAll({
      where: {
        boxBottomId
      },
      include: [
        {
          model: DB.Users,
          as: 'assignedUser',
          attributes: ['name', 'email']
        },
        {
          model: DB.Roles,
          as: 'assignedRole',
          attributes: ['name']
        }
      ]
    });
    return members;
  }

  async editRole(userId: string, boxBottomId: string, dto: { roleId: string }): Promise<boolean | void> {
    const roleExists = await DB.Roles.findByPk(dto.roleId);
    if(!roleExists) throw new Error('The specified role does not exist.');
    const listUpdateData = await DB.RoleUserBoxBottoms.update({
      roleId: dto.roleId
    }, {
      where: { 
        userId, boxBottomId },
    });
    if (listUpdateData[0] === 0) {
      return false;
    }
    return true;
  }

  async deleteMember(id: string): Promise<void> {
    await DB.RoleUserBoxBottoms.destroy({
      where: { roleUserBoxBottomId: id },
    });
  }
}

export default RoelUserBoxBottomService;

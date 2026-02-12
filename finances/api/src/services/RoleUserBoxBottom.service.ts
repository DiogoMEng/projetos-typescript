import { DB } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import { RUBB } from '../interfaces/roleUserBoxBottom.interface';

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

  // async getAllBoxBottomsByUser(id: string): Promise<BoxBottom[]> {
  //   const boxBottoms = await DB.BoxBottoms.findAll({
  //     where: {
  //       userId: id
  //     },
  //     attributes: {
  //       exclude: ['userId']
  //     }
  //   });
  //   return boxBottoms;
  // }

  // async getBoxBottomById(id: string): Promise<BoxBottom | null> {
  //   const boxBottom = await DB.BoxBottoms.findByPk(id, {
  //     attributes: {
  //       exclude: ['userId']
  //     }
  //   });
  //   if(!boxBottom) {
  //     throw new Error('BoxBottom not found');
  //   }
  //   return boxBottom;
  // }

  // async editBoxBottom(id: string, dto: Partial<BoxBottom>): Promise<boolean | void> {
  //   const listUpdateData = await DB.BoxBottoms.update(dto, {
  //     where: { boxBottomId: id },
  //   });
  //   if (listUpdateData[0] === 0) {
  //     return false;
  //   }
  //   return true;
  // }

  // async deleteBoxBottom(id: string): Promise<void> {
  //   await DB.BoxBottoms.destroy({
  //     where: { boxBottomId: id },
  //   });
  // }
}

export default RoelUserBoxBottomService;

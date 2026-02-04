import { DB } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../interfaces/role.interface';

class RoleService {
  async getAllRoles(id: string): Promise<Role[]> {
    const roles = await DB.Roles.findAll();
    return roles;
  }
}

export default RoleService;

import { DB } from '../database/models';
import { Role } from '../interfaces/role.interface';
import { Service } from './Service'

class RoleService extends Service<any, Role> {
  constructor() {
    super(DB.Roles, 'roleId');
  }
}

export default RoleService;

import { DB } from '#models/index.js';
import { Role } from '#interfaces/role.interface.js';
import { Service } from './Service';

class RoleService extends Service<any, Role> {
  constructor() {
    super(DB.Roles, 'roleId');
  }
}

export default RoleService;

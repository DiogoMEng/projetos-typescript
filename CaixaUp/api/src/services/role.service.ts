import { DB } from '#models/index.js';
import { Role } from '#interfaces/role.interface.js';
import { ConflictError } from '#errors/httpErrors.js';
import { Service } from './Service';

class RoleService extends Service<any, Role> {
  constructor() {
    super(DB.Roles, 'roleId');
  }

  protected async beforeCreate(dto: Role): Promise<void> {
    const roleExists = await DB.Roles.findOne({ where: { name: dto.name } });
    if (roleExists) throw new ConflictError('Role já existe.');
  }
}

export default RoleService;

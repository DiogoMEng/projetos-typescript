import { Controller } from './Controller';
import RoleService from '../services/role.service';

class RoleController extends Controller {
  constructor() {
    super(new RoleService());
  }

  protected override getEntityName() { return 'Role'; }
}

export default new RoleController();
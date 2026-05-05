import { Controller } from './Controller';
import UserService from '../services/User.service';

class UserController extends Controller {
  constructor() {
    super(new UserService());
  }

  protected override getEntityName(): string {
    return 'User';
  }

  protected override getParamIdName(): string {
    return 'userId';
  }
}

export default new UserController();
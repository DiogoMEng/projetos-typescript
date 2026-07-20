import { hash } from 'bcryptjs';
import { DB } from '#models/index.js';
import { User } from '#interfaces/user.interface.js';
import { ConflictError } from '#errors/httpErrors.js';
import { Service } from './Service';

class UserService extends Service<any, User> {
  constructor() {
    super(DB.Users, 'userId');
  }

  protected async beforeCreate(dto: User): Promise<void> {
    const userExists = await DB.Users.findOne({ where: { email: dto.email } });
    if (userExists) throw new ConflictError('Usuário já existe');

    dto.password = await hash(dto.password, 8);
  }

  async getAllUsers(): Promise<User[]> {
    return super.getAll({ attributes: { exclude: ['password'] } });
  }
}

export default UserService;

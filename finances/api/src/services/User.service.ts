import { hash } from 'bcryptjs';
import { DB } from '../database/models';
import { User } from '../interfaces/user.interface';
import { Service } from './Service';

class UserService extends Service<any, User> {
  constructor() {
    super(DB.Users, 'userId');
  }

  protected async beforeCreate(dto: User): Promise<void> {
    const userExists = await DB.Users.findOne({ where: { email: dto.email } });
    if (userExists) throw new Error('Usuário já existe');

    dto.password = await hash(dto.password, 8);
  }

  async getAllUsers(): Promise<User[]> {
    return super.getAll({ attributes: { exclude: ['password'] } });
  }
}

export default UserService;

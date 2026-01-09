import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../database/models';
import { User } from '../interfaces/user.interface';

class UserService {
  async register(dto: User): Promise<User> {
    const user = await DB.Users.findOne({
      where: {
        email: dto.email,
      },
    });
    if (user) {
      throw new Error('User already exists');
    }
    try {
      const passwordHash = await hash(dto.password, 8);
      const newUser = await DB.Users.create({
        userId: uuidv4(),
        name: dto.name,
        email: dto.email,
        password: passwordHash,
      });
      return newUser;
    } catch (error) {
      throw new Error('Error registering user.');
    }
  }
}

export default UserService;

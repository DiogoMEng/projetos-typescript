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

  async getAllUsers(): Promise<User[]> {
    const users = await DB.Users.findAll({
      attributes: {
        exclude: ['password'],
      }
    });
    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await DB.Users.findByPk(id, {
      attributes: {
        exclude: ['password'],
      }
    });
    if(!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async editUser(id: string, dto: Partial<User>): Promise<boolean | void> {
    const listUpdateData = await DB.Users.update(dto, {
      where: { userId: id },
    });
    if (listUpdateData[0] === 0) {
      return false;
    }
    return true;
  }

  async deleteUser(id: string): Promise<void> {
    await DB.Users.destroy({
      where: { userId: id },
    });
  }
}

export default UserService;

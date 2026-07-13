import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DB } from '#models/index.js';
import { AuthCredentials } from '#interfaces/user.interface.js';
import { JWT_SECRET } from '#config/index.js';

class AuthService {
  async login(dto: AuthCredentials): Promise<{ accessToken: string }> {
    const { sign } = jwt;
    const user = await DB.Users.findOne({
      attributes: ['userId', 'email', 'password'],
      where: { email: dto.email },
    });
    if (!user) throw new Error('Usuário não encontrado');
    const passwordMatch = await compare(dto.password, user.password);
    if (!passwordMatch) throw new Error('Senha incorreta');
    const accessToken = sign(
      { userId: user.userId, email: user.email },
      JWT_SECRET!,
      { expiresIn: '5d' },
    );
    return { accessToken };
  }
}

export default AuthService;
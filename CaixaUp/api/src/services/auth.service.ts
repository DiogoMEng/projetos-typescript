import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { DB } from "../database/models";
import { AuthCredentials } from "interfaces/user.interface";
import { JWT_SECRET } from "../config";

class AuthService {
  async login (dto: AuthCredentials): Promise<{ accessToken: string }> {
    const user = await DB.Users.findOne({
      attributes: ["userId", "email", "password"],
      where: { email: dto.email },
    });
    if (!user) throw new Error("Usuário não encontrado");
    const passwordMatch = await compare(dto.password, user.password);
    if (!passwordMatch) throw new Error("Senha incorreta");
    const accessToken = sign(
      { userId: user.userId, email: user.email },
      JWT_SECRET!,
      { expiresIn: "5d" },
    );
    return { accessToken };
  }
}

export default AuthService;
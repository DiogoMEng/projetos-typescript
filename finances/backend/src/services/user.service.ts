import { ModelStatic } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from  "jsonwebtoken";
import User from "../database/models/User";
import resp from "../utils/resp";
import { BadRequestError } from "../helpers/api-erros";
import { CreateUserDTO } from "../interfaces/user.protocol";

class UserService {
  private model: ModelStatic<User> = User;

  async show() {

    const users = await this.model.findAll({ attributes: ["fullName", "email"] });

    const user = true;

    if (user) {
      throw new BadRequestError("Este e-mail já existe");
    }

    return resp(200, users);

  }

  async create(userData: CreateUserDTO) {

    const { fullName, email, password } = userData;

    if (await this.model.findOne({ where: { email } })) {
      throw new BadRequestError("Este e-mail já existe");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.model.create({ fullName, email, password: hashPassword });

    const { password: _, ...user } = newUser.get({ plain: true });

    return resp(200, user);

  }

  async login(userData: CreateUserDTO) {

    const {email, password } = userData;

    const user = await this.model.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestError("E-mail ou senha inválido");
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      { id: user.userId },
      process.env.JWT_PASS ?? "",
      { expiresIn: "7d" }
    )

    const { password: _, ...userLogin } = user;

    return resp(200, token);

  }
}

export default UserService;
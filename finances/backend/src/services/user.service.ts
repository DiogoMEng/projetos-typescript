import { ModelStatic } from "sequelize";
import User from "../database/models/User";
import resp from "../utils/resp";

class UserService {
  private model: ModelStatic<User> = User;

  async get() {
    const users = await this.model.findAll();

    return resp(200, users);
  }
}

export default UserService;
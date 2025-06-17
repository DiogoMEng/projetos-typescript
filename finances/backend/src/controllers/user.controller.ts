import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import bcrypt from "bcryptjs";
import User from "../database/models/User";
import { AuthenticatedUser } from "../interfaces/user.protocol";
import UserSchema from "../schemas/user.schema";


/**
 * CONTROLLER RESPONSIBLE FOR HANDLING USER-RELATED OPERATIONS:
 * - CREATION, LISTING, UPDATING AND DELETION OF USERS. 
 */
class UserController {
  private model: ModelStatic<User> = User;

  /**
   * CREATE A NEW USER:
   * - Validates request body.
   * - Checks if user already exists by email.
   * - Hashes password and saves user to the database.
   * - Returns the created user (without password).
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { error } = UserSchema.createUser().validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((d: any) => d.message).join("; ") });
    }

    try {
      const { fullName, email, password } = req.body;
      const existingUser = await this.model.findOne({ where: { email } });

      if (existingUser) {
        return res.status(409).json({ message: "Este usuário já existe" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await this.model.create({ fullName, email, password: hashPassword });

      const { password: _, ...user } = newUser.get({ plain: true });

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  /**
   *  LIST ALL USERS:
   *  - Returns an array of users with only fullName and email.
   */
  async show(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const users = await this.model.findAll({ attributes: ["fullName", "email"] });

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  /**
   *  DELETE A USER BY ID:
   *  - Validates the ID parameter.
   *  - Checks if the user exists.
   *  - Deletes the user from the database.
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { error } = UserSchema.deleteUser().validate(req.params, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((d: any) => d.message).join("; ") });
    }

    try {
      const { id } = req.params;
      const user = await this.model.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  /**
   *  UPDATE USER INFORMATION:
   *  - Validates request body.
   *  - Updates fullName and/or password for the authenticated user.
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { error, value } = UserSchema.updateUser().validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details.map((d: any) => d.message).join("; ") });
    }

    try {
      const { id } = req.user as AuthenticatedUser;
      const { fullName, password } = value;
      const hashPassword = await bcrypt.hash(password, 10);

      const [updatedRows] = await this.model.update(
        { fullName, password: hashPassword },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json({ message: "Usuário atualizado", newUser: { fullName } });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default UserController;
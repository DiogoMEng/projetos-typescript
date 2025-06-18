import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

/**
 * CONTROLLER RESPONSIBLE FOR HANDLING USER AUTHENTICATION OPERATIONS:
 * - LOGIN VALIDATION AND JWT TOKEN GENERATION FOR AUTHENTICATED USERS.
 */
class TokenController {
  private model: ModelStatic<User> = User;

  /**
  * AUTHENTICATE USER LOGIN AND GENERATE JWT TOKEN:
  * - Validates user credentials (email and password).
  * - Compares provided password with hashed password in database.
  * - Generates JWT token for successful authentication.
  * - Returns user data (without password) and authentication token.
  */
  async login(req: Request, res: Response, next: NextFunction) {

    try {
      const { email, password } = req.body;
      const user = await this.model.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const verifyPass = await bcrypt.compare(password, user!.password);

      if (!verifyPass) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const token = jwt.sign(
        { id: user!.userId },
        process.env.JWT_PASS ?? "",
        { expiresIn: "7d" }
      );

      const { password: _, ...userLogin } = user!.get({ plain: true });

      return res.status(200).json({ user: userLogin, token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
    
  }
}

export default TokenController;
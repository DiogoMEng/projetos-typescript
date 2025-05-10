import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ModelStatic } from "sequelize";
import bcrypt from "bcryptjs";
import User from "../database/models/User";

class UserController {
  private model: ModelStatic<User> = User;

  async show(req: Request, res: Response, next: NextFunction) {

    try {
      const users = await this.model.findAll({ attributes: ["fullName", "email"] });

      if(!users) {
        return res.status(404).json({ message: "No users found" });
      }
  
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
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
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

  async login(req: Request, res: Response, next: NextFunction) {

    try {
      const { email, password } = req.body;
      const user = await this.model.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      const verifyPass = await bcrypt.compare(password, user!.password);

      const token = jwt.sign(
        { id: user!.userId },
        process.env.JWT_PASS ?? "",
        { expiresIn: "7d" }
      );

      const { password: _, ...userLogin } = user!.get({ plain: true });

      return res.status(200).json({user: userLogin, token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    
    try {
      return res.json(req.user);
    } catch (error) {
      next(error);
    }

  }
}

export default UserController;
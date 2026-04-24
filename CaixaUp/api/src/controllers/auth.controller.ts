import { Request, Response } from "express";
import AuthService from "../services/auth.service";

const authService = new AuthService();

class AuthController {
  static async login (req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const login = await authService.login({ email, password });
      res.status(200).send(login);
    } catch(error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default AuthController;
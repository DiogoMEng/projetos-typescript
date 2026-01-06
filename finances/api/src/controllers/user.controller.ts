import UserService from '../services/user.service';
import { Request, Response } from 'express';

const userService = new UserService();

class UserController {
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    try {
      const user = await userService.register({
        name, email, password
      });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
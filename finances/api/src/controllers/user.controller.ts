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
      res.status(201).json({ name, email });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      }
    }
  }

  static async editUser(req: Request, res: Response) {
    const { id } = req.params;
    const dto = req.body;
    try {
      await userService.editUser(id, dto);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default UserController;
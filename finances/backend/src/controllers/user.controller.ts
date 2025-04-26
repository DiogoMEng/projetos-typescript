import UserService from "../services/user.service";
import { Request, Response, NextFunction } from "express";

class UserController {
  private service = new UserService();

  async get(req: Request, res: Response, next: NextFunction) {

    try {
      const { status, message } = await this.service.get();

      res.status(status).json(message);
    } catch (error) {
      next(error);
    }

  }
}

export default UserController;
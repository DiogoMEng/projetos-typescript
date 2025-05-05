import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";

class UserController {
  private service = new UserService();

  async show(req: Request, res: Response, next: NextFunction) {

    const { status, message } = await this.service.show();

    res.status(status).json(message);

  }

  async create(req: Request, res: Response, next: NextFunction) {

    const { status, message } = await this.service.create(req.body);

    res.status(status).json(message);

  }

  async login(req: Request, res: Response, next: NextFunction) {
    
    const { status, message } = await this.service.login(req.body);

    res.status(status).json(message);

  }

}

export default UserController;
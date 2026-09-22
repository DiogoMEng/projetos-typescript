import { Controller } from './Controller';
import UserService from '#services/User.service.js';
import { Request, Response } from 'express';
import { catchAsync } from '#utils/catchAsync.js';

class UserController extends Controller {
  constructor() {
    super(new UserService());
  }

  protected override getEntityName(): string {
    return 'User';
  }

  protected override getParamIdName(): string {
    return 'userId';
  }

  override getById = catchAsync(async (req: Request, res: Response) => {
    const user = await (this.service as UserService).getByIdWithoutPassword(
      req.params.userId,
    );
    res.status(200).json(user);
  });
}

export default new UserController();

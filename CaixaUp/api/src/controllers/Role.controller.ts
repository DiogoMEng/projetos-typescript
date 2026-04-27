import { catchAsync } from 'utils/catchAsync';
import RoleService from '../services/role.service';
import { Request, Response } from 'express';

const roleService = new RoleService();

class RoleController {
  static getAllRoles = catchAsync(async (req: Request, res: Response) => {
    const roles = await roleService.getAll();
    res.status(200).json(roles);
  });
}

export default RoleController;
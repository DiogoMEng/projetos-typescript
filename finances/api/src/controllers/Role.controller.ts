import RoleService from '../services/role.service';
import { Request, Response } from 'express';

const roleService = new RoleService();

class RoleController {
  static async getAllRoles(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const roles = await roleService.getAllRoles(id);
      res.status(200).json(roles);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default RoleController;
import { catchAsync } from 'utils/catchAsync';
import RoleUserBoxBottomService from '../services/RoleUserBoxBottom.service';
import { Request, Response } from 'express';

const roleUserBoxBottomService = new RoleUserBoxBottomService();

class RoleUserBoxBottomController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const { userId, roleId } = req.body;
    if (!userId || !boxBottomId || !roleId) {
      return res.status(400).json({ message: 'Missing required fields: userId, boxBottomId, roleId' });
    }
    const permission = await roleUserBoxBottomService.create({
      userId,
      boxBottomId,
      roleId,
    });
    res.status(201).json({
      message: 'Permission registered successfully.',
      data: permission,
    });
  });

  static getAllMembers = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const members = await roleUserBoxBottomService.getAllMembers(boxBottomId);
    res.status(200).json(members);
  });

  static editRole = catchAsync(async (req: Request, res: Response) => {
    const { userId, boxBottomId } = req.params;
    const { roleId } = req.body;
    const updatedRecord = await roleUserBoxBottomService.editRole(userId, boxBottomId, roleId);
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Access record not found for this user in the specified box.' });
    }
    res.status(200).json({ message: 'User role updated successfully' });
  });

  static deleteBoxBottom = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await roleUserBoxBottomService.delete(userId);
    res.status(200).json({ message: 'Member deleted successfully' });
  });
}

export default RoleUserBoxBottomController;
import RoleUserBoxBottomService from '../services/RoleUserBoxBottom.service';
import { Request, Response } from 'express';

const roleUserBoxBottomService = new RoleUserBoxBottomService();

class RoleUserBoxBottomController {
  static async register(req: Request, res: Response) {
    const { userId, boxBottomId } = req.params;
    const { roleId } = req.body;
    if (!userId || !boxBottomId || !roleId) {
      return res.status(400).json({ message: 'Missing required fields: userId, boxBottomId, roleId' }); 
    }
    try {
      const permission = await roleUserBoxBottomService.register({
        userId,
        boxBottomId,
        roleId
      });
      res.status(201).json({ 
        message: `Permission registered successfully.`,
        data: permission
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getAllMembers(req: Request, res: Response) {
    const { boxBottomId } = req.params;
    try {
      const members = await roleUserBoxBottomService.getAllMembers(boxBottomId);
      res.status(200).json(members);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async editRole(req: Request, res: Response) {
    const { userId, boxBottomId } = req.params;
    const { roleId } = req.body;
    try {
      const updatedRecord = await roleUserBoxBottomService.editRole(userId, boxBottomId, { roleId });
      if (!updatedRecord) {
        return res.status(404).json({ message: 'Access record not found for this user in the specified box.' });
      }
      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async deleteBoxBottom(req: Request, res: Response) {
    const { roleUserBoxBottomId } = req.params;
    try {
      await roleUserBoxBottomService.deleteMember(roleUserBoxBottomId);
      res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) { 
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default RoleUserBoxBottomController;
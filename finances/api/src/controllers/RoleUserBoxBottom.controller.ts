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

  // static async getAllBoxBottomsByUser(req: Request, res: Response) {
  //   const { id } = req.params;
  //   try {
  //     const boxBottoms = await boxBottomService.getAllBoxBottomsByUser(id);
  //     res.status(200).json(boxBottoms);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       res.status(400).json({ message: error.message });
  //     }
  //   }
  // }

  // static async getBoxBottomById(req: Request, res: Response) {
  //   const { id } = req.params;
  //   try {
  //     const boxBottom = await boxBottomService.getBoxBottomById(id);
  //     res.status(200).json(boxBottom);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       res.status(404).json({ message: error.message });
  //     }
  //   }
  // }

  // static async editBoxBottom(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const dto = req.body;
  //   try {
  //     const updatedRecord = await boxBottomService.editBoxBottom(id, dto);
  //     if (!updatedRecord) {
  //       return res.status(404).json({ message: 'BoxBottom not found' });
  //     }
  //     res.status(200).json({ message: 'BoxBottom updated successfully' });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       res.status(400).json({ message: error.message });
  //     }
  //   }
  // }

  // static async deleteBoxBottom(req: Request, res: Response) {
  //   const { id } = req.params;
  //   try {
  //     await boxBottomService.deleteBoxBottom(id);
  //     res.status(200).json({ message: 'BoxBottom deleted successfully' });
  //   } catch (error) { 
  //     if (error instanceof Error) {
  //       res.status(400).json({ message: error.message });
  //     }
  //   }
  // }
}

export default RoleUserBoxBottomController;
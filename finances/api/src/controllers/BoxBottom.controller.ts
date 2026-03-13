import BoxBottomService from '../services/BoxBottom.service';
import { Request, Response } from 'express';

const boxBottomService = new BoxBottomService();

class BoxBottomController {
  static async register(req: Request, res: Response) {
    const { userId } = req.params;
    const { name, description, targetValue } = req.body;
    try {
      const boxBottom = await boxBottomService.create({
        name, description, targetValue, userId
      });
        res.status(201).json({ message: `BoxBottom ${boxBottom.name} created successfully.` });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getAllBoxBottomsByUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const boxBottoms = await boxBottomService.getAllBoxBottomsByUser(userId);
      res.status(200).json(boxBottoms);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async getBoxBottomById(req: Request, res: Response) {
    const { boxBottomId } = req.params;
    try {
      const boxBottom = await boxBottomService.getById(boxBottomId);
      res.status(200).json(boxBottom);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      }
    }
  }

  static async editBoxBottom(req: Request, res: Response) {
    const { boxBottomId } = req.params;
    const dto = req.body;
    try {
      const updatedRecord = await boxBottomService.update(boxBottomId, dto);
      if (!updatedRecord) {
        return res.status(404).json({ message: 'BoxBottom not found' });
      }
      res.status(200).json({ message: 'BoxBottom updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  static async deleteBoxBottom(req: Request, res: Response) {
    const { boxBottomId } = req.params;
    try {
      await boxBottomService.delete(boxBottomId);
      res.status(200).json({ message: 'BoxBottom deleted successfully' });
    } catch (error) { 
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default BoxBottomController;
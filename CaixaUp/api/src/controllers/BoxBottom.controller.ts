import { catchAsync } from 'utils/catchAsync';
import BoxBottomService from '../services/BoxBottom.service';
import { Request, Response } from 'express';

const boxBottomService = new BoxBottomService();

class BoxBottomController {
  static register = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { name, description, targetValue } = req.body;
    const boxBottom = await boxBottomService.create({
      name, description, targetValue, userId,
    });
    res.status(201).json({
      message: `BoxBottom ${boxBottom.name} created successfully.`,
      boxBottomId: boxBottom.boxBottomId,
    });
  });

  static getAllBoxBottomsByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const boxBottoms = await boxBottomService.getAllBoxBottomsByUser(userId);
    res.status(200).json(boxBottoms);
  });

  static getBoxBottomById = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const boxBottom = await boxBottomService.getById(boxBottomId);
    res.status(200).json(boxBottom);
  });

  static editBoxBottom = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    const dto = req.body;
    const updatedRecord = await boxBottomService.update(boxBottomId, dto);
    if (!updatedRecord) {
      return res.status(404).json({ message: 'BoxBottom not found' });
    }
    res.status(200).json({ message: 'BoxBottom updated successfully' });
  });

  static deleteBoxBottom = catchAsync(async (req: Request, res: Response) => {
    const { boxBottomId } = req.params;
    await boxBottomService.delete(boxBottomId);
    res.status(200).json({ message: 'BoxBottom deleted successfully' });
  });
}

export default BoxBottomController;
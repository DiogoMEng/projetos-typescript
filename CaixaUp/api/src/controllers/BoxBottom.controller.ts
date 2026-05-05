import { Request, Response } from 'express';
import { Controller } from './Controller';
import BoxBottomService from '../services/BoxBottom.service';
import { catchAsync } from '../utils/catchAsync';

class BoxBottomController extends Controller {
  constructor() {
    super(new BoxBottomService());
  }

  protected override getEntityName(): string { return 'BoxBottom'; }
  protected override getParamIdName(): string { return 'boxBottomId'; }

  getAllBoxBottomsByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const boxBottoms = await (this.service as BoxBottomService).getAllBoxBottomsByUser(userId);
    res.status(200).json(boxBottoms);
  });

  override register = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { name, description, targetValue } = req.body;
    const boxBottom = await this.service.create({
      name, description, targetValue, userId,
    });
    res.status(201).json({
      message: `BoxBottom ${boxBottom.name} created successfully`,
      boxBottomId: boxBottom.boxBottomId,
    });
  });
}

export default new BoxBottomController();
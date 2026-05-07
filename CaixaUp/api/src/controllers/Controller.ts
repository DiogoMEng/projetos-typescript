import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Service } from '../interfaces/Service.interface';

export abstract class Controller {
  constructor(protected readonly service: Service) { }

  protected getEntityName(): string {
    return 'Record';
  }

  protected getCreateParams(req: Request): any {
    return req.body;
  }

  protected getParamIdName(): string {
    return 'id';
  }

  register = catchAsync(async (req: Request, res: Response) => {
    const data = this.getCreateParams(req);
    const record = await this.service.create(data);

    res.status(201).json({
      message: `${this.getEntityName()} created successfully`,
      data: record,
    });
  });

  getAll = catchAsync(async (req: Request, res: Response) => {
    const records = await this.service.getAll();
    res.status(200).json(records);
  });

  getById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params[this.getParamIdName()];
    const record = await this.service.getById(id);
    res.status(200).json(record);
  });

  edit = catchAsync(async (req: Request, res: Response) => {
    const id = req.params[this.getParamIdName()];
    const updatedRecord = await this.service.update(id, req.body);

    if (!updatedRecord) {
      return res.status(404).json({ message: `${this.getEntityName()} not found` });
    }
    res.status(200).json({ message: `${this.getEntityName()} updated successfully` });
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params[this.getParamIdName()];
    await this.service.delete(id);
    res.status(200).json({ message: `${this.getEntityName()} deleted successfully` });
  });
}
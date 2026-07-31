import { ValidationError } from '#errors/httpErrors.js';
import { AppError } from '#errors/AppError.js';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.details,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error('Erro não tratado', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
};
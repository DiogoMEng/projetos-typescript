import { ValidationError } from '#errors/httpErrors.js';
import { AppError } from '#errors/AppError.js';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  void next;

  if (
    err &&
    typeof err === 'object' &&
    'type' in err &&
    err.type === 'entity.parse.failed'
  ) {
    return res.status(400).json({ message: 'JSON inválido' });
  }

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

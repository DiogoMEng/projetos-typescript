import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ValidationError } from '#errors/httpErrors.js';

type ValidationTarget = 'body' | 'params' | 'query';

export const validateRequest = (
  schema: ObjectSchema,
  target: ValidationTarget = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return next(new ValidationError('Dados inválidos', details));
    }

    req[target] = value;
    next();
  };
};
import Joi from 'joi';

export const objectIdParam = (paramName: string) =>
  Joi.object({
    [paramName]: Joi.string().hex().length(24).required(),
  });
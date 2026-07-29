import Joi from 'joi';

const commonIdMessages = {
  'string.base': '{{#label}} deve ser um texto.',
  'string.empty': '{{#label}} não pode estar vazio.',
  'string.hex': '{{#label}} deve ser um identificador hexadecimal válido.',
  'string.uuid': '{{#label}} deve ser um UUID válido.',
  'any.required': '{{#label}} é obrigatório.',
  'object.unknown': 'Campo não permitido.',
};

export const objectIdParam = (paramName: string) =>
  Joi.object({
    [paramName]: Joi.string().trim().hex().length(24).required().messages(commonIdMessages).label(paramName),
  })
    .messages({ 'object.unknown': 'Campo não permitido.' })
    .unknown(false);

export const uuidParam = (paramName: string) =>
  Joi.object({
    [paramName]: Joi.string().trim().uuid().required().messages(commonIdMessages).label(paramName),
  })
    .messages({ 'object.unknown': 'Campo não permitido.' })
    .unknown(false);
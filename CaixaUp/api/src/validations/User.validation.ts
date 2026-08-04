import Joi from 'joi';

const commonMessages = {
  'string.base': '{{#label}} deve ser um texto.',
  'string.empty': '{{#label}} não pode estar vazio.',
  'string.min': '{{#label}} deve ter no mínimo {{#limit}} caracteres.',
  'string.max': '{{#label}} deve ter no máximo {{#limit}} caracteres.',
  'string.email': 'Informe um e-mail válido.',
  'any.required': '{{#label}} é obrigatório.',
  'object.unknown': 'Campo não permitido.',
};

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages(commonMessages).label('nome'),
  email: Joi.string().trim().email().required().messages(commonMessages).label('e-mail'),
  password: Joi.string().trim().min(8).required().messages(commonMessages).label('senha'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages(commonMessages).label('nome'),
  email: Joi.string().trim().email().messages(commonMessages).label('e-mail'),
})
  .min(1)
  .messages({
    ...commonMessages,
    'object.min': 'Pelo menos um campo deve ser informado.',
  })
  .unknown(false);
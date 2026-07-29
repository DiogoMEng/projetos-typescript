import Joi from 'joi';

const commonMessages = {
  'string.base': '{{#label}} deve ser um texto.',
  'string.empty': '{{#label}} não pode estar vazio.',
  'string.min': '{{#label}} deve ter no mínimo {{#limit}} caracteres.',
  'string.email': 'Informe um e-mail válido.',
  'any.required': '{{#label}} é obrigatório.',
  'object.unknown': 'Campo não permitido.',
};

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages(commonMessages).label('e-mail'),
  password: Joi.string().trim().min(8).required().messages(commonMessages).label('senha'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

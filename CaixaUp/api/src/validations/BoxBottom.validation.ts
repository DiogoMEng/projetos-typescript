import Joi from 'joi';

const commonMessages = {
  'string.base': '{{#label}} deve ser um texto.',
  'string.empty': '{{#label}} não pode estar vazio.',
  'string.min': '{{#label}} deve ter no mínimo {{#limit}} caracteres.',
  'string.max': '{{#label}} deve ter no máximo {{#limit}} caracteres.',
  'any.required': '{{#label}} é obrigatório.',
  'number.base': '{{#label}} deve ser um número.',
  'number.positive': '{{#label}} deve ser maior que zero.',
  'object.unknown': 'Campo não permitido.',
};

export const createBoxBottomSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages(commonMessages).label('nome'),
  description: Joi.string().trim().min(3).max(255).required().messages(commonMessages).label('descrição'),
  targetValue: Joi.number().positive().required().messages(commonMessages).label('valor-alvo'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const updateBoxBottomSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages(commonMessages).label('nome'),
  description: Joi.string().trim().min(3).max(255).messages(commonMessages).label('descrição'),
  targetValue: Joi.number().positive().messages(commonMessages).label('valor-alvo'),
})
  .min(1)
  .messages({
    ...commonMessages,
    'object.min': 'Pelo menos um campo deve ser informado.',
  })
  .unknown(false);

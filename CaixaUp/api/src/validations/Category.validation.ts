import Joi from 'joi';

const commonMessages = {
  'string.base': '{{#label}} deve ser um texto.',
  'string.empty': '{{#label}} não pode estar vazio.',
  'string.min': '{{#label}} deve ter no mínimo {{#limit}} caracteres.',
  'string.max': '{{#label}} deve ter no máximo {{#limit}} caracteres.',
  'any.required': '{{#label}} é obrigatório.',
  'any.only': '{{#label}} deve ser um dos valores permitidos: {{#valids}}.',
  'object.unknown': 'Campo não permitido.',
};

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages(commonMessages).label('nome'),
  type: Joi.string().trim().valid('receita', 'despesa').required().messages(commonMessages).label('tipo'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages(commonMessages).label('nome'),
  type: Joi.string().trim().valid('receita', 'despesa').messages(commonMessages).label('tipo'),
})
  .min(1)
  .messages({
    ...commonMessages,
    'object.min': 'Pelo menos um campo deve ser informado.',
  })
  .unknown(false);

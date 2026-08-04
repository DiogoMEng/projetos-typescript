import Joi from 'joi';

const commonMessages = {
  'string.base': '{{#label}} deve ser um texto.',
  'string.empty': '{{#label}} não pode estar vazio.',
  'string.min': '{{#label}} deve ter no mínimo {{#limit}} caracteres.',
  'string.max': '{{#label}} deve ter no máximo {{#limit}} caracteres.',
  'string.uuid': '{{#label}} deve ser um UUID válido.',
  'any.required': '{{#label}} é obrigatório.',
  'any.only': '{{#label}} deve ser um dos valores permitidos: {{#valids}}.',
  'number.base': '{{#label}} deve ser um número.',
  'number.positive': '{{#label}} deve ser maior que zero.',
  'number.precision': '{{#label}} deve ter no máximo 2 casas decimais.',
  'date.base': '{{#label}} deve ser uma data válida.',
  'date.format': '{{#label}} deve estar em um formato de data válido.',
  'object.unknown': 'Campo não permitido.',
};

export const createTransactionSchema = Joi.object({
  movementType: Joi.string().trim().valid('inflow', 'outflow').required().messages(commonMessages).label('tipo de movimentação'),
  value: Joi.number().positive().precision(2).required().messages(commonMessages).label('valor'),
  transactionDate: Joi.date().iso().required().messages(commonMessages).label('data da transação'),
  description: Joi.string().trim().min(3).max(255).required().messages(commonMessages).label('descrição'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const updateTransactionSchema = Joi.object({
  movementType: Joi.string().trim().valid('inflow', 'outflow').messages(commonMessages).label('tipo de movimentação'),
  value: Joi.number().positive().precision(2).messages(commonMessages).label('valor'),
  transactionDate: Joi.date().iso().messages(commonMessages).label('data da transação'),
  description: Joi.string().trim().min(3).max(255).messages(commonMessages).label('descrição'),
})
  .min(1)
  .messages({
    ...commonMessages,
    'object.min': 'Pelo menos um campo deve ser informado.',
  })
  .unknown(false);

export const createTransactionParamsSchema = Joi.object({
  boxBottomId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da caixa'),
  categoryId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da categoria'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const transactionParamsSchema = Joi.object({
  transactionId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da transação'),
  boxBottomId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da caixa'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

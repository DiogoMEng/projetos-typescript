import Joi from 'joi';

const commonMessages = {
  'string.base': '{{#label}} deve ser um texto.',
  'string.empty': '{{#label}} não pode estar vazio.',
  'string.uuid': '{{#label}} deve ser um UUID válido.',
  'any.required': '{{#label}} é obrigatório.',
  'object.unknown': 'Campo não permitido.',
};

export const createRoleUserBoxBottomSchema = Joi.object({
  userId: Joi.string().trim().uuid().required().messages(commonMessages).label('id do usuário'),
  roleId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da função'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const editRoleUserBoxBottomSchema = Joi.object({
  roleId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da função'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const roleUserBoxBottomCreateParamsSchema = Joi.object({
  boxBottomId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da caixa'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const roleUserBoxBottomGetParamsSchema = Joi.object({
  boxBottomId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da caixa'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const roleUserBoxBottomEditParamsSchema = Joi.object({
  userId: Joi.string().trim().uuid().required().messages(commonMessages).label('id do usuário'),
  boxBottomId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da caixa'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

export const roleUserBoxBottomDeleteParamsSchema = Joi.object({
  roleUserBoxBottomId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da associação'),
  boxBottomId: Joi.string().trim().uuid().required().messages(commonMessages).label('id da caixa'),
})
  .messages({ 'object.unknown': 'Campo não permitido.' })
  .unknown(false);

import Joi from "joi";

const roleSchema = {
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(2).max(255).required(),
};

export const createRoleSchema = Joi.object(roleSchema)
  .messages({ "object.unknown": "Campo não permitido." })
  .unknown(false);

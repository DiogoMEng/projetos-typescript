import Joi from "joi";

class UserSchema {
  static createUser() {
    return Joi.object({
      fullName: Joi.string()
        .min(3)
        .max(100)
        .pattern(/^[A-Za-zÀ-ÿ\s]+$/u)
        .required()
        .messages({
          "string.base": "O nome deve ser um texto.",
          "string.empty": "O nome é obrigatório.",
          "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
          "string.max": "O nome deve ter no máximo {#limit} caracteres.",
          "string.pattern.base": "O nome deve conter apenas letras e espaços.",
          "any.required": "O nome é obrigatório.",
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({
          "string.base": "O e-mail deve ser um texto.",
          "string.email": "O e-mail deve ser válido.",
          "string.empty": "O e-mail é obrigatório.",
          "any.required": "O e-mail é obrigatório.",
        }),
      password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@&])[A-Za-z\d!?@&]{6,}$/)
        .required()
        .messages({
          "string.base": "A senha deve ser um texto.",
          "string.empty": "A senha é obrigatória.",
          "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
          "string.pattern.base": "A senha deve conter letras minúscula e maiúscula, números e caracteres especiais (!, ?, @ ou &).",
          "any.required": "A senha é obrigatória.",
        }),
    });
  }

  static updateUser() {
    return Joi.object({
      name: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
          "string.base": "O nome deve ser um texto.",
          "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
          "string.max": "O nome deve ter no máximo {#limit} caracteres.",
        }),
      password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?@&])[A-Za-z\d!?@&]{6,}$/)
        .optional()
        .messages({
          "string.base": "A senha deve ser um texto.",
          "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
          "string.pattern.base": "A senha deve conter letras minúscula e maiúscula, números e caracteres especiais (!, ?, @ ou &).",
        }),
    })
      .or('name', 'password')
      .messages({
        "object.missing": "Informe pelo menos o nome ou a senha para atualizar.",
      });
  }

  static deleteUser() {
    return Joi.object({
      id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          "number.base": "O ID deve ser um número.",
          "number.integer": "O ID deve ser um número inteiro.",
          "number.positive": "O ID deve ser um número positivo.",
          "any.required": "O ID é obrigatório.",
        }),
    });
  }
}

export default UserSchema;
import Joi from "joi";

class CategorySchema {
  static createCategory() {
    return Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
          "string.base": "O campo 'name' deve ser um texto.",
          "string.empty": "O campo 'name' não pode ser vazio.",
          "string.min": "O campo 'name' deve ter pelo menos {#limit} caracteres.",
          "string.max": "O campo 'name' deve ter no máximo {#limit} caracteres.",
          "any.required": "O campo 'name' é obrigatório.",
        }),
      description: Joi.string()
        .allow("")
        .max(255)
        .optional()
        .messages({
          "string.base": "O campo 'description' deve ser um texto.",
          "string.max": "O campo 'description' deve ter no máximo {#limit} caracteres.",
        }),
      userId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          "number.base": "O ID do usuário deve ser um número.",
          "number.integer": "O ID do usuário deve ser um número inteiro.",
          "number.positive": "O ID do usuário deve ser positivo.",
          "any.required": "O ID do usuário é obrigatório.",
        }),
    });
  }

  static updateCategory() {
    return Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
          "string.base": "O campo 'name' deve ser um texto.",
          "string.empty": "O campo 'name' não pode ser vazio.",
          "string.min": "O campo 'name' deve ter pelo menos {#limit} caracteres.",
          "string.max": "O campo 'name' deve ter no máximo {#limit} caracteres.",
        }),
      description: Joi.string()
        .allow("")
        .max(255)
        .optional()
        .messages({
          "string.base": "O campo 'description' deve ser um texto.",
          "string.max": "O campo 'description' deve ter no máximo {#limit} caracteres.",
        }),
    })
    .or('name', 'description')
    .messages({
      "object.missing": "Informe pelo menos um campo para atualizar.",
    });
  }

  static deleteCategory() {
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

  static showCategory() {
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

export default CategorySchema;
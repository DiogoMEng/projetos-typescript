import Joi from "joi";

class CategorySchema {
  static createCategory() {
    return Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
          "string.base": "O nome deve ser um texto.",
          "string.empty": "O nome não pode ser vazio.",
          "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
          "string.max": "O nome deve ter no máximo {#limit} caracteres.",
          "any.required": "O nome é obrigatório.",
        }),
      description: Joi.string()
        .allow("")
        .max(255)
        .optional()
        .messages({
          "string.base": "A descrição deve ser um texto.",
          "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
        })
    });
  }

  static updateCategory() {
    return Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
          "string.base": "O nome deve ser um texto.",
          "string.empty": "O nome não pode ser vazio.",
          "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
          "string.max": "O nome deve ter no máximo {#limit} caracteres.",
        }),
      description: Joi.string()
        .allow("")
        .max(255)
        .optional()
        .messages({
          "string.base": "A descrição deve ser um texto.",
          "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
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

}

export default CategorySchema;
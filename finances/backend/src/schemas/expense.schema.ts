import Joi from "joi";

class ExpenseSchema {
  static createExpense() {
    return Joi.object({
      description: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
          "string.base": "A descrição deve ser um texto.",
          "string.empty": "A descrição é obrigatória.",
          "string.min": "A descrição deve ter pelo menos {#limit} caracteres.",
          "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
          "any.required": "A descrição é obrigatória.",
        }),
      value: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
          "number.base": "O valor deve ser um número.",
          "number.positive": "O valor deve ser positivo.",
          "number.precision": "O valor pode ter no máximo 2 casas decimais.",
          "any.required": "O valor é obrigatório.",
        }),
      date: Joi.date()
        .iso()
        .required()
        .messages({
          "date.base": "A data deve ser válida.",
          "date.format": "A data deve estar no formato ISO.",
          "any.required": "A data é obrigatória.",
        }),
      observation: Joi.string()
        .allow("")
        .max(255)
        .optional()
        .messages({
          "string.base": "A observação deve ser um texto.",
          "string.max": "A observação deve ter no máximo {#limit} caracteres.",
        }),
      situation: Joi.boolean()
        .required()
        .messages({
          "boolean.base": "O campo 'situation' deve ser verdadeiro ou falso.",
          "any.required": "O campo 'situation' é obrigatório.",
        }),
      categoryId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          "number.base": "O campo 'categoryId' deve ser um número.",
          "number.integer": "O campo 'categoryId' deve ser um número inteiro.",
          "number.positive": "O campo 'categoryId' deve ser positivo.",
          "any.required": "O campo 'categoryId' é obrigatório.",
        }),
      paymentMethodId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          "number.base": "O campo 'paymentMethodId' deve ser um número.",
          "number.integer": "O campo 'paymentMethodId' deve ser um número inteiro.",
          "number.positive": "O campo 'paymentMethodId' deve ser positivo.",
          "any.required": "O campo 'paymentMethodId' é obrigatório.",
        }),
    });
  }

  static updateExpense() {
    return Joi.object({
      description: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
          "string.base": "A descrição deve ser um texto.",
          "string.min": "A descrição deve ter pelo menos {#limit} caracteres.",
          "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
        }),
      value: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
          "number.base": "O valor deve ser um número.",
          "number.positive": "O valor deve ser positivo.",
          "number.precision": "O valor pode ter no máximo 2 casas decimais.",
        }),
      date: Joi.date()
        .iso()
        .optional()
        .messages({
          "date.base": "A data deve ser válida.",
          "date.format": "A data deve estar no formato ISO.",
        }),
      observation: Joi.string()
        .allow("")
        .max(255)
        .optional()
        .messages({
          "string.base": "A observação deve ser um texto.",
          "string.max": "A observação deve ter no máximo {#limit} caracteres.",
        }),
      situation: Joi.boolean()
        .optional()
        .messages({
          "boolean.base": "O campo 'situation' deve ser verdadeiro ou falso.",
        }),
      categoryId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
          "number.base": "O campo 'categoryId' deve ser um número.",
          "number.integer": "O campo 'categoryId' deve ser um número inteiro.",
          "number.positive": "O campo 'categoryId' deve ser positivo.",
        }),
      paymentMethodId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
          "number.base": "O campo 'paymentMethodId' deve ser um número.",
          "number.integer": "O campo 'paymentMethodId' deve ser um número inteiro.",
          "number.positive": "O campo 'paymentMethodId' deve ser positivo.",
        }),
    })
    .or('description', 'value', 'date', 'observation', 'situation', 'categoryId', 'paymentMethodId')
    .messages({
      "object.missing": "Informe pelo menos um campo para atualizar.",
    });
  }

  static idParam() {
    return Joi.object({
      id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          "number.base": "O parâmetro 'id' deve ser um número.",
          "number.integer": "O parâmetro 'id' deve ser um número inteiro.",
          "number.positive": "O parâmetro 'id' deve ser um número positivo.",
          "any.required": "O parâmetro 'id' é obrigatório.",
        }),
    });
  }
}

export default ExpenseSchema;
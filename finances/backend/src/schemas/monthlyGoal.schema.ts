import Joi from "joi";

class MonthlyGoalSchema {
  static createMonthlyGoal() {
    return Joi.object({
      month: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required()
        .messages({
          "number.base": "O mês deve ser um número.",
          "number.integer": "O mês deve ser um número inteiro.",
          "number.min": "O mês deve ser no mínimo {#limit}.",
          "number.max": "O mês deve ser no máximo {#limit}.",
          "any.required": "O mês é obrigatório.",
        }),
      year: Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .required()
        .messages({
          "number.base": "O ano deve ser um número.",
          "number.integer": "O ano deve ser um número inteiro.",
          "number.min": "O ano deve ser no mínimo {#limit}.",
          "number.max": "O ano deve ser no máximo {#limit}.",
          "any.required": "O ano é obrigatório.",
        }),
      limitValue: Joi.number()
        .positive()
        .required()
        .messages({
          "number.base": "O valor limite deve ser um número.",
          "number.positive": "O valor limite deve ser um número positivo.",
          "any.required": "O valor limite é obrigatório.",
        })
    });
  }

  static updateMonthlyGoal() {
    return Joi.object({
      month: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .optional()
        .messages({
          "number.base": "O mês deve ser um número.",
          "number.integer": "O mês deve ser um número inteiro.",
          "number.min": "O mês deve ser no mínimo {#limit}.",
          "number.max": "O mês deve ser no máximo {#limit}.",
        }),
      year: Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .optional()
        .messages({
          "number.base": "O ano deve ser um número.",
          "number.integer": "O ano deve ser um número inteiro.",
          "number.min": "O ano deve ser no mínimo {#limit}.",
          "number.max": "O ano deve ser no máximo {#limit}.",
        }),
      limitValue: Joi.number()
        .positive()
        .optional()
        .messages({
          "number.base": "O valor limite deve ser um número.",
          "number.positive": "O valor limite deve ser um número positivo.",
        }),
    })
    .or('month', 'year', 'limitValue')
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

export default MonthlyGoalSchema;
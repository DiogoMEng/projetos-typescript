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
          "number.base": "O campo 'month' deve ser um número.",
          "number.integer": "O campo 'month' deve ser um número inteiro.",
          "number.min": "O campo 'month' deve ser no mínimo {#limit}.",
          "number.max": "O campo 'month' deve ser no máximo {#limit}.",
          "any.required": "O campo 'month' é obrigatório.",
        }),
      year: Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .required()
        .messages({
          "number.base": "O campo 'year' deve ser um número.",
          "number.integer": "O campo 'year' deve ser um número inteiro.",
          "number.min": "O campo 'year' deve ser no mínimo {#limit}.",
          "number.max": "O campo 'year' deve ser no máximo {#limit}.",
          "any.required": "O campo 'year' é obrigatório.",
        }),
      limitValue: Joi.number()
        .positive()
        .required()
        .messages({
          "number.base": "O campo 'limitValue' deve ser um número.",
          "number.positive": "O campo 'limitValue' deve ser um número positivo.",
          "any.required": "O campo 'limitValue' é obrigatório.",
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

  static updateMonthlyGoal() {
    return Joi.object({
      month: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .optional()
        .messages({
          "number.base": "O campo 'month' deve ser um número.",
          "number.integer": "O campo 'month' deve ser um número inteiro.",
          "number.min": "O campo 'month' deve ser no mínimo {#limit}.",
          "number.max": "O campo 'month' deve ser no máximo {#limit}.",
        }),
      year: Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .optional()
        .messages({
          "number.base": "O campo 'year' deve ser um número.",
          "number.integer": "O campo 'year' deve ser um número inteiro.",
          "number.min": "O campo 'year' deve ser no mínimo {#limit}.",
          "number.max": "O campo 'year' deve ser no máximo {#limit}.",
        }),
      limitValue: Joi.number()
        .positive()
        .optional()
        .messages({
          "number.base": "O campo 'limitValue' deve ser um número.",
          "number.positive": "O campo 'limitValue' deve ser um número positivo.",
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
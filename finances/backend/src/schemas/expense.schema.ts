import Joi from "joi";

class ExpenseSchema {
  static createExpense() {
    return Joi.object({
      description: Joi.string()
        .min(3)
        .max(255)
        .pattern(/^(?!^\d+$).*$/)
        .required()
        .messages({
          "string.base": "A descrição deve ser um texto.",
          "string.empty": "A descrição é obrigatória.",
          "string.min": "A descrição deve ter pelo menos {#limit} caracteres.",
          "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
          "string.pattern.base": "A descrição não pode conter apenas números.",
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
      date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
          "date.base": "A data deve ser válida.",
          "string.pattern.base": "A data deve estar no formato YYYY-MM-DD (exemplo: 2025-06-17).",
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
          "boolean.base": "A situação deve ser verdadeiro ou falso.",
          "any.required": "A situação' é obrigatório.",
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
      date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .optional()
        .messages({
          "date.base": "A data deve ser válida.",
          "string.pattern.base": "A data deve estar no formato YYYY-MM-DD (exemplo: 2025-06-17)."
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
          "boolean.base": "A situação deve ser verdadeiro ou falso.",
        })
    })
    .or('description', 'value', 'date', 'observation', 'situation')
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
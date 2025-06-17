import Joi from "joi";

class IncomeSchema {

  static createIncome() {
    
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
      dateReceipt: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
          "string.base": "A data deve ser um texto.",
          "string.empty": "A data é obrigatória.",
          "string.pattern.base": "A data deve estar no formato YYYY-MM-DD (exemplo: 2025-06-17).",
          "any.required": "A data é obrigatória.",
        }),
      type: Joi.string()
        .min(3)
        .max(50)
        .optional()
        .messages({
          "string.base": "A categoria deve ser um texto.",
          "string.min": "A categoria deve ter pelo menos {#limit} caracteres.",
          "string.max": "A categoria deve ter no máximo {#limit} caracteres.",
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

  static updateIncome() {
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
      dateReceipt: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
          "string.base": "A data deve ser um texto.",
          "string.empty": "A data é obrigatória.",
          "string.pattern.base": "A data deve estar no formato YYYY-MM-DD (exemplo: 2025-06-17).",
          "any.required": "A data é obrigatória.",
        }),
      type: Joi.string()
        .min(3)
        .max(50)
        .optional()
        .messages({
          "string.base": "A categoria deve ser um texto.",
          "string.min": "A categoria deve ter pelo menos {#limit} caracteres.",
          "string.max": "A categoria deve ter no máximo {#limit} caracteres.",
        }),
    })
    .or('description', 'amount', 'date', 'category')
    .messages({
      "object.missing": "Informe pelo menos um campo para atualizar.",
    });
  }

  static deleteIncome() {
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

export default IncomeSchema;
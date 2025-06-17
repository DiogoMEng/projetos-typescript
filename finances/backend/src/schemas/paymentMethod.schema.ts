import Joi from "joi";

class PaymentMethodSchema {
  static createPaymentMethod() {
    return Joi.object({
      type: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
          "string.base": "O campo deve ser um texto.",
          "string.empty": "O campo não pode ser vazio.",
          "string.min": "O campo deve ter pelo menos {#limit} caractere.",
          "string.max": "O campo deve ter no máximo {#limit} caracteres.",
          "any.required": "O campo é obrigatório.",
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

  static updatePaymentMethod() {
    return Joi.object({
      type: Joi.string()
        .min(1)
        .max(50)
        .optional()
        .messages({
          "string.base": "O campo deve ser um texto.",
          "string.empty": "O campo não pode ser vazio.",
          "string.min": "O campo deve ter pelo menos {#limit} caractere.",
          "string.max": "O campo deve ter no máximo {#limit} caracteres.",
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
    .or('type', 'description')
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

export default PaymentMethodSchema;
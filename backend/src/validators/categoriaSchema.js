const Joi = require('joi')

const createCategoriaSchema = Joi.object({
  nombre: Joi.string().min(1).max(80).required().messages({
    'string.min': 'El nombre es obligatorio',
    'string.max': 'El nombre no puede superar los 80 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  slug: Joi.string()
    .min(1)
    .max(80)
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'El slug solo puede contener letras minúsculas, números y guiones',
      'any.required': 'El slug es obligatorio',
    }),
  descripcion: Joi.string().max(500).allow('', null).messages({
    'string.max': 'La descripción no puede superar los 500 caracteres',
  }),
})

const updateCategoriaSchema = Joi.object({
  nombre: Joi.string().min(1).max(80).messages({
    'string.min': 'El nombre no puede estar vacío',
    'string.max': 'El nombre no puede superar los 80 caracteres',
  }),
  slug: Joi.string()
    .min(1)
    .max(80)
    .pattern(/^[a-z0-9-]+$/)
    .messages({
      'string.pattern.base': 'El slug solo puede contener letras minúsculas, números y guiones',
    }),
  descripcion: Joi.string().max(500).allow('', null),
}).min(1)

module.exports = { createCategoriaSchema, updateCategoriaSchema }

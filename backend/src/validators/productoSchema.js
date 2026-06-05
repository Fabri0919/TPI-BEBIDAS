const Joi = require('joi')

const createProductoSchema = Joi.object({
  nombre: Joi.string().min(2).max(160).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede superar los 160 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  descripcion: Joi.string().max(2000).allow('', null).messages({
    'string.max': 'La descripción no puede superar los 2000 caracteres',
  }),
  volumen_ml: Joi.number().integer().positive().required().messages({
    'number.integer': 'El volumen debe ser un número entero',
    'number.positive': 'El volumen debe ser mayor a 0',
    'any.required': 'El volumen es obligatorio',
  }),
  precio_centavos: Joi.number().integer().min(1).required().messages({
    'number.integer': 'El precio debe ser un número entero en centavos',
    'number.min': 'El precio debe ser mayor a 0',
    'any.required': 'El precio es obligatorio',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.integer': 'El stock debe ser un número entero',
    'number.min': 'El stock no puede ser negativo',
    'any.required': 'El stock es obligatorio',
  }),
  imagen_url: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Ingresá una URL válida',
  }),
  categoria_id: Joi.number().integer().positive().required().messages({
    'number.positive': 'Seleccioná una categoría',
    'any.required': 'La categoría es obligatoria',
  }),
  subcategoria: Joi.string()
    .valid('Blend', 'Single Malt', 'American', 'Irish')
    .allow(null)
    .messages({
      'any.only': 'La subcategoría debe ser Blend, Single Malt, American o Irish',
    }),
}).messages({
  'any.required': 'Campo requerido',
})

const updateProductoSchema = Joi.object({
  nombre: Joi.string().min(2).max(160).messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede superar los 160 caracteres',
  }),
  descripcion: Joi.string().max(2000).allow('', null),
  volumen_ml: Joi.number().integer().positive().messages({
    'number.positive': 'El volumen debe ser mayor a 0',
  }),
  precio_centavos: Joi.number().integer().min(1).messages({
    'number.min': 'El precio debe ser mayor a 0',
  }),
  stock: Joi.number().integer().min(0).messages({
    'number.min': 'El stock no puede ser negativo',
  }),
  imagen_url: Joi.string().uri().allow('', null).messages({
    'string.uri': 'Ingresá una URL válida',
  }),
  categoria_id: Joi.number().integer().positive(),
  subcategoria: Joi.string().valid('Blend', 'Single Malt', 'American', 'Irish').allow(null),
}).min(1)

module.exports = { createProductoSchema, updateProductoSchema }

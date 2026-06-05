const Joi = require('joi')

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(120).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre es demasiado largo',
    'any.required': 'El nombre es obligatorio',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Ingresá un email válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
})

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Ingresá un email válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es obligatoria',
  }),
})

module.exports = { registerSchema, loginSchema }

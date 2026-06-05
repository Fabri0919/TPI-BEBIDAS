const Joi = require('joi')

const createUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(120).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Ingresá un email válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
  rol: Joi.string().valid('cliente', 'admin', 'super-admin').required().messages({
    'any.only': 'El rol debe ser cliente, admin o super-admin',
    'any.required': 'El rol es obligatorio',
  }),
})

const updateUsuarioSchema = Joi.object({
  nombre: Joi.string().min(2).max(120).messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Ingresá un email válido',
  }),
  rol: Joi.string().valid('cliente', 'admin', 'super-admin').messages({
    'any.only': 'El rol debe ser cliente, admin o super-admin',
  }),
}).min(1)

module.exports = { createUsuarioSchema, updateUsuarioSchema }

const Joi = require('joi')

const createPedidoSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        producto_id: Joi.number().integer().positive().required().messages({
          'any.required': 'El ID del producto es obligatorio',
          'number.positive': 'El ID del producto debe ser positivo',
        }),
        cantidad: Joi.number().integer().min(1).required().messages({
          'number.min': 'La cantidad debe ser al menos 1',
          'any.required': 'La cantidad es obligatoria',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'El pedido debe tener al menos un producto',
      'any.required': 'Los items del pedido son obligatorios',
    }),
  direccion_entrega: Joi.object({
    nombre: Joi.string().min(1).required().messages({
      'any.required': 'El nombre del destinatario es obligatorio',
    }),
    direccion: Joi.string().min(1).required().messages({
      'any.required': 'La dirección es obligatoria',
    }),
    localidad: Joi.string().min(1).required().messages({
      'any.required': 'La localidad es obligatoria',
    }),
    provincia: Joi.string().min(1).required().messages({
      'any.required': 'La provincia es obligatoria',
    }),
    telefono: Joi.string()
      .pattern(/^[0-9+\-\s()]{6,20}$/)
      .required()
      .messages({
        'string.pattern.base': 'El teléfono debe tener un formato válido',
        'any.required': 'El teléfono es obligatorio',
      }),
  })
    .required()
    .messages({
      'any.required': 'Los datos de entrega son obligatorios',
    }),
  notas: Joi.string().max(500).allow('', null),
})

const changeEstadoSchema = Joi.object({
  estado: Joi.string()
    .valid('pendiente_pago', 'confirmado', 'enviado', 'entregado', 'cancelado')
    .required()
    .messages({
      'any.only': 'El estado debe ser uno de: pendiente_pago, confirmado, enviado, entregado, cancelado',
      'any.required': 'El estado es obligatorio',
    }),
})

module.exports = { createPedidoSchema, changeEstadoSchema }

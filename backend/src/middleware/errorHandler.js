const AppError = require('../errors/AppError')

// Human-readable messages for common error codes
const MESSAGE_MAP = {
  VALIDATION_ERROR: 'Error de validación',
  TOKEN_REQUIRED: 'Token requerido',
  TOKEN_EXPIRED: 'Token expirado o inválido',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  EMAIL_TAKEN: 'El email ya está registrado',
  INVALID_CREDENTIALS: 'Credenciales incorrectas',
  ACCOUNT_DISABLED: 'Cuenta desactivada',
  STOCK_INSUFFICIENT: 'Stock insuficiente',
  INVALID_TRANSITION: 'Transición de estado inválida',
  CANCEL_NOT_ALLOWED: 'Solo podés cancelar un pedido en estado pendiente_pago',
  SELF_DELETE: 'No podés desactivar tu propia cuenta',
  CATEGORIA_HAS_PRODUCTS: 'La categoría tiene productos activos asociados',
  NOMBRE_TAKEN: 'Ya existe un registro con ese nombre',
  CATEGORIA_NOT_FOUND: 'La categoría seleccionada no existe o está inactiva',
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    const message = MESSAGE_MAP[err.code] || err.message || 'Error inesperado'
    const body = { error: { code: err.code, message } }
    if (err.details) {
      body.error.details = err.details
    }
    return res.status(err.statusCode).json(body)
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: { code: 'UNIQUE_CONSTRAINT', message: 'Ya existe un registro con ese valor' },
    })
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación',
        details: err.errors.map((e) => ({ field: e.path, message: e.message })),
      },
    })
  }

  // JWT errors (not caught in middleware)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: { code: 'TOKEN_EXPIRED', message: 'Token expirado o inválido' },
    })
  }

  // Unknown / internal error
  console.error('[ErrorHandler]', err)
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
  })
}

module.exports = errorHandler

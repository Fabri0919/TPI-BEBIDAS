const AppError = require('../errors/AppError')

/**
 * Factory: returns express middleware that validates req.body against a Joi schema.
 * Throws AppError('VALIDATION_ERROR', 400) with joi error details on failure.
 */
function validateBody(schema) {
  return function (req, res, next) {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }))
      throw new AppError('VALIDATION_ERROR', 400, details)
    }

    req.body = value
    next()
  }
}

module.exports = validateBody

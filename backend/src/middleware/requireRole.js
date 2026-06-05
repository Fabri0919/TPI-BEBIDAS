const AppError = require('../errors/AppError')

/**
 * Factory: returns express middleware that checks req.user.rol.
 * Must be used AFTER requireAuth.
 * @param {...string} rolesAllowed
 */
function requireRole(...rolesAllowed) {
  return function (req, res, next) {
    if (!req.user || !rolesAllowed.includes(req.user.rol)) {
      throw new AppError('FORBIDDEN', 403)
    }
    next()
  }
}

module.exports = requireRole

const jwt = require('../config/jwt')
const AppError = require('../errors/AppError')

/**
 * Verifies JWT from Authorization: Bearer <token>.
 * Attaches req.user = { id, rol } on success.
 * Throws AppError on missing/expired/invalid token.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    throw new AppError('TOKEN_REQUIRED', 401)
  }

  try {
    const payload = jwt.verify(token)
    req.user = { id: payload.id, rol: payload.rol }
    next()
  } catch (err) {
    throw new AppError('TOKEN_EXPIRED', 401)
  }
}

module.exports = requireAuth

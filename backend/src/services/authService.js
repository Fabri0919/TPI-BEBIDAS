const bcrypt = require('bcryptjs')
const { Usuario } = require('../models')
const jwt = require('../config/jwt')
const AppError = require('../errors/AppError')

/**
 * Register a new user. Role is always 'cliente' at registration time.
 * @param {{ nombre: string, email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
async function register({ nombre, email, password }) {
  // Check email uniqueness
  const existing = await Usuario.findOne({ where: { email } })
  if (existing) {
    throw new AppError('EMAIL_TAKEN', 409)
  }

  const password_hash = await bcrypt.hash(password, 10)

  const user = await Usuario.create({
    nombre,
    email,
    password_hash,
    rol: 'cliente',
    activo: true,
  })

  const token = jwt.sign({ id: user.id, rol: user.rol })

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
    token,
  }
}

/**
 * Login. Returns user + token on success.
 * Never reveals whether email exists (same 401 for any failure).
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
async function login({ email, password }) {
  // Find user by email (including inactive — so we can give a specific message after verifying password)
  const user = await Usuario.findOne({ where: { email } })

  // Use constant-time comparison even if user not found (prevents timing attacks)
  const dummyHash = '$2a$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  const passwordToCompare = user ? user.password_hash : dummyHash

  const passwordOk = await bcrypt.compare(password, passwordToCompare)

  if (!user || !passwordOk) {
    throw new AppError('INVALID_CREDENTIALS', 401)
  }

  // Check active AFTER password verification (per spec: masked as separate error)
  if (!user.activo) {
    throw new AppError('ACCOUNT_DISABLED', 401)
  }

  const token = jwt.sign({ id: user.id, rol: user.rol })

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
    token,
  }
}

/**
 * Get current user by ID (for /me endpoint).
 * @param {number} userId
 */
async function getMe(userId) {
  const user = await Usuario.findByPk(userId, {
    attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt'],
  })
  if (!user) {
    throw new AppError('NOT_FOUND', 404)
  }
  return user
}

module.exports = { register, login, getMe }

const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { Usuario } = require('../models')
const AppError = require('../errors/AppError')

/**
 * List all users (including inactive) with optional filters.
 * @param {{ activo?: boolean, rol?: string }} filters
 */
async function list(filters = {}) {
  const where = {}

  if (filters.activo !== undefined) {
    where.activo = filters.activo === 'true' || filters.activo === true
  }

  if (filters.rol) {
    where.rol = filters.rol
  }

  const users = await Usuario.findAll({
    where,
    attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt', 'updatedAt'],
    order: [['createdAt', 'DESC']],
    paranoid: false, // include soft-deleted records if any
  })

  return users
}

/**
 * Get a single user by ID.
 * @param {number} id
 */
async function getById(id) {
  const user = await Usuario.findByPk(id, {
    attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt', 'updatedAt'],
    paranoid: false,
  })

  if (!user) {
    throw new AppError('NOT_FOUND', 404)
  }

  return user
}

/**
 * Create a new user (super-admin action — can set any role).
 * @param {{ nombre: string, email: string, password: string, rol: string }} data
 */
async function create({ nombre, email, password, rol }) {
  const existing = await Usuario.findOne({ where: { email } })
  if (existing) {
    throw new AppError('EMAIL_TAKEN', 409)
  }

  const password_hash = await bcrypt.hash(password, 10)

  const user = await Usuario.create({
    nombre,
    email,
    password_hash,
    rol,
    activo: true,
  })

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo,
  }
}

/**
 * Update user fields (nombre, email, rol). Password change not in MVP.
 * @param {number} id
 * @param {{ nombre?: string, email?: string, rol?: string }} data
 */
async function update(id, data) {
  const user = await Usuario.findByPk(id, { paranoid: false })

  if (!user) {
    throw new AppError('NOT_FOUND', 404)
  }

  // Check email uniqueness if changing email
  if (data.email && data.email !== user.email) {
    const existing = await Usuario.findOne({
      where: { email: data.email, id: { [Op.ne]: id } },
    })
    if (existing) {
      throw new AppError('EMAIL_TAKEN', 409)
    }
  }

  await user.update(data)

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo,
  }
}

/**
 * Soft-deactivate a user (set activo = false).
 * Self-delete guard: throws if requesterId === targetId.
 * @param {number} requesterId
 * @param {number} targetId
 */
async function deactivate(requesterId, targetId) {
  if (Number(requesterId) === Number(targetId)) {
    throw new AppError('SELF_DELETE', 400)
  }

  const user = await Usuario.findByPk(targetId)

  if (!user) {
    throw new AppError('NOT_FOUND', 404)
  }

  await user.update({ activo: false })

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo,
  }
}

/**
 * Reactivate a previously deactivated user.
 * @param {number} id
 */
async function reactivate(id) {
  const user = await Usuario.findByPk(id, { paranoid: false })

  if (!user) {
    throw new AppError('NOT_FOUND', 404)
  }

  await user.update({ activo: true })

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo,
  }
}

module.exports = { list, getById, create, update, deactivate, reactivate }

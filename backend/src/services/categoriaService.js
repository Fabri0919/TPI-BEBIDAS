const { Op } = require('sequelize')
const { Categoria, Producto } = require('../models')
const AppError = require('../errors/AppError')

/**
 * List all active categories (public read).
 * @param {{ includeInactive?: boolean }} opts
 */
async function list(opts = {}) {
  const where = opts.includeInactive ? {} : { activo: true }

  return Categoria.findAll({
    where,
    order: [['nombre', 'ASC']],
  })
}

/**
 * Get a single category by ID.
 * @param {number} id
 */
async function getById(id) {
  const categoria = await Categoria.findByPk(id)

  if (!categoria) {
    throw new AppError('NOT_FOUND', 404)
  }

  return categoria
}

/**
 * Create a new category.
 * @param {{ nombre: string, slug: string, descripcion?: string }} data
 */
async function create({ nombre, slug, descripcion }) {
  // Check name uniqueness
  const existing = await Categoria.findOne({ where: { nombre } })
  if (existing) {
    throw new AppError('NOMBRE_TAKEN', 409)
  }

  // Check slug uniqueness
  const existingSlug = await Categoria.findOne({ where: { slug } })
  if (existingSlug) {
    throw new AppError('NOMBRE_TAKEN', 409)
  }

  const categoria = await Categoria.create({
    nombre,
    slug,
    descripcion: descripcion || null,
    activo: true,
  })

  return categoria
}

/**
 * Update a category.
 * @param {number} id
 * @param {{ nombre?: string, slug?: string, descripcion?: string }} data
 */
async function update(id, data) {
  const categoria = await Categoria.findByPk(id)

  if (!categoria) {
    throw new AppError('NOT_FOUND', 404)
  }

  // Check name uniqueness if changing nombre
  if (data.nombre && data.nombre !== categoria.nombre) {
    const existing = await Categoria.findOne({
      where: { nombre: data.nombre, id: { [Op.ne]: id } },
    })
    if (existing) {
      throw new AppError('NOMBRE_TAKEN', 409)
    }
  }

  // Check slug uniqueness if changing slug
  if (data.slug && data.slug !== categoria.slug) {
    const existing = await Categoria.findOne({
      where: { slug: data.slug, id: { [Op.ne]: id } },
    })
    if (existing) {
      throw new AppError('NOMBRE_TAKEN', 409)
    }
  }

  await categoria.update(data)
  return categoria
}

/**
 * Soft-deactivate a category.
 * Blocked if any active product references this category.
 * @param {number} id
 */
async function deactivate(id) {
  const categoria = await Categoria.findByPk(id)

  if (!categoria) {
    throw new AppError('NOT_FOUND', 404)
  }

  // Block if active products exist in this category
  const activeProductCount = await Producto.count({
    where: { categoria_id: id, activo: true },
  })

  if (activeProductCount > 0) {
    throw new AppError('CATEGORIA_HAS_PRODUCTS', 400, {
      active_products: activeProductCount,
    })
  }

  await categoria.update({ activo: false })
  return categoria
}

module.exports = { list, getById, create, update, deactivate }

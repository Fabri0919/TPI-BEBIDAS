const { Op } = require('sequelize')
const { Producto, Categoria } = require('../models')
const AppError = require('../errors/AppError')

/**
 * List products with optional filters.
 * For public (non-admin): only active products, no inactive.
 * @param {{
 *   categoria_id?: number,
 *   subcategoria?: string,
 *   q?: string,
 *   precioMin?: number,
 *   precioMax?: number,
 *   includeAgotados?: boolean,
 *   includeInactive?: boolean,
 *   page?: number,
 *   limit?: number,
 * }} filters
 */
async function list(filters = {}) {
  const where = {}

  // Inactive products only for admin
  if (!filters.includeInactive) {
    where.activo = true
  }

  // Hide out-of-stock unless toggle is on or admin
  if (!filters.includeAgotados && !filters.includeInactive) {
    where.stock = { [Op.gt]: 0 }
  }

  if (filters.categoria_id) {
    where.categoria_id = Number(filters.categoria_id)
  }

  if (filters.subcategoria) {
    where.subcategoria = filters.subcategoria
  }

  if (filters.q) {
    where.nombre = { [Op.like]: `%${filters.q}%` }
  }

  if (filters.precioMin || filters.precioMax) {
    where.precio_centavos = {}
    if (filters.precioMin) {
      where.precio_centavos[Op.gte] = Number(filters.precioMin)
    }
    if (filters.precioMax) {
      where.precio_centavos[Op.lte] = Number(filters.precioMax)
    }
  }

  const page = Math.max(1, parseInt(filters.page) || 1)
  const limit = Math.min(100, parseInt(filters.limit) || 24)
  const offset = (page - 1) * limit

  const { count, rows } = await Producto.findAndCountAll({
    where,
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'slug'] }],
    order: [['nombre', 'ASC']],
    limit,
    offset,
  })

  return {
    items: rows,
    total: count,
    page,
    limit,
  }
}

/**
 * Get a single product by ID.
 * @param {number} id
 * @param {{ includeInactive?: boolean }} opts
 */
async function getById(id, opts = {}) {
  const where = { id }
  if (!opts.includeInactive) {
    where.activo = true
  }

  const producto = await Producto.findOne({
    where,
    include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nombre', 'slug'] }],
  })

  if (!producto) {
    throw new AppError('NOT_FOUND', 404)
  }

  return producto
}

/**
 * Create a new product.
 * @param {{ nombre: string, volumen_ml: number, precio_centavos: number, stock: number, categoria_id: number, descripcion?: string, imagen_url?: string, subcategoria?: string }} data
 */
async function create(data) {
  // Validate category exists and is active
  const categoria = await Categoria.findOne({
    where: { id: data.categoria_id, activo: true },
  })

  if (!categoria) {
    throw new AppError('CATEGORIA_NOT_FOUND', 400)
  }

  const producto = await Producto.create({
    nombre: data.nombre,
    descripcion: data.descripcion || null,
    volumen_ml: data.volumen_ml,
    precio_centavos: data.precio_centavos,
    stock: data.stock,
    imagen_url: data.imagen_url || null,
    categoria_id: data.categoria_id,
    subcategoria: data.subcategoria || null,
    activo: true,
  })

  return getById(producto.id, { includeInactive: true })
}

/**
 * Update a product.
 * @param {number} id
 * @param {object} data
 */
async function update(id, data) {
  const producto = await Producto.findByPk(id)

  if (!producto) {
    throw new AppError('NOT_FOUND', 404)
  }

  // If changing category, validate it exists and is active
  if (data.categoria_id && data.categoria_id !== producto.categoria_id) {
    const categoria = await Categoria.findOne({
      where: { id: data.categoria_id, activo: true },
    })
    if (!categoria) {
      throw new AppError('CATEGORIA_NOT_FOUND', 400)
    }
  }

  await producto.update(data)
  return getById(producto.id, { includeInactive: true })
}

/**
 * Soft-deactivate a product (set activo = false).
 * @param {number} id
 */
async function deactivate(id) {
  const producto = await Producto.findByPk(id)

  if (!producto) {
    throw new AppError('NOT_FOUND', 404)
  }

  await producto.update({ activo: false })
  return producto
}

module.exports = { list, getById, create, update, deactivate }

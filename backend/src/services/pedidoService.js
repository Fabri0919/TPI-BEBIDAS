const { Op } = require('sequelize')
const { sequelize, Pedido, DetallePedido, Producto, Usuario } = require('../models')
const AppError = require('../errors/AppError')

// State machine: maps each state to its allowed next states
const TRANSITIONS = {
  pendiente_pago: ['confirmado', 'cancelado'],
  confirmado: ['enviado', 'cancelado'],
  enviado: ['entregado', 'cancelado'],
  entregado: [], // terminal
  cancelado: [], // terminal
}

/**
 * Create an order. Wraps everything in a transaction.
 * CRITICAL: Aggregates duplicate producto_id items before inserting.
 * @param {number} usuarioId
 * @param {{ items: Array<{producto_id: number, cantidad: number}>, direccion_entrega: object, notas?: string }} payload
 */
async function crearPedido(usuarioId, { items, direccion_entrega, notas }) {
  // Aggregate duplicate producto_id entries (sum cantidad)
  const aggregated = {}
  for (const item of items) {
    const key = String(item.producto_id)
    if (aggregated[key]) {
      aggregated[key].cantidad += item.cantidad
    } else {
      aggregated[key] = { producto_id: item.producto_id, cantidad: item.cantidad }
    }
  }
  const aggregatedItems = Object.values(aggregated)

  const result = await sequelize.transaction(async (t) => {
    let total_centavos = 0
    const detalles = []

    for (const item of aggregatedItems) {
      // Lock the product row for this transaction
      const producto = await Producto.findByPk(item.producto_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      })

      if (!producto || !producto.activo) {
        throw new AppError('NOT_FOUND', 404, {
          producto_id: item.producto_id,
          message: `Producto ${item.producto_id} no encontrado o inactivo`,
        })
      }

      if (producto.stock < item.cantidad) {
        throw new AppError('STOCK_INSUFFICIENT', 409, {
          producto_id: producto.id,
          nombre_producto: producto.nombre,
          disponible: producto.stock,
          solicitado: item.cantidad,
        })
      }

      const subtotal = producto.precio_centavos * item.cantidad
      total_centavos += subtotal

      detalles.push({
        producto_id: producto.id,
        cantidad: item.cantidad,
        precio_unitario_centavos: producto.precio_centavos,
        nombre_producto: producto.nombre,
      })
    }

    // Create the order
    const pedido = await Pedido.create(
      {
        usuario_id: usuarioId,
        estado: 'pendiente_pago',
        total_centavos,
        direccion_entrega,
        notas: notas || null,
      },
      { transaction: t }
    )

    // Create detail rows with snapshots
    const detalleRows = detalles.map((d) => ({
      pedido_id: pedido.id,
      producto_id: d.producto_id,
      cantidad: d.cantidad,
      precio_unitario_centavos: d.precio_unitario_centavos,
      nombre_producto: d.nombre_producto,
    }))

    await DetallePedido.bulkCreate(detalleRows, { transaction: t })

    // Decrement stock for each item
    for (const detalle of detalles) {
      await Producto.decrement('stock', {
        by: detalle.cantidad,
        where: { id: detalle.producto_id },
        transaction: t,
      })
    }

    return pedido
  })

  // Return the order with details
  return getById(result.id, result.usuario_id, 'cliente')
}

/**
 * Change order state. Enforces state machine and role restrictions.
 * @param {number} pedidoId
 * @param {string} nuevoEstado
 * @param {number} requesterId
 * @param {string} requesterRol
 */
async function cambiarEstado(pedidoId, nuevoEstado, requesterId, requesterRol) {
  // Load with details — needed for stock restore on cancellation
  const pedido = await Pedido.findByPk(pedidoId, {
    include: [{ model: DetallePedido, as: 'detalles' }],
  })

  if (!pedido) {
    throw new AppError('NOT_FOUND', 404)
  }

  const estadoActual = pedido.estado

  // Terminal state check
  if (TRANSITIONS[estadoActual].length === 0) {
    throw new AppError('INVALID_TRANSITION', 409, {
      from: estadoActual,
      to: nuevoEstado,
      message: `El pedido está en estado terminal: ${estadoActual}`,
    })
  }

  // Role-based restrictions
  if (requesterRol === 'cliente') {
    // Cliente can ONLY cancel their own order from pendiente_pago
    if (Number(pedido.usuario_id) !== Number(requesterId)) {
      throw new AppError('NOT_FOUND', 404) // hide existence
    }

    if (nuevoEstado !== 'cancelado') {
      throw new AppError('FORBIDDEN', 403)
    }

    if (estadoActual !== 'pendiente_pago') {
      throw new AppError('CANCEL_NOT_ALLOWED', 400, {
        estado_actual: estadoActual,
      })
    }
  }

  // Validate the transition is allowed by the state machine
  if (!TRANSITIONS[estadoActual].includes(nuevoEstado)) {
    throw new AppError('INVALID_TRANSITION', 409, {
      from: estadoActual,
      to: nuevoEstado,
      allowed: TRANSITIONS[estadoActual],
    })
  }

  // Cancellation: restore stock for each line item, then update estado.
  // Atomic transaction so partial failures roll back.
  // Skip details whose producto_id is null (product was hard-deleted) or whose
  // referenced product is soft-deleted (admin removed it, stock no longer applies).
  if (nuevoEstado === 'cancelado') {
    await sequelize.transaction(async (t) => {
      for (const detalle of pedido.detalles || []) {
        if (!detalle.producto_id) continue
        await Producto.increment('stock', {
          by: detalle.cantidad,
          where: { id: detalle.producto_id },
          transaction: t,
        })
      }
      await pedido.update({ estado: nuevoEstado }, { transaction: t })
    })
  } else {
    await pedido.update({ estado: nuevoEstado })
  }

  return pedido
}

/**
 * List orders. Clients see only their own. Admins see all with filters.
 * @param {number} requesterId
 * @param {string} requesterRol
 * @param {{ fecha_desde?: string, fecha_hasta?: string, email?: string, estado?: string, page?: number, limit?: number }} filters
 */
async function list(requesterId, requesterRol, filters = {}) {
  const where = {}

  if (requesterRol === 'cliente') {
    where.usuario_id = requesterId
  } else {
    // Admin filters
    if (filters.estado) {
      where.estado = filters.estado
    }

    if (filters.fecha_desde || filters.fecha_hasta) {
      where.createdAt = {}
      if (filters.fecha_desde) {
        where.createdAt[Op.gte] = new Date(filters.fecha_desde)
      }
      if (filters.fecha_hasta) {
        // Include the full end day
        const endDate = new Date(filters.fecha_hasta)
        endDate.setHours(23, 59, 59, 999)
        where.createdAt[Op.lte] = endDate
      }
    }
  }

  const page = Math.max(1, parseInt(filters.page) || 1)
  const limit = Math.min(100, parseInt(filters.limit) || 20)
  const offset = (page - 1) * limit

  // Build includes
  const include = [
    {
      model: Usuario,
      as: 'usuario',
      attributes: ['id', 'nombre', 'email'],
      ...(filters.email && requesterRol !== 'cliente'
        ? { where: { email: { [Op.like]: `%${filters.email}%` } } }
        : {}),
    },
    {
      model: DetallePedido,
      as: 'detalles',
      attributes: [
        'id',
        'producto_id',
        'cantidad',
        'precio_unitario_centavos',
        'nombre_producto',
      ],
    },
  ]

  const { count, rows } = await Pedido.findAndCountAll({
    where,
    include,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
    distinct: true,
  })

  return { items: rows, total: count, page, limit }
}

/**
 * Get a single order by ID. Clients can only see their own.
 * @param {number} pedidoId
 * @param {number} requesterId
 * @param {string} requesterRol
 */
async function getById(pedidoId, requesterId, requesterRol) {
  const pedido = await Pedido.findByPk(pedidoId, {
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email'],
      },
      {
        model: DetallePedido,
        as: 'detalles',
        attributes: [
          'id',
          'producto_id',
          'cantidad',
          'precio_unitario_centavos',
          'nombre_producto',
        ],
      },
    ],
  })

  if (!pedido) {
    throw new AppError('NOT_FOUND', 404)
  }

  // Clients can only see their own orders
  if (requesterRol === 'cliente' && Number(pedido.usuario_id) !== Number(requesterId)) {
    throw new AppError('NOT_FOUND', 404) // hide existence from other clients
  }

  return pedido
}

module.exports = { crearPedido, cambiarEstado, list, getById }

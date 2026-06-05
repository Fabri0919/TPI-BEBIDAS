const pedidoService = require('../services/pedidoService')

async function create(req, res) {
  const { items, direccion_entrega, notas } = req.body
  const pedido = await pedidoService.crearPedido(req.user.id, {
    items,
    direccion_entrega,
    notas,
  })
  res.status(201).json(pedido)
}

async function list(req, res) {
  const filters = {
    fecha_desde: req.query.fecha_desde,
    fecha_hasta: req.query.fecha_hasta,
    email: req.query.email,
    estado: req.query.estado,
    page: req.query.page,
    limit: req.query.limit,
  }

  const result = await pedidoService.list(req.user.id, req.user.rol, filters)
  res.status(200).json(result)
}

async function getById(req, res) {
  const pedido = await pedidoService.getById(
    Number(req.params.id),
    req.user.id,
    req.user.rol
  )
  res.status(200).json(pedido)
}

async function changeEstado(req, res) {
  const pedido = await pedidoService.cambiarEstado(
    Number(req.params.id),
    req.body.estado,
    req.user.id,
    req.user.rol
  )
  res.status(200).json(pedido)
}

module.exports = { create, list, getById, changeEstado }

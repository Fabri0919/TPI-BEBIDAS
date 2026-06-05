const productoService = require('../services/productoService')

async function list(req, res) {
  const isAdmin = req.user && (req.user.rol === 'admin' || req.user.rol === 'super-admin')

  const filters = {
    categoria_id: req.query.categoria_id,
    subcategoria: req.query.subcategoria,
    q: req.query.q,
    precioMin: req.query.precioMin,
    precioMax: req.query.precioMax,
    page: req.query.page,
    limit: req.query.limit,
    // Admin can toggle these; public cannot
    includeAgotados: isAdmin ? true : req.query.includeAgotados === 'true',
    includeInactive: isAdmin,
  }

  const result = await productoService.list(filters)
  res.status(200).json(result)
}

async function getById(req, res) {
  const isAdmin = req.user && (req.user.rol === 'admin' || req.user.rol === 'super-admin')
  const producto = await productoService.getById(Number(req.params.id), {
    includeInactive: isAdmin,
  })
  res.status(200).json(producto)
}

async function create(req, res) {
  const producto = await productoService.create(req.body)
  res.status(201).json(producto)
}

async function update(req, res) {
  const producto = await productoService.update(Number(req.params.id), req.body)
  res.status(200).json(producto)
}

async function deactivate(req, res) {
  await productoService.deactivate(Number(req.params.id))
  res.status(204).send()
}

module.exports = { list, getById, create, update, deactivate }

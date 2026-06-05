const categoriaService = require('../services/categoriaService')

async function list(req, res) {
  // Admin sees all (including inactive); public sees only active
  const isAdmin = req.user && (req.user.rol === 'admin' || req.user.rol === 'super-admin')
  const categorias = await categoriaService.list({ includeInactive: isAdmin })
  res.status(200).json(categorias)
}

async function getById(req, res) {
  const categoria = await categoriaService.getById(Number(req.params.id))
  res.status(200).json(categoria)
}

async function create(req, res) {
  const categoria = await categoriaService.create(req.body)
  res.status(201).json(categoria)
}

async function update(req, res) {
  const categoria = await categoriaService.update(Number(req.params.id), req.body)
  res.status(200).json(categoria)
}

async function deactivate(req, res) {
  await categoriaService.deactivate(Number(req.params.id))
  res.status(204).send()
}

module.exports = { list, getById, create, update, deactivate }

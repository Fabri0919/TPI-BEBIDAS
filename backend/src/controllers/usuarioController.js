const usuarioService = require('../services/usuarioService')

async function list(req, res) {
  const users = await usuarioService.list(req.query)
  res.status(200).json(users)
}

async function getById(req, res) {
  const user = await usuarioService.getById(Number(req.params.id))
  res.status(200).json(user)
}

async function create(req, res) {
  const user = await usuarioService.create(req.body)
  res.status(201).json(user)
}

async function update(req, res) {
  const user = await usuarioService.update(Number(req.params.id), req.body)
  res.status(200).json(user)
}

async function deactivate(req, res) {
  const user = await usuarioService.deactivate(req.user.id, Number(req.params.id))
  res.status(200).json(user)
}

async function reactivate(req, res) {
  const user = await usuarioService.reactivate(Number(req.params.id))
  res.status(200).json(user)
}

module.exports = { list, getById, create, update, deactivate, reactivate }

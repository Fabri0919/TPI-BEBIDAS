const authService = require('../services/authService')

async function register(req, res) {
  const { user, token } = await authService.register(req.body)
  res.status(201).json({ user, token })
}

async function login(req, res) {
  const { user, token } = await authService.login(req.body)
  res.status(200).json({ user, token })
}

async function me(req, res) {
  const user = await authService.getMe(req.user.id)
  res.status(200).json({ user })
}

module.exports = { register, login, me }

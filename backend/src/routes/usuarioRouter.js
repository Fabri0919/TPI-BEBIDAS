const { Router } = require('express')
const usuarioController = require('../controllers/usuarioController')
const requireAuth = require('../middleware/requireAuth')
const requireRole = require('../middleware/requireRole')
const validateBody = require('../middleware/validateBody')
const { createUsuarioSchema, updateUsuarioSchema } = require('../validators/usuarioSchema')

const router = Router()

// All routes require auth + super-admin role
router.use(requireAuth, requireRole('super-admin'))

// GET /api/usuarios
router.get('/', usuarioController.list)

// GET /api/usuarios/:id
router.get('/:id', usuarioController.getById)

// POST /api/usuarios
router.post('/', validateBody(createUsuarioSchema), usuarioController.create)

// PUT /api/usuarios/:id
router.put('/:id', validateBody(updateUsuarioSchema), usuarioController.update)

// DELETE /api/usuarios/:id — soft-deactivate
router.delete('/:id', usuarioController.deactivate)

// POST /api/usuarios/:id/reactivar
router.post('/:id/reactivar', usuarioController.reactivate)

module.exports = router

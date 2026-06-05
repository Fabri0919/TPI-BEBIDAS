const { Router } = require('express')
const categoriaController = require('../controllers/categoriaController')
const requireAuth = require('../middleware/requireAuth')
const requireRole = require('../middleware/requireRole')
const validateBody = require('../middleware/validateBody')
const { createCategoriaSchema, updateCategoriaSchema } = require('../validators/categoriaSchema')

const router = Router()

// GET /api/categorias — public (but admin gets inactive ones too via req.user)
router.get('/', (req, res, next) => {
  // Optionally attach user if token present (don't fail if absent)
  const authHeader = req.headers['authorization'] || ''
  if (authHeader.startsWith('Bearer ')) {
    const jwt = require('../config/jwt')
    try {
      const payload = jwt.verify(authHeader.slice(7))
      req.user = { id: payload.id, rol: payload.rol }
    } catch (_) {
      // ignore invalid token for public route
    }
  }
  next()
}, categoriaController.list)

// GET /api/categorias/:id — public
router.get('/:id', categoriaController.getById)

// POST /api/categorias — admin/super-admin only
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super-admin'),
  validateBody(createCategoriaSchema),
  categoriaController.create
)

// PUT /api/categorias/:id — admin/super-admin only
router.put(
  '/:id',
  requireAuth,
  requireRole('admin', 'super-admin'),
  validateBody(updateCategoriaSchema),
  categoriaController.update
)

// DELETE /api/categorias/:id — admin/super-admin only
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super-admin'),
  categoriaController.deactivate
)

module.exports = router

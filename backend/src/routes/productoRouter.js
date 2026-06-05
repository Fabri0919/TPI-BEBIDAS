const { Router } = require('express')
const productoController = require('../controllers/productoController')
const requireAuth = require('../middleware/requireAuth')
const requireRole = require('../middleware/requireRole')
const validateBody = require('../middleware/validateBody')
const { createProductoSchema, updateProductoSchema } = require('../validators/productoSchema')

const router = Router()

// Helper: optionally attach user from token (don't fail if absent)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || ''
  if (authHeader.startsWith('Bearer ')) {
    const jwt = require('../config/jwt')
    try {
      const payload = jwt.verify(authHeader.slice(7))
      req.user = { id: payload.id, rol: payload.rol }
    } catch (_) {
      // ignore
    }
  }
  next()
}

// GET /api/productos — public (admin sees inactive too)
router.get('/', optionalAuth, productoController.list)

// GET /api/productos/:id — public
router.get('/:id', optionalAuth, productoController.getById)

// POST /api/productos — admin/super-admin only
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super-admin'),
  validateBody(createProductoSchema),
  productoController.create
)

// PUT /api/productos/:id — admin/super-admin only
router.put(
  '/:id',
  requireAuth,
  requireRole('admin', 'super-admin'),
  validateBody(updateProductoSchema),
  productoController.update
)

// DELETE /api/productos/:id — admin/super-admin only
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super-admin'),
  productoController.deactivate
)

module.exports = router

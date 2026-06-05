const { Router } = require('express')
const pedidoController = require('../controllers/pedidoController')
const requireAuth = require('../middleware/requireAuth')
const validateBody = require('../middleware/validateBody')
const { createPedidoSchema, changeEstadoSchema } = require('../validators/pedidoSchema')

const router = Router()

// POST /api/pedidos — any authenticated user (service enforces role rules)
router.post('/', requireAuth, validateBody(createPedidoSchema), pedidoController.create)

// GET /api/pedidos — any authenticated user (service filters by role)
router.get('/', requireAuth, pedidoController.list)

// GET /api/pedidos/:id — any authenticated user (service checks ownership)
router.get('/:id', requireAuth, pedidoController.getById)

// PATCH /api/pedidos/:id/estado — any authenticated user (service enforces role rules)
router.patch(
  '/:id/estado',
  requireAuth,
  validateBody(changeEstadoSchema),
  pedidoController.changeEstado
)

module.exports = router

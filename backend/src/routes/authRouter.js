const { Router } = require('express')
const authController = require('../controllers/authController')
const validateBody = require('../middleware/validateBody')
const requireAuth = require('../middleware/requireAuth')
const { registerSchema, loginSchema } = require('../validators/authSchema')

const router = Router()

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), authController.register)

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), authController.login)

// GET /api/auth/me — requires valid token
router.get('/me', requireAuth, authController.me)

module.exports = router

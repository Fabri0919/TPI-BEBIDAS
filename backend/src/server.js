require('express-async-errors')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const env = require('./config/env')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors())
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRouter'))
app.use('/api/categorias', require('./routes/categoriaRouter'))
app.use('/api/productos', require('./routes/productoRouter'))
app.use('/api/pedidos', require('./routes/pedidoRouter'))
app.use('/api/usuarios', require('./routes/usuarioRouter'))

// Health-check (useful during dev)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Error handler (MUST be last) ─────────────────────────────────────────────
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────────────────────────
function listen() {
  app.listen(env.PORT, () => {
    console.log(`[server] Dealer's Drinks API running on port ${env.PORT}`)
  })
}

// Auto-start unless imported (for testing)
if (require.main === module) {
  listen()
}

module.exports = { app, listen }

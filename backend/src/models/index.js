const { sequelize } = require('../config/db')
const env = require('../config/env')

// ── Import models ─────────────────────────────────────────────────────────────
const Usuario = require('./Usuario')
const Categoria = require('./Categoria')
const Producto = require('./Producto')
const Pedido = require('./Pedido')
const DetallePedido = require('./DetallePedido')

// ── Associations ──────────────────────────────────────────────────────────────

// Categoria 1-N Producto
Categoria.hasMany(Producto, { foreignKey: 'categoria_id', as: 'productos' })
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' })

// Usuario 1-N Pedido
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id', as: 'pedidos' })
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' })

// Pedido N-N Producto through DetallePedido
Pedido.belongsToMany(Producto, {
  through: DetallePedido,
  foreignKey: 'pedido_id',
  otherKey: 'producto_id',
  as: 'productos',
})
Producto.belongsToMany(Pedido, {
  through: DetallePedido,
  foreignKey: 'producto_id',
  otherKey: 'pedido_id',
  as: 'pedidos',
})

// Direct access to detalles (for eager loading order details)
Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id', as: 'detalles' })
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' })
DetallePedido.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' })
Producto.hasMany(DetallePedido, { foreignKey: 'producto_id', as: 'detalles' })

// ── Sync (dev only) ───────────────────────────────────────────────────────────
// Sequelize + SQLite + { alter: true } enters infinite DROP/CREATE/INSERT loops
// on every boot. Use plain sync() — it only creates missing tables, never alters.
// To apply schema changes: delete data/dealers.sqlite and run `npm run seed`.
if (env.NODE_ENV !== 'production') {
  sequelize
    .sync()
    .then(() => {
      console.log('[models] SQLite synced')
    })
    .catch((err) => {
      console.error('[models] Sync error:', err)
    })
}

// ── Exports ───────────────────────────────────────────────────────────────────
module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Producto,
  Pedido,
  DetallePedido,
}

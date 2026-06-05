const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class DetallePedido extends Model {}

DetallePedido.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'pedidos', key: 'id' },
      onDelete: 'CASCADE',
    },
    // allowNull: true — preserves DetallePedido rows even when Producto is soft-deleted
    // per orders.md req.2 and spec SCN-ORD-07
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'productos', key: 'id' },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    precio_unitario_centavos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Snapshot: protects history if product is renamed or deleted
    nombre_producto: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'DetallePedido',
    tableName: 'detalles_pedido',
    paranoid: false,
    timestamps: true,
  }
)

module.exports = DetallePedido

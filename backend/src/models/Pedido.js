const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Pedido extends Model {}

Pedido.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
    },
    estado: {
      type: DataTypes.ENUM(
        'pendiente_pago',
        'confirmado',
        'enviado',
        'entregado',
        'cancelado'
      ),
      allowNull: false,
      defaultValue: 'pendiente_pago',
    },
    total_centavos: { type: DataTypes.INTEGER, allowNull: false },
    direccion_entrega: { type: DataTypes.JSON, allowNull: true },
    notas: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedidos',
    paranoid: false,
    timestamps: true,
  }
)

module.exports = Pedido

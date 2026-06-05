const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Producto extends Model {}

Producto.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(160), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    volumen_ml: { type: DataTypes.INTEGER, allowNull: false },
    precio_centavos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    imagen_url: { type: DataTypes.STRING(500), allowNull: true },
    subcategoria: {
      type: DataTypes.ENUM('Blend', 'Single Malt', 'American', 'Irish'),
      allowNull: true,
    },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categorias', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    paranoid: true,
    timestamps: true,
  }
)

module.exports = Producto

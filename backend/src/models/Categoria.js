const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')

class Categoria extends Model {}

Categoria.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    descripcion: { type: DataTypes.STRING(500), allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: 'Categoria',
    tableName: 'categorias',
    paranoid: true,
    timestamps: true,
  }
)

module.exports = Categoria

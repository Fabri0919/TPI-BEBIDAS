const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../config/db')
const bcrypt = require('bcryptjs')

class Usuario extends Model {
  /**
   * Compare a plain-text password against the stored hash.
   * @param {string} plain
   * @returns {Promise<boolean>}
   */
  comparePassword(plain) {
    return bcrypt.compare(plain, this.password_hash)
  }

  toJSON() {
    const values = super.toJSON()
    delete values.password_hash
    return values
  }
}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    rol: {
      type: DataTypes.ENUM('cliente', 'admin', 'super-admin'),
      allowNull: false,
      defaultValue: 'cliente',
    },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    paranoid: true,
    timestamps: true,
  }
)

// NOTE: password hashing lives in authService.register and seeders/seed.js.
// We do NOT hash in a beforeCreate hook because callers already pass
// `password_hash` (already-hashed). Hashing here too would double-hash and
// no password could ever match on login.

module.exports = Usuario

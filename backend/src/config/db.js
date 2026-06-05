const { Sequelize } = require('sequelize')
const env = require('./env')
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(env.DB_PATH),
  logging: env.NODE_ENV === 'development' ? console.log : false,
})

module.exports = { sequelize }

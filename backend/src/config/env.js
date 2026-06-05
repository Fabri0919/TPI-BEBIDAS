require('dotenv').config()

const env = Object.freeze({
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  DB_PATH: process.env.DB_PATH || './data/dealers.sqlite',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SEED_SUPER_ADMIN_EMAIL: process.env.SEED_SUPER_ADMIN_EMAIL || 'super-admin@dealers.local',
  SEED_SUPER_ADMIN_PASSWORD: process.env.SEED_SUPER_ADMIN_PASSWORD || 'Demo1234!',
})

module.exports = env

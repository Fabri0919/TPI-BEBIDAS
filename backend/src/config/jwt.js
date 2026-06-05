const jsonwebtoken = require('jsonwebtoken')
const env = require('./env')

function sign(payload) {
  return jsonwebtoken.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })
}

function verify(token) {
  return jsonwebtoken.verify(token, env.JWT_SECRET)
}

module.exports = { sign, verify }

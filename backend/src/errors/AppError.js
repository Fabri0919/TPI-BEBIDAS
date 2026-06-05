class AppError extends Error {
  /**
   * @param {string} code    - Machine-readable error code (e.g. 'VALIDATION_ERROR')
   * @param {number} statusCode - HTTP status (400, 401, 403, 404, 409, 500)
   * @param {*} [details]    - Optional extra context (joi errors, stock info, etc.)
   */
  constructor(code, statusCode, details) {
    super(code)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode || 500
    this.details = details || null
  }
}

module.exports = AppError

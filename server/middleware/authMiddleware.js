const jwt = require('jsonwebtoken')
const config = require('config')
const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return next(ApiError.unauthorized('Auth token is necessary'))
    }
    const decodedId = jwt.verify(token, config.get("secretKey"))
    req.decodedId = decodedId.id
    next()
  } catch (e) {
    return next(ApiError.unauthorized('Auth token is necessary'))
  }
}
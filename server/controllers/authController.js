const User = require('../models/user')
const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const ApiError = require('../error/ApiError')

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(JSON.stringify(errors.array({onlyFirstError: true})[0].msg)))
      }

      const {email, password, name} = req.body

      const candidate = await User.findOne({email})
      if (candidate) {
        return next(ApiError.badRequest(`Email with ${email} already exist`))
      }

      const hashPassword = await bcrypt.hash(password, 7)
      const user = new User({email, password: hashPassword, name})
      await user.save()

      const createdUser = await User.findOne({email})
      const token = jwt.sign({id: createdUser.id}, config.get("secretKey"), {expiresIn: config.get("tokenDuration")})

      return res.json({message: 'User was created successfully', data: {token, _id: createdUser.id, email: createdUser.email, name: createdUser.name}})

    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body

      const user = await User.findOne({email})
      if (!user) {
        return next(ApiError.badRequest(`Incorrect email`))
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password)
      if (!isPasswordValid) {
        return next(ApiError.badRequest(`Incorrect password`))
      }

      const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: config.get("tokenDuration")})
      return res.json({data: {token, _id: user.id, email: user.email, name: user.name}})

    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }

  async getAllUsers(req, res, next) {
    try {
      let allUsers = await User.find({})

      allUsers = allUsers.map(user => {
        return {_id: user._id, email: user.email, name: user.name}
      })

      return res.json({data: allUsers})

    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }
}

module.exports = new AuthController()
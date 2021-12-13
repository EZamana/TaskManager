const Router = require('express');
const User = require('../models/user')
const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const router = new Router()

router.post('/registration', [
  check('email', 'Incorrect email').isEmail(),
  check('password', 'Password should be longer than 3 and shorter than 12').isLength({min: 3, max: 12}),
  check ('name', 'Name should be longer than 1').isLength({min: 1})
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {email, password, name} = req.body

    req.header = {}

    const candidate = await User.findOne({email})
    if (candidate) {
      return res.status(400).json({message: `Email with ${email} already exist`})
    }

    const hashPassword = await bcrypt.hash(password, 7)
    const user = new User({email, password: hashPassword, name})
    await user.save()

    const createdUser = await User.findOne({email})
    const token = jwt.sign({id: createdUser.id}, config.get("secretKey"), {expiresIn: '1d'})

    return res.json({message: 'User was created successfully', data: {token, _id: createdUser.id, email: createdUser.email, name: createdUser.name}})

  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Server error'})
  }
})

router.post('/login',async (req, res) => {
  try {
    const {email, password} = req.body

    const user = await User.findOne({email})
    if (!user) {
      return res.status(400).json({message: `Incorrect email`})
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({message: 'Incorrect password'})
    }

    const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: '1d'})
    return res.json({data: {token, _id: user.id, email: user.email, name: user.name}})

  } catch (e) {
    console.log(e)
    res.send({message: 'Server error'})
  }
})

router.get('/getAllUsers', async (req, res) => {
  try {
    let allUsers = await User.find({})

    allUsers = allUsers.map(user => {
      return {_id: user._id, email: user.email, name: user.name}
    })

    return res.json({data: allUsers})

  } catch (e) {
    console.log(e)
    res.status(500).json('Server error')
  }
})

module.exports = router
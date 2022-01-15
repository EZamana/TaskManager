const Router = require('express');
const {check} = require('express-validator')
const router = new Router()
const authController = require('../controllers/authController')

router.post('/registration', [
  check('email', 'Incorrect email').isEmail(),
  check('password', 'Password should be longer than 3 and shorter than 12').isLength({min: 3, max: 12}),
  check ('name', 'Name should be longer than 1').isLength({min: 1})
], authController.registration)

router.post('/login', authController.login)

router.get('/getAllUsers', authController.getAllUsers)

module.exports = router
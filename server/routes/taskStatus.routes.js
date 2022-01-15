const Router = require('express');
const {check} = require('express-validator')
const router = new Router()
const taskStatusController = require('../controllers/taskStatusController')

router.post('/createTaskStatus', [
  check ('title', 'Title should be at least 1 character long').isLength({min: 1}),
], taskStatusController.createTaskStatus)

router.get('/getAllTaskStatuses', taskStatusController.getAllTaskStatuses)

module.exports = router
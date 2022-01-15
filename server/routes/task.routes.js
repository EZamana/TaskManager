const Router = require('express');
const {check} = require('express-validator')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const taskController = require('../controllers/taskController')

router.post('/createTask', [
  authMiddleware,
  check('title', 'Title should be at least 1 character long').isLength({min: 1}),
  check('description', 'Description should be at least 1 character long').isLength({min: 1}),
  check('assigneeId', 'Incorrect assignee format').isLength({min: 24, max: 24})
], taskController.createTask)

router.put('/updateTask', [
  authMiddleware,
  check('taskId', "Incorrect task id format").isLength({min: 24, max: 24}),
  check('statusId', "Incorrect status id format").isLength({min: 24, max: 24}).optional(),
  check('assigneeId', "Incorrect assignee id format").isLength({min: 24, max: 24}).optional()
], taskController.updateTask)

router.delete('/deleteTask', [
  authMiddleware,
  check('taskId', "Task id should be 24 characters long").isLength({min: 24, max: 24})], taskController.deleteTask)

router.get('/getAllTasks', taskController.getAllTasks)

module.exports = router
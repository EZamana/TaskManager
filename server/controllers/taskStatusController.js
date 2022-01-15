const TaskStatus = require('../models/taskStatus')
const {validationResult} = require('express-validator')
const ApiError = require('../error/ApiError')

class TaskStatusController {
  async createTaskStatus(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
      }

      const {title, priority} = req.body

      const taskStatus = new TaskStatus({title, priority})

      await taskStatus.save()

      return res.json({message: "Status created", taskStatus})

    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }

  async getAllTaskStatuses(req, res, next) {
    try {
      const allTaskStatus = await TaskStatus.find({})

      return res.json({data: allTaskStatus})

    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }
}

module.exports = new TaskStatusController()
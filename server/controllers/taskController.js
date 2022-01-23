const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus')
const {validationResult} = require('express-validator')
const ApiError = require('../error/ApiError')

class TaskController {
  async createTask(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(JSON.stringify(errors.array({onlyFirstError: true})[0].msg)))
      }

      const {title, description, assigneeId} = req.body

      const creator = await User.findOne({_id: req.decodedId})

      if (!creator) {
        return next(ApiError.badRequest('Creator id is not exist'))
      }

      const assignee = await User.findOne({_id: assigneeId})

      if (!assignee) {
        return next(ApiError.badRequest('Assignee id is not exist'))
      }

      const allTaskStatuses = await TaskStatus.find({})

      if (allTaskStatuses.length === 0) {
        return next(ApiError.badRequest('Array with statuses is empty'))
      }

      const tasksPriorities = allTaskStatuses.map(status => status.priority)

      let taskStatus;

      allTaskStatuses.forEach(status => {
        if (Math.min(...tasksPriorities) === status.priority) {
          taskStatus = status
        }
      })

      const task = new Task({
        title,
        description,
        status_id: taskStatus._id,
        creator_id: req.decodedId,
        assignee_id: assigneeId
      })

      await task.save()

      return res.json({
        message: "Task created",
        data: {
          _id: task._id,
          title: task.title,
          description: task.description,
          status: taskStatus,
          creator: {_id: creator._id, email: creator.email, name: creator.name},
          assignee: {_id: assignee._id, email: assignee.email, name: assignee.name}
        }
      })
    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }

  async updateTask(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(JSON.stringify(errors.array({onlyFirstError: true})[0].msg)))
      }

      const {taskId, title, description, statusId, assigneeId} = req.body

      const task = await Task.findOne({_id: taskId})

      if (!task) {
        return next(ApiError.badRequest('Task id is not exist'))
      }

      let taskStatus;

      if (statusId) {
        taskStatus = await TaskStatus.findOne({_id: statusId})

        if (!taskStatus) {
          return next(ApiError.badRequest('Status id is not exist'))
        }
      }

      let assignee;

      if (assigneeId) {
        assignee = await User.findOne({_id: assigneeId})

        if (!assignee) {
          return next(ApiError.badRequest('Assignee id is is not exist'))
        }
      }

      if (task.creator_id === req.decodedId || task.assignee_id === req.decodedId) {
        const updatedTask = await Task.findOneAndUpdate({_id: taskId}, {
          title,
          description,
          status_id: statusId,
          assignee_id: assigneeId
        }, {omitUndefined: true, new: true})

        if (!updatedTask) {
          return next(ApiError.badRequest('Updated task not found'))
        }

        let taskCreator = await User.findOne({_id: updatedTask.creator_id})

        if (!statusId) {
          taskStatus = await TaskStatus.findOne({_id: updatedTask.status_id})
        }

        if (!assigneeId) {
          assignee = await User.findOne({_id: updatedTask.assignee_id})
        }

        return res.json({
          message: "Task updated",
          data: {
            _id: updatedTask._id,
            title: updatedTask.title,
            description: updatedTask.description,
            status: taskStatus ? taskStatus : null,
            creator: taskCreator ? {_id: taskCreator._id, email: taskCreator.email, name: taskCreator.name} : null,
            assignee: assignee ? {_id: assignee._id, email: assignee.email, name: assignee.name} : null
          }
        })

      } else {
        return next(ApiError.noPermission('No permission to update task'))
      }
    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }

  async deleteTask(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(JSON.stringify(errors.array({onlyFirstError: true})[0].msg)))
      }

      const {taskId} = req.body

      const task = await Task.findOne({_id: taskId})

      if (!task) {
        return next(ApiError.badRequest('Task id is not exist'))
      }

      if (task.creator_id === req.decodedId || task.assignee_id === req.decodedId) {
        await Task.deleteOne({_id: taskId})

        return res.json({message: "Task deleted"})

      } else {
        return next(ApiError.badRequest('No permission to delete task'))
      }
    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }

  async getAllTasks(req, res, next) {
    try {
      const allTasks = await Task.find({})
      const allUsers = await User.find({})
      const allStatuses = await TaskStatus.find({})

      const tasksForResponse = allTasks.map((task) => {
        let status = allStatuses.find(status => (status._id).toString() === task.status_id)
        let creator = allUsers.find(user => (user._id).toString() === task.creator_id)
        let assignee = allUsers.find(user => (user._id).toString() === task.assignee_id)

        return {
          _id: task._id,
          title: task.title,
          description: task.description,
          status: status ? status : null,
          creator: creator ? {_id: creator._id, email: creator.email, name: creator.name} : null,
          assignee: assignee ? {_id: assignee._id, email: assignee.email, name: assignee.name} : null
        }
      })

      return res.json({data: tasksForResponse})

    } catch (e) {
      console.log(e)
      if (e.name === 'CastError') {
        return next(ApiError.badRequest('Invalid data'))
      }
      next(ApiError.internal('Server error'))
    }
  }
}

module.exports = new TaskController()
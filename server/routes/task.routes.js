const Router = require('express');
const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus')
const {check, validationResult} = require('express-validator')
const router = new Router()
const ApiError = require('../error/ApiError')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/createTask', [
  authMiddleware,
  check('title', 'Title should be at least 1 character long').isLength({min: 1}),
  check('description', 'Description should be at least 1 character long').isLength({min: 1}),
  check('assigneeId', 'Incorrect assignee format').isLength({min: 24, max: 24})
], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest(JSON.stringify(errors.array({onlyFirstError: true})[0].msg)))
    }

    const {title, description, assigneeId} = req.body

    await User.findOne({_id: req.decodedId}, null, null, function (err, result) {
      if (err) {
        return next(ApiError.badRequest(err['message']))
      }
      if (!result) {
        return next(ApiError.badRequest('Creator id is not exist'))
      }
    })

    if (res.headersSent) {
      return
    }

    await User.findOne({_id: assigneeId}, null, null, function (err, result) {
      if (err) {
        return next(ApiError.badRequest(err['message']))
      }
      if (!result) {
        return next(ApiError.badRequest('Assignee id is not exist'))
      }
    })

    if (res.headersSent) {
      return
    }

    const allTaskStatuses = await TaskStatus.find({}, null, null, function (err, result) {
      if (err) {
        return next(ApiError.badRequest(err['message']))
      }
      if (result.length === 0) {
        return next(ApiError.badRequest('Array with statuses is empty'))
      }
    })

    const tasksPriorities = allTaskStatuses.map(status => status.priority)

    let taskStatusId;

    allTaskStatuses.forEach(status => {
      if (Math.min(...tasksPriorities) === status.priority) {
        taskStatusId = status._id
      }
    })

    const task = new Task({
      title,
      description,
      status_id: taskStatusId,
      creator_id: req.decodedId,
      assignee_id: assigneeId
    })

    await task.save()

    return res.json({message: "Task created", data: task})

  } catch (e) {
    console.log(e)
    next(ApiError.internal('Server error'))
  }
})

router.put('/updateTask', [
  authMiddleware,
  check('taskId', "Incorrect taskId format").isLength({min: 24, max: 24})], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest(JSON.stringify(errors.array({onlyFirstError: true})[0].msg)))
    }

    const {taskId, title, description, statusId, assigneeId} = req.body

    if (statusId) {
      await TaskStatus.findOne({_id: statusId}, null, null, function (err, result) {
        if (err) {
          return next(ApiError.badRequest(err['message']))
        }
        if (!result) {
          return next(ApiError.badRequest('Status id is not exist'))
        }
      })
    }

    if (res.headersSent) {
      return
    }

    await User.findOne({_id: req.decodedId}, null, null, function (err, result) {
      if (err) {
        return next(ApiError.badRequest(err['message']))
      }
      if (!result) {
        return next(ApiError.badRequest('Creator id is not exist'))
      }
    })

    if (res.headersSent) {
      return
    }

    if (assigneeId) {
      await User.findOne({_id: assigneeId}, null, null, function (err, result) {
        if (err) {
          return next(ApiError.badRequest(err['message']))
        }
        if (!result) {
          return next(ApiError.badRequest('Assignee id is is not exist'))

        }
      })
    }

    if (res.headersSent) {
      return
    }

    const task = await Task.findOne({_id: taskId}, null, null, function (err, result) {
      if (err) {
        return next(ApiError.badRequest(err['message']))
      }
      if (!result) {
        return next(ApiError.badRequest('Task id is not exist'))
      }
    })

    if (res.headersSent) {
      return
    }

    if (task.creator_id === req.decodedId || task.assignee_id === req.decodedId) {
      await Task.updateOne({_id: taskId}, {
        title,
        description,
        status_id: statusId,
        assignee_id: assigneeId
      }, {omitUndefined: true}, function (err) {
        if (err) {
          return next(ApiError.badRequest(err['message']))
        }
      })

      const updatedTask = await Task.findOne({_id: taskId}, null, null, function (err, result) {
        if (err) {
          return next(ApiError.badRequest(err['message']))
        }
      })

      return res.json({message: "Task updated", data: updatedTask})

    } else {
      return next(ApiError.badRequest('No permission to update task'))
    }
  } catch (e) {
    console.log(e)
    next(ApiError.internal('Server error'))
  }
})

router.delete('/deleteTask', [
  authMiddleware,
  check('taskId', "Task id should be 24 characters long").isLength({min: 24, max: 24})], async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.badRequest(JSON.stringify(errors.array({onlyFirstError: true})[0].msg)))
    }

    const {taskId} = req.body

    const task = await Task.findOne({_id: taskId}, null, null, function (err, result) {
      if (err) {
        return next(ApiError.badRequest(err['message']))
      }
      if (!result) {
        return next(ApiError.badRequest('Task id is not exist'))
      }
    })

    if (res.headersSent) {
      return
    }

    if (task.creator_id === req.decodedId || task.assignee_id === req.decodedId) {
      await Task.deleteOne({_id: taskId})

      return res.json({message: "Task deleted"})

    } else {
      return next(ApiError.badRequest('No permission to delete task'))
    }
  } catch (e) {
    console.log(e)
    next(ApiError.internal('Server error'))
  }
})

router.get('/getAllTasks', async (req, res, next) => {
  try {
    const allTasks = await Task.find({})

    return res.json({data: allTasks})

  } catch (e) {
    console.log(e)
    next(ApiError.internal('Server error'))
  }
})

module.exports = router
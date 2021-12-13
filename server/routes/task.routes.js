const Router = require('express');
const User = require('../models/user')
const Task = require('../models/task')
const TaskStatus = require('../models/taskStatus')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const router = new Router()

router.post('/createTask', [
    check ('title', 'Title should be at least 1 character long').isLength({min: 1}),
    check ('description', 'Description should be at least 1 character long').isLength({min: 1}),
    check ('assigneeId', 'Incorrect assignee format').isLength({min: 24, max: 24})
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {title, description, assigneeId} = req.body

    const authHeader = req.headers.authorization

    let decodedId;

    if (authHeader) {

      if (authHeader.split(' ')[0] === 'Bearer') {
        let jwtVerification = jwt.verify(authHeader.split(' ')[1], config.get("secretKey"), function (err, decoded) {
        if (err) {
          return res.status(401).json({message: err.message})
        }

        decodedId = decoded.id
      })

      } else  {
        return res.status(401).json({message: 'Auth token is necessary'})
      }

    } else {
      return res.status(401).json({message: 'Auth token is necessary'})
    }

    if (res.headersSent) {
      return
    }

    const creatorUser = await User.findOne({_id: decodedId}, null, null, function (err,result) {
      if (err) {
        return res.status(400).json({message: err['message']})
      }
      if (!result) {
        return res.status(400).json({message: 'Creator id is not exist'})
      }
    })

    if (res.headersSent) {
      return
    }

    const assigneeUser = await User.findOne({_id: assigneeId},  null, null, function (err, result) {
      if (err) {
        return res.status(400).json({message: err['message']})
      }
      if (!result) {
        res.status(400).json({message: 'Assignee id is not exist'})
      }
    })

    if (res.headersSent) {
      return
    }

    const allTaskStatuses = await TaskStatus.find({}, null, null, function (err, result) {
      if (err) {
        return res.status(400).json({message: err['message']})
      }
      if (result.length === 0) {
        return res.status(400).json({message: 'Array with statuses is empty'})
      }
    })

    const tasksPriorities = allTaskStatuses.map(status => status.priority)

    let taskStatusId

    allTaskStatuses.forEach(status => {
      if (Math.min(...tasksPriorities) === status.priority) {
        taskStatusId = status._id
      }
    })

    const task = new Task({title, description, status_id: taskStatusId, creator_id: decodedId, assignee_id: assigneeId})

    await task.save()

    return res.json({message: "Task created", data: task})

  } catch (e) {
    console.log(e)
    res.status(500).json('Server error')
  }
})

router.put('/updateTask', [
    check('taskId', "Incorrect taskId format").isLength({min: 24, max: 24})], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {taskId, title, description, statusId, assigneeId} = req.body

    const authHeader = req.headers.authorization

    let decodedId;

    if (authHeader) {

      if (authHeader.split(' ')[0] === 'Bearer') {

        jwt.verify(authHeader.split(' ')[1], config.get("secretKey"), function (err, decoded) {
          if (err) {
            return res.status(401).json({message: err.message})
          }

          decodedId = decoded.id
        })

      } else  {
        return res.status(401).json({message: 'Auth token is necessary'})
      }

    } else {
      return res.status(401).json({message: 'Auth token is necessary'})
    }

    if (res.headersSent) {
      return
    }

    if (statusId) {
      const taskStatuses = await TaskStatus.findOne({_id: statusId}, null, null, function (err, result) {
        if (err) {
          return res.status(400).json({message: err['message']})
        }
        if (!result) {
          return res.status(400).json({message: 'Status id is not exist'})
        }
      })
    }

    if (res.headersSent) {
      return
    }

    const currentUser = await User.findOne({_id: decodedId}, null, null, function (err,result) {
      if (err) {
        return res.status(400).json({message: err['message']})
      }
      if (!result) {
        return res.status(400).json({message: 'Creator id is not exist'})
      }
    })

    if (res.headersSent) {
      return
    }

    if (assigneeId) {
      const assigneeUser = await User.findOne({_id: assigneeId},  null, null, function (err, result) {
        if (err) {
          return res.status(400).json({message: err['message']})
        }
        if (!result) {
          return res.status(400).json({message: 'Assignee id is is not exist'})
        }
      })
    }

    if (res.headersSent) {
      return
    }

    const task = await Task.findOne({_id: taskId}, null, null, function (err, result) {
      if (err) {
        return res.status(400).json({message: err['message']})
      }
      if (!result) {
        return res.status(400).json({message: 'Task id is not exist'})
      }
    })

    if (res.headersSent) {
      return
    }

    if (task.creator_id === decodedId || task.assignee_id === decodedId) {
      const taskUpdate = await Task.updateOne({_id: taskId}, {title, description, status_id: statusId, assignee_id: assigneeId}, {omitUndefined: true}, function (err) {
        if (err) {
          return res.status(400).json({message: err['message']})
        }
      })

      const updatedTask = await Task.findOne({_id: taskId}, null, null, function (err, result) {
        if (err) {
          return res.status(400).json({message: err['message']})
        }
      })

      return res.json({message: "Task updated", data: updatedTask})

    } else {
      return res.status(400).json({message: `No permission to update task`})
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Server error'})
  }
})

router.delete('/deleteTask', [
  check('taskId', "Task id should be 24 characters long").isLength({min: 24, max: 24})],async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {taskId} = req.body

    const authHeader = req.headers.authorization

    let decodedId;

    if (authHeader) {

      if (authHeader.split(' ')[0] === 'Bearer') {

        jwt.verify(authHeader.split(' ')[1], config.get("secretKey"), function (err, decoded) {
          if (err) {
            return res.status(401).json({message: err.message})
          }

          decodedId = decoded.id
        })

      } else  {
        return res.status(401).json({message: 'Auth token is necessary'})
      }

    } else {
      return res.status(401).json({message: 'Auth token is necessary'})
    }

    if (res.headersSent) {
      return
    }

    const task = await Task.findOne({_id: taskId}, null, null, function (err, result) {
      if (err) {
        return res.status(400).json({message: err['message']})
      }
      if (!result) {
        return res.status(400).json({message: 'Task id is not exist'})
      }
    })

    if (res.headersSent) {
      return
    }

    if (task.creator_id === decodedId || task.assignee_id === decodedId) {
      const taskDelete = await Task.deleteOne({_id: taskId})

      return res.json({message: "Task deleted"})

    } else {
      return res.status(400).json({message: `No permission to delete task`})
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Server error'})
  }
})

router.get('/getAllTasks', async (req, res) => {
  try {
    const allTasks = await Task.find({})

    return res.json({data: allTasks})

  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Server error'})
  }
})

module.exports = router
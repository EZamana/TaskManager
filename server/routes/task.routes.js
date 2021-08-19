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
    check ('description', 'Description should be at least 1 character long').isLength({min: 1})
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {title, description, token} = req.body

    let decodedId;

    jwt.verify(token, config.get("secretKey"), function (err, decoded) {
      if (err) {
        return res.status(400).json({message: err.message})
      }

      decodedId = decoded.id
    })

    const user = await User.findOne({_id: decodedId})

    const allTaskStatuses = await TaskStatus.find({})

    let tasksPriorities = []
    allTaskStatuses.forEach(status => {
      tasksPriorities.push(status.priority)
    })

    let taskStatus;

    allTaskStatuses.forEach(status => {
      if (Math.min(...tasksPriorities) === status.priority) {
        taskStatus = status
      }
    })

    const task = new Task({title, description, status: taskStatus, created_by: {id: user.id, email: user.email, name: user.name}})

    await task.save()

    return res.json({message: "Task created", data: task})

  } catch (e) {
    console.log(e)
    res.status(500).json('Server error')
  }
})

router.put('/updateTask', [
    check('taskId', "Task id should be 24 characters long").isLength({min: 24, max: 24})], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {taskId, title, description, status, token} = req.body

    let decodedId;

    jwt.verify(token, config.get("secretKey"), function (err, decoded) {
      if (err) {
        return res.status(400).json({message: err.message})
      }

      decodedId = decoded.id
    })

    let task = await Task.findOne({_id: taskId})

    if (!task) {
      return res.status(400).json({message: `Incorrect task id`})
    }

    if (task.created_by.id === decodedId) {
      const taskUpdate = await Task.updateOne({_id: task.id}, {title, description, status}, {omitUndefined: true}, function (err) {
        if (err) {
          return res.status(400).json({message: err['message']})
        }
      })

      return res.json({message: "Task updated"})

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

    const {taskId, token} = req.body

    let decodedId;

    jwt.verify(token, config.get("secretKey"), function (err, decoded) {
      if (err) {
        return res.status(400).json({message: err.message})
      }

      decodedId = decoded.id
    })

    let task = await Task.findOne({_id: taskId})

    if (!task) {
      return res.status(400).json({message: `Incorrect task id`})
    }

    if (task.created_by.id === decodedId) {
      const taskDelete = await Task.deleteOne({_id: task.id})

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

    return res.json({tasks: allTasks})

  } catch (e) {
    console.log(e)
    res.status(500).json({message: 'Server error'})
  }
})

module.exports = router
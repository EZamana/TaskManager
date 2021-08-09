const Router = require('express');
const User = require('../models/user')
const Task = require('../models/task')
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

    const {title, description, status, token} = req.body

    let decodedId;

    jwt.verify(token, config.get("secretKey"), function (err, decoded) {
      if (err) {
        return res.status(400).json({message: err.message})
      }

      decodedId = decoded.id
    })

    const user = await User.findOne({_id: decodedId})

    const task = new Task({title, description, status, created_by: {id: user.id, email: user.email, name: user.name}})

    await task.save()

    return res.json({message: "Task created", task: task})

  } catch (e) {
    console.log(e)
    res.status(500).json('Server error')
  }
})

router.put('/updateTask', [
    check('taskId', "Task id should be 24 characters long").isLength({min: 24, max: 24})],async (req, res) => {
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
      const taskUpdate = await Task.updateOne({_id: task.id}, {title, description, status}, {omitUndefined: true})

      return res.json({message: "Task updated"})

    } else {
      return res.status(400).json({message: `No permission to update task`})
    }
  } catch (e) {
    console.log(e)
    res.status(500).json('Server error')
  }
})

module.exports = router
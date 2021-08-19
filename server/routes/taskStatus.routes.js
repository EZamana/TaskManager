const Router = require('express');
const TaskStatus = require('../models/taskStatus')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const router = new Router()

/*router.post('/createTaskStatus', [
  check ('title', 'Title should be at least 1 character long').isLength({min: 1}),
], async (req, res) => {
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
    res.status(500).json('Server error')
  }
})*/

router.get('/getAllTaskStatuses', async (req, res) => {
  try {
    const allTaskStatus = await TaskStatus.find({})

    return res.json({data: allTaskStatus})

  } catch (e) {
    console.log(e)
    res.status(500).json('Server error')
  }
})


module.exports = router
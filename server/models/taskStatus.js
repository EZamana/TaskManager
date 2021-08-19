const {Schema, model} = require('mongoose')

const TaskStatus = new Schema({
  title: {type: String, required: true},
  priority: {type: Number, required: true}
})


module.exports = model('TaskStatus', TaskStatus)
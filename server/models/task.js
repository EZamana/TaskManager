const {Schema, model} = require('mongoose')

const Task = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  status_id: {type: String, ref: 'TaskStatus', required: true},
  creator_id: {type: String, ref: 'User', required: true},
  assignee_id: {type: String, ref: 'User', required: true}
})


module.exports = model('Task', Task)
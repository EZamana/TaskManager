const {Schema, model} = require('mongoose')

const Task = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  status: {type: Schema.Types.ObjectId, ref: 'TaskStatus', required: true},
  created_by: {type: Object, required: true}
})


module.exports = model('Task', Task)
const express = require('express')
const mongoose= require('mongoose')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const taskRouter = require('./routes/task.routes')
const taskStatusRouter = require('./routes/taskStatus.routes')
const cors = require('cors')
const app = express()
const PORT = config.get('serverPort')
const errorHandler = require('./middleware/errorHandlingMiddleware')

app.use(cors({origin: '*'}));

app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/task", taskRouter)
app.use("/api/taskStatus", taskStatusRouter)

app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'))

    app.listen(PORT, ()=> {
      console.log('server started on', PORT)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
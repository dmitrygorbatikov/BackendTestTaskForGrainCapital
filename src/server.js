require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const createSocketServer = require("./socket")
const app = express()
const server = createServer(app)
const cors = require('cors')
const cookieParser = require('cookie-parser')
const PORT = process.env.SERVER_PORT ?? 5000

createSocketServer(server)

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api', require('./routes/auth.routes'))
app.use('/api/users', require('./routes/user.routes'))
app.use('/api/topics', require('./routes/topic.routes'))
app.use('/api/departments', require('./routes/departments.routes'))
app.use('/api', require('./routes/refresh.routes'))

server.listen(PORT, () => console.log(`App has been started on PORT ${PORT}`))
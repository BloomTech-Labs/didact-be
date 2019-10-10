const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const authRouter = require('../auth/authRouter')
const coursesRouter = require('../courses/coursesRouter')

const server = express()

const restricted = require('../utils/restricted')

server.use(cors())
server.use(helmet())
server.use(express.json())

server.use('/api/auth', authRouter)
server.use('/api/courses', restricted , coursesRouter)
server.use('/api/docs', express.static('./docs'))

server.get('/', (req, res) =>
{
    res.send("server is running")
})
module.exports = server
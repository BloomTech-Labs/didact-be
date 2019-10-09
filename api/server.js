const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const server = express()

server.use(cors())
server.use(helmet())
server.use(express.json())

server.use('/api/docs', express.static('./docs'))

server.get('/', (req, res) =>
{
    res.send("server is running")
})
module.exports = server
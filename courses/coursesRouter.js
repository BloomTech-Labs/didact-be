const router = require('express').Router()

const Courses = require('./coursesModel')

router.get('/', (req, res) => {
    Courses.find()
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            res.status(500).json({ message: 'Error connecting with server' })
        })
})

module.exports = router
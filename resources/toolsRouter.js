const router = require('express').Router()
const Tools = require('./toolsModel')
const Users = require('../users/usersModel')

router.get('/', (req, res) => {
    Tools.get()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.get('/:id', (req, res) => {
    Tools.getById(req.params.id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
    let email = req.user.email 
    let tool = req.body
    Users.findBy({ email })
    .then(user => {
        Tools.add(user.id, tool)
        .then(response => {
            res.status(201).json({ Success: "Tool has been created.", tool})
        })
        .catch(err => {
            res.status(500).json({ error: "Unable to add tool."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Unable to add tool."})
    })
})

router.put('/:id', (req, res) => {
    let email = req.user.email
    let updates = req.body
    Users.findBy({ email })
    .then(user => {
        Tools.update(user, req.params.id, updates)
        .then(result => {
            res.status(200).json({ success: "Tool updated", updates})
        })
        .catch(err => {
        res.status(500).json({ error: "Could not update tool."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Could not update tool."})
    })
})

router.delete('/:id', (req, res) => {
    let email = req.user.email
    Users.findBy({ email })
    .then(user => {
        Tools.del(user, req.params.id)
        .then(result => {
            res.status(200).json({ Success: "Tool deleted"})
        })
        .catch(err => {
            res.status(500).json({ error: "Could not delete tool."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Could not delete tool."})
    })
})

module.exports = router;
const router = require('express').Router()
const Sources = require('./sourcesModel')
const Users = require('../users/usersModel')

router.get('/', (req, res) => {
    Sources.get()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.get('/:id', (req, res) => {
    Sources.getById(req.params.id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
    let email = req.user.email 
    let source = req.body
    Users.findBy({ email })
    .then(user => {
        Sources.add(user.id, source)
        .then(response => {
            res.status(201).json({ Success: "Source has been created.", source})
        })
        .catch(err => {
            res.status(500).json({ error: "Unable to add source."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Unable to add source."})
    })
})

router.put('/:id', (req, res) => {
    let email = req.user.email
    let updates = req.body
    Users.findBy({ email })
    .then(user => {
        Sources.update(user, req.params.id, updates)
        .then(result => {
            res.status(200).json({ success: "Source updated", updates})
        })
        .catch(err => {
        res.status(500).json({ error: "Could not update source."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Could not update source."})
    })
})

router.delete('/:id', (req, res) => {
    let email = req.user.email
    Users.findBy({ email })
    .then(user => {
        Sources.del(user, req.params.id)
        .then(result => {
            res.status(200).json({ Success: "Source deleted"})
        })
        .catch(err => {
            res.status(500).json({ error: "Could not delete source."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Could not delete source."})
    })
})

module.exports = router;
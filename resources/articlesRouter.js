const router = require('express').Router()
const Articles = require('./articlesModel')
const Users = require('../users/usersModel')

router.get('/', (req, res) => {
    Articles.get()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.get('/:id', (req, res) => {
    Articles.getById(req.params.id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
    let email = req.user.email 
    let article = req.body
    Users.findBy({ email })
    .then(user => {
        if(user) {
            Articles.add(user.id, article)
            .then(response => {
                res.status(201).json({ Success: "Article has been created.", article})
            })
            .catch(err => {
                res.status(500).json({ error: "Unable to add article."})
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "Unable to add article."})
    })
})

router.put('/:id', (req, res) => {
    let email = req.user.email
    let updates = req.body
    Users.findBy({ email })
    .then(user => {
        Articles.update(user, req.params.id, updates)
        .then(result => {
            res.status(200).json({ success: "Article updated", updates})
        })
        .catch(err => {
        res.status(500).json({ error: "Could not update article."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Could not update article."})
    })
})

router.delete('/:id', (req, res) => {
    let email = req.user.email
    Users.findBy({ email })
    .then(user => {
        Articles.del(user, req.params.id)
        .then(result => {
            res.status(200).json({ Success: "Article deleted"})
        })
        .catch(err => {
            res.status(500).json({ error: "Could not delete article."})
        })
    })
    .catch(err => {
        res.status(500).json({ error: "Could not delete article."})
    })
})

module.exports = router;
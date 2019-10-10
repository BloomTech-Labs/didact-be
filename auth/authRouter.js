const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const secrets = require('../config/secret')

const Users = require('../users/usersModel')

router.post('/register', (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash

    Users.add(user)
        .then(response => {
            res.status(201).json({ message: 'User Created', email: user.email})
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Error connecting with server', error})
        })
})

router.post('/login', (req, res) => {
    let { email, password } = req.body

    Users.findBy({ email })
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                res.status(200).json({ token, id: user.id, email: user.email});
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: `Couldn't connect to login service` })
        })
})

function generateToken(user) {
    const payload = {
        email: user.email
    };

    const options = {
        expiresIn: '1d'
    }
    

    return jwt.sign(payload, secrets.jwtSecret, options)
}


module.exports = router
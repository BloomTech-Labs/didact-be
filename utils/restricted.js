const jwt = require('jsonwebtoken')

const secrets = require('../config/secret')

module.exports = (req, res, next) => {
    const token = req.headers.authorization

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if (err) res.status(401).json({ message: 'Invalid Credentials' })
            else {
                req.user = { email: decodedToken.email, owner: decodedToken.owner, admin: decodedToken.admin, moderator: decodedToken.moderator }
                next()
            }
        })
    } else {
        res.status(401).json({ message: 'Forbidden Access!' });
    }
};
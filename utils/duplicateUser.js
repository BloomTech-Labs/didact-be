const Users = require('../users/usersModel')

module.exports = (req, res, next) =>
{
    const email = req.body.email
    Users.findBy({email})
        .then(response =>
            {
                if (response.id) res.status(409).json({ message: 'A user with that email already exists' })
                else next()
            })
        .catch(err =>
            {
                next()
            })
}
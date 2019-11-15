const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const hashCount = require('../utils/hashCount')
const duplicateUser = require('../utils/duplicateUser')
const restricted = require('../utils/restricted')
const nodemailer = require('nodemailer')

const secrets = require('../config/secret')

const Users = require('../users/usersModel')



router.post('/register', validateUserRegister, duplicateUser, (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, hashCount)
    let originalPass = user.password
    user.password = hash
    Users.add(user)
        .then(response => {
            console.log('register response', response)
            user.id = response[0]
            // Maybe can be removed, just use user.email
            Users.findBy({ email: user.email })
                .then(user => {
                    if (user && bcrypt.compareSync(originalPass, user.password)) {
                        const token = generateToken(user)
                        res.status(201).json({ token, id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });
                    } else {
                        res.status(401).json({ message: 'Invalid Credentials' });
                    }
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).json({ message: `Couldn't connect to login service` })
                })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: 'Error connecting with server'})
        })
})

router.post('/login', validateUserLogin, (req, res) => {
    let { email, password } = req.body

    Users.findBy({ email })
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                res.status(200).json({ token, id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name});
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: `Couldn't connect to login service` })
        })
})

router.post('/', (req, res) => {
    let token = req.body.token

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if (err) res.status(401).json({ message: 'Token does not exist' })
            else 
            {
                Users.findBy({email: decodedToken.email})
                .then(user =>
                    {
                        if(user) res.status(200).json({email: decodedToken.email, id: user.id, photo: user.photo || null, first_name: user.first_name, last_name: user.last_name })
                        else res.status(404).json({ message: 'No such user found' })
                    })
                .catch(err =>
                    {
                        res.status(500).json({ message: 'Internal server error, could not retrieve user' })
                    })
            }
        })
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
})

router.post('/contactmessage', restricted, (req, res) => 
{
    if(!req.body.message || !req.body.email || !req.body.name) res.status(400).json({ message: 'body must include name, email, and message' })
    else
    {
        let name = req.body.name
        let email = req.body.email
        let message = req.body.message

        let emailMessage = 
        {
            from: `${process.env.EMAIL}`,
            to: `${process.env.EMAIL}`,
            subject: `Contact Us Message from ${name} at ${email}`,
            text: `${message}`,
            // html: `<p>${message}</p>`
        }

        sendEmail(emailMessage)
        .then(info => 
        {
            res.status(201).json({ message: "You sent the message" })
        })
        .catch(error => res.status(500).json({ message: "Error! No message sent. Who knows?" }))

    }
})

async function sendEmail(emailMessage)
{
    try
    {
        let testAccount = await nodemailer.createTestAccount();
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            // port: 587,
            // secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        });
    
        // send mail with defined transport object
        let info = await transporter.sendMail(emailMessage);
        console.log(info)
        return info
    }

    catch(error)
    {
        console.log(error)
        return error
    }
    // console.log('email message', emailMessage)

    // let transporter = nodemailer.createTransport({
    // service: 'Gmail',
    // auth: {
    //     user: `${process.env.EMAIL}`,
    //     pass: `${process.env.EMAIL_PASSWORD}`
    // }
    // });

    // let mailOptions = emailMessage
    // let retVal = 1
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         retVal = 0
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
    // return retVal
}
    
function generateToken(user) {
    const payload = {
        email: user.email
    };

    const options = {
        expiresIn: '7d'
    }
    
    return jwt.sign(payload, secrets.jwtSecret, options)
}

function validateUserRegister(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "missing user data"})
    else if(!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) res.status(400).json({ message: "email, password, first_name, and last_name are required"})
    else next()
}

function validateUserLogin(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "missing user data"})
    else if(!req.body.email || !req.body.password) res.status(400).json({ message: "missing email or password"})
    else next()
}

module.exports = router

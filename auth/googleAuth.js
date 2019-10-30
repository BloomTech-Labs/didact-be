const passport = require('passport');
const router = require('express').Router()
const secrets = require('../config/secret')
const jwt = require('jsonwebtoken')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const Users = require('../users/usersModel')

passport.use(new GoogleStrategy({
    clientID: secrets.googleId,
    clientSecret: secrets.googleSecret,
    callbackURL: `${secrets.passportUrl}/api/auth/google/callback`
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile)
        console.log(profile.photos[0].value)
        Users.GGLfindOrCreate({ googleID: profile._json.sub, first_name: profile._json.given_name, last_name: profile._json.family_name, email: profile._json.email })
            .then(response => {
                cb(null, profile._json)
            })
            .catch(err => {
                console.log(err)
                cb(null, err)
            })
        console.log(profile)
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        const token = generateToken(req.user)
        res.redirect(`https://staging-didact-fe.netlify.com/auth?token=${token}`)
    });

function generateToken(user) {
    const payload = {
        email: user.email
    };

    const options = {
        expiresIn: '1d'
    }


    return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
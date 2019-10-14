const passport = require('passport');
const FacebookAuth = require('passport-facebook');
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const url = require('url');

const secrets = require('../config/secret')

const Users = require('../users/usersModel')

passport.use(new FacebookAuth({
  clientID: secrets.facebookId,
  clientSecret: secrets.facebookSecret,
  callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'picture']
},
  function (accessToken, refreshToken, profile, cb) {
    console.log(profile)
    // console.log({ facebookID: profile._json.id, first_name: profile._json.first_name, last_name: profile._json.last_name, email: profile._json.email })
    Users.FBfindOrCreate({ facebookID: profile._json.id, first_name: profile._json.first_name, last_name: profile._json.last_name, email: profile._json.email })
      .then(response => {
        cb(null, profile._json)
      })
      .catch(err => {
        console.log(err)
        cb(null, err)
      })
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

router.get('/', passport.authenticate('facebook', { scope: ['email'], callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback` }))

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    const token = generateToken(req.user)
    // console.log({ token, id: req.user.id, email: req.user.email})
    res.status(200).json({ token, id: req.user.id, email: req.user.email});
    // res.redirect(`https://staging-didact-fe.netlify.com/dashboard`)
    // res.json(req.user)
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
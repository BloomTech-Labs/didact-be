const passport = require('passport');
const FacebookAuth = require('passport-facebook');
const router = require('express').Router()

const secrets = require('../config/secret')

passport.use(new FacebookAuth({
    clientID: secrets.facebookId,
    clientSecret: secrets.facebookSecret,
    callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'photo']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Authed")
    cb(null, profile)
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

router.use(passport.initialize());
router.use(passport.session());

router.get('/', passport.authenticate('facebook', { scope: ['email'], callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`}))

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json(req.user)
  });

  module.exports = router;
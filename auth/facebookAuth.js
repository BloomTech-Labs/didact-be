const passport = require('passport');
const FacebookAuth = require('passport-facebook');
const router = require('express').Router()

const secrets = require('../config/secret')

passport.use(new FacebookAuth({
    clientID: secrets.facebookId,
    clientSecret: secrets.facebookSecret,
    callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Authed")
    cb(null, profile)
  }
));
console.log(secrets.passportUrl)

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
passport.deserializeUser(function(user, cb) {
    cb(null, user);
  });

router.use(passport.initialize());
router.use(passport.session());

router.get('/', passport.authenticate('facebook', { callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`}))

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    res.redirect('/');
  });

  module.exports = router;
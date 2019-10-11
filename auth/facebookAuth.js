const passport = require('passport');
const FacebookAuth = require('passport-facebook');
const router = require('express').Router()


//Retrived from https://developers.facebook.com/apps/2395844084004101/settings/basic/
const FACEBOOK_APP_ID = '2395844084004101';
const FACEBOOK_APP_SECRET = '53800821ec15471c0ecd621831f2bd25';

passport.use(new FacebookAuth({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "https://didactlms-staging.herokuapp.com/api/auth/facebook/callback"
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

router.get('/', passport.authenticate('facebook', { callbackURL: 'https://didactlms-staging.herokuapp.com/api/auth/facebook/callback'}))

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    res.redirect('/');
  });

  module.exports = router;
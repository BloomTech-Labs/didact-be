const passport = require('passport');
const express = require('express');
const FacebookAuth = require('passport-facebook');
const app = express();


//Retrived from https://developers.facebook.com/apps/2395844084004101/settings/basic/
const FACEBOOK_APP_ID = '2395844084004101';
const FACEBOOK_APP_SECRET = '53800821ec15471c0ecd621831f2bd25';

const facebookOptions = {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'https://www.google.com' //test
}

const facebookCallback = function(accessToken, refreshToken, profile, cb){

}
passport.use(new FacebookAuth(facebookOptions, facebookCallback))

app.route('/register/facebook')
    .get(passport.authenticate('facebook'))

app.route('/register/facebook/callback')
    .get(function(req, res) {
        console.log("Callback successful.")
    })
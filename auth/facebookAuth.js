const passport = require("passport");
const FacebookAuth = require("passport-facebook");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const url = require("url");

const secrets = require("../config/secret");

const Users = require("../users/usersModel");

passport.use(
  new FacebookAuth(
    {
      clientID: secrets.facebookId,
      clientSecret: secrets.facebookSecret,
      callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`,
      profileFields: [
        "id",
        "displayName",
        "email",
        "first_name",
        "last_name",
        "picture"
      ]
    },
    function(accessToken, refreshToken, profile, cb) {
      Users.FBfindOrCreate({
        facebookID: profile._json.id,
        first_name: profile._json.first_name,
        last_name: profile._json.last_name,
        email: profile._json.email,
        photo: profile.photos[0].value
      })
        .then(response => {
          cb(null, profile._json);
        })
        .catch(err => {
          cb(null, err);
        });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.get(
  "/",
  passport.authenticate("facebook", {
    scope: ["email"],
    callbackURL: `${secrets.passportUrl}/api/auth/facebook/callback`
  })
);

router.get(
  "/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    const token = generateToken(req.user);
    // res.status(200).json({ token, id: req.user.id, email: req.user.email});
    // res.json(req.user)
    const redirectUrl = process.env.REDIRECT_URL;
    res.redirect(`${redirectUrl}/auth?token=${token}`);
  }
);

function generateToken(user) {
  const payload = {
    email: user.email
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;

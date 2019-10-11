module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    facebookId: process.env.FACEBOOK_APP_ID,
    facebookSecret: process.env.FACEBOOK_APP_SECRET,
    passportUrl: process.env.PASSPORT_URL || 'localhost:5000'
}
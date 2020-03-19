const { config, uploader } = require('cloudinary').v2;

require("dotenv").config();
const cloudConfig = (req, res, next) => {
    config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    next();
}
module.exports = {
    uploader,
    cloudConfig
};


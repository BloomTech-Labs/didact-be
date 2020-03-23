const Users = require("../users/usersModel");
const { multerUploads, dataUri } = require("../uploads/multer.js");
const { uploader } = require("../api/cloudinaryConfig.js");

const validateImage = async (req, res, next) => {
  const userData = req.body;

  if (req.file) {
    const file = dataUri(req).content;
    // console.log("FILE IN VALIDATEXXXXXXXXXXXX", file);
    return uploader
      .upload(file)
      .then(result => {
        console.log("USERDATA.IMAGEXXXXXXXXXXXXXXXX", result);
        userData.image = result.url;
        req.image = result.url;
        next();
      })
      .catch(err => {
        userData.image = null;
        next();
      });
  } else {
    userData.image = null;
    console.log("NOOOOO IMAGE FROM VALIDATE");
    next();
  }
};

module.exports = { validateImage };

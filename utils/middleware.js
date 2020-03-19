const Users = require("../users/usersModel");
const { multerUploads, dataUri } = require("../uploads/multer.js");
const { uploader } = require("../api/cloudinaryConfig.js");

//WORKING
const validateImage = async (req, res, next) => {
  const userData = req.body;

  if (req.file) {
    const file = dataUri(req).content;
    return uploader
      .upload(file)
      .then(result => {
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
    next();
  }
};

module.exports = { validateImage };

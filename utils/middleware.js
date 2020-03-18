const Users = require("../users/usersModel");
const { multerUploads, dataUri } = require("../uploads/multer.js");
const { uploader } = require("../api/cloudinaryConfig.js");

//WORKING
const validateImage = async (req, res, next) => {
  const userData = req.body;

  if (req.file) {
    const file = dataUri(req).content;
    // console.log('it got HEEEEEEEEEEEEEEERRRRE', file)
    return uploader
      .upload(file)
      .then(result => {
        userData.image = result.url;
        req.image = result.url;
        console.log("XXXXXXXXXXXXXmiddleware", req.image);
        next();
      })
      .catch(err => {
        userData.image = null;
        next();
      });
  } else {
    // console.log('FFFFFFFFFFFFFFFFFFFFFFF', file)
    userData.image = null;
    next();
  }
};

module.exports = { validateImage };

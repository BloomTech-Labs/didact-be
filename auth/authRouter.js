const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hashCount = require("../utils/hashCount");
const duplicateUser = require("../utils/duplicateUser");
const restricted = require("../utils/restricted");
const sgMail = require("@sendgrid/mail");

const secrets = require("../config/secret");

const Users = require("../users/usersModel");

const { cloudConfig, uploader } = require("../api/cloudinaryConfig.js");
const { multerUploads, dataUri } = require("../uploads/multer");
const { validateImage } = require("../utils/middleware");

//GET list of all users conditions added to check role as owner or admin
router.get("/users", restricted, (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user.owner === true || user.admin === true) {
        Users.find()
          .then(users => {
            res.json(users);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: "Error unable to retrieve list of users" });
          });
      }
    })
    .catch(err =>
      res.status(500).json({ message: "Could not find user in database" })
    );
});

//GET user by id
router.get("/users/:id", (req, res) => {
  Users.findById(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//updates photo
router.put("/:id/upload", multerUploads, validateImage, async (req, res) => {
  const userId = req.params.id;
  const imageData = req.image;

  try {
    const edited = await Users.editImage(imageData, userId);
    res.status(200).json(edited);
  } catch (err) {
    res.status(500).json({ error: "Image cannot be updated at this moment" });
  }
});

router.put("/:id", multerUploads, validateImage, async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  console.log("ID AND CHANGES BEFORE FIND ID ORIG DATA PASS", id, changes);
  // let email = req.user.email;
  Users.findBy({ id })
    .then(person => {
      if (person) {
        console.log("CHANGES IN PERSON", changes);
        Users.updateUser(id, changes)
          .then(user => {
            if (user) {
              console.log("CHANGES INSIDE OF UPDATEXXXXX", changes);
              res.json({ update: user });
            } else {
              res
                .status(404)
                .json({ message: `Could not find user with id:${id}` });
            }
          })
          .catch(err => {
            console.log("IT GOT HERE TO CATCH ERROR LINE 111");
            res.status(500).json({ message: "Failed to update user" });
          });
      }
    })
    .catch(err => {
      console.log("IT GOT HERE TO CATCH ERROR LINE 117");
      res.status(500).json({ message: "Could not find user in database" });
    });
});

router.post("/emaillist", (req, res) => {
  if (!req.body.email) res.status(400).json({ message: "Must send email" });
  else {
    let email = req.body.email;
    Users.checkEmailListForEmail(email)
      .then(emailResponse => {
        if (emailResponse)
          res.status(200).json({ message: "Email was already in database" });
        else {
          Users.addToEmailList(email)
            .then(response =>
              res.status(201).json({ message: "Email has been added to list" })
            )
            .catch(err =>
              res
                .status(500)
                .json({ message: "Internal Error: Could not add email" })
            );
        }
      })
      .catch(error => {
        res
          .status(500)
          .json({ message: "Internal Error: Could not add email" });
      });
  }
});

//TODO make admin account, admin middleware, put it on this endpoint
// Avoid email get for any random person. Only admin.
router.get("/emaillist", (req, res) => {
  Users.getEmailList()
    .then(response => res.status(200).json(response))
    .catch(err =>
      res.status(500).json({ message: "Internal Error: Could not get emails" })
    );
});

router.post("/register", validateUserRegister, duplicateUser, (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, hashCount);
  let originalPass = user.password;
  user.password = hash;
  Users.add(user)
    .then(response => {
      user.id = response[0];
      // Maybe can be removed, just use user.email
      Users.findBy({ email: user.email })
        .then(user => {
          if (user && bcrypt.compareSync(originalPass, user.password)) {
            const token = generateToken(user);
            Users.addInitProfile(user);
            res.status(201).json({ token, user });
          } else {
            res.status(401).json({ message: "Invalid Credentials" });
          }
        })
        .catch(error => {
          res
            .status(500)
            .json({ message: `Couldn't connect to login service` });
        });
    })
    .catch(error => {
      res.status(500).json({ message: "Error connecting with server" });
    });
});

router.post("/login", validateUserLogin, (req, res) => {
  let { email, password } = req.body;

  Users.findBy({ email })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ token, user });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: `Couldn't connect to login service` });
    });
});

router.post("/", (req, res) => {
  let token = req.body.token;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) res.status(401).json({ message: "Token does not exist" });
      else {
        Users.findBy({ email: decodedToken.email })
          .then(user => {
            if (user)
              res.status(200).json({
                email: decodedToken.email,
                id: user.id,
                image: user.image,
                owner: user.owner,
                admin: user.admin,
                moderator: user.moderator,
                first_name: user.first_name,
                last_name: user.last_name
              });
            else res.status(404).json({ message: "No such user found" });
          })
          .catch(err => {
            res.status(500).json({
              message: "Internal server error, could not retrieve user"
            });
          });
      }
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
});

router.post("/contactmessage", restricted, (req, res) => {
  if (!req.body.message || !req.body.email || !req.body.name)
    res
      .status(400)
      .json({ message: "body must include name, email, and message" });
  else {
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;

    let emailMessage = {
      from: `${email}`,
      to: `${process.env.EMAIL}`,
      subject: `Contact Us Message from ${name} at ${email}`,
      text: `${message}`
      // html: `<p>${message}</p>`
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    sgMail
      .send(emailMessage)
      .then(response => {
        res.status(201).json({ message: "Email Sent" });
      })
      .catch(error => {
        res.status(500).json({ message: "Error sending message" });
      });
  }
});

function generateToken(user) {
  const payload = {
    email: user.email,
    id: user.id,
    image: user.image,
    owner: user.owner,
    admin: user.admin,
    moderator: user.moderator
  };

  const options = {
    expiresIn: "7d"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

// post pic in cloudinary then save to backend table
router.post("/picture", multerUploads, (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;
    return uploader
      .upload(file)
      .then(result => {
        const image = result.url;
        return res.status(200).json({
          messge: "Your image has been uploaded successfully to cloudinary",
          data: {
            image
          }
        });
      })
      .catch(err =>
        res.status(400).json({
          messge: "someting went wrong while processing your request",
          data: {
            err
          }
        })
      );
  }
});

//GET userprofile by id
router.get("/profile/:id", (req, res) => {
  Users.findProfileById(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//GET profiles from all users
router.get("/profile/all", (req, res) => {
  Users.findAllProfile()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/profile", restricted, (req, res) => {
  const profile = req.body;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Users.addProfile(user.id, profile)
          .then(response => {
            res.status(201).json({ id: response[0] });
          })
          .catch(error => {
            res.status(500).json({ message: "Could not add course" });
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to add course for" });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Could not find user to add course for" });
    });
});

//UPDATE userprofile by specific id
router.put("/profile/:id", restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  let email = req.user.email;
  Users.findBy({ email })
    .then(person => {
      if (person) {
        Users.updateProfile(id, changes)
          .then(user => {
            if (user) {
              res.json({ update: user });
            } else {
              res
                .status(404)
                .json({ message: `Could not find user with id:${id}` });
            }
          })
          .catch(err => {
            res.status(500).json({ message: "Failed to update user profile" });
          });
      }
    })
    .catch(err =>
      res.status(500).json({ message: "Could not find user in database" })
    );
});

// DELETE profile with specified ID
router.delete("/:id", restricted, (req, res) => {
  const { id } = req.params;

  Users.remove(id)
    .then(deleted => {
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res
          .status(404)
          .json({ message: `Could not find a user profile with id: ${id}` });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to delete user profile" });
    });
});

function validateUserRegister(req, res, next) {
  if (!req.body) res.status(400).json({ message: "missing user data" });
  else if (
    !req.body.email ||
    !req.body.password ||
    !req.body.first_name ||
    !req.body.last_name
  )
    res.status(400).json({
      message: "email, password, first_name, and last_name are required"
    });
  else next();
}

function validateUserLogin(req, res, next) {
  if (!req.body) res.status(400).json({ message: "missing user data" });
  else if (!req.body.email || !req.body.password)
    res.status(400).json({ message: "missing email or password" });
  else next();
}

module.exports = router;

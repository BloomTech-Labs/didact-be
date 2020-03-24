const router = require("express").Router();
const Tools = require("./toolsModel");
const Users = require("../users/usersModel");
const { uploader } = require("../api/cloudinaryConfig.js");
const { multerUploads, dataUri } = require("../uploads/multer");
const { validateImage } = require("../utils/middleware");
router.get("/", (req, res) => {
  if (req.headers.filter) {
    let filter = req.headers.filter;
    let query = req.headers.query;
    if (!query || query === undefined || query === null || filter === "topic") {
      res.status(200).send([]);
    } else if (filter === "title" || filter === "description") {
      Tools.findByFilter(filter, query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "creator" && query) {
      Tools.findByOwner(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "tag" && query) {
      Tools.findByTag(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  } else {
    Tools.get()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

router.get("/:id", (req, res) => {
  Tools.getById(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  let email = req.user.email;
  let tool = req.body;
  Users.findBy({ email })
    .then(user => {
      Tools.add(user.id, tool)
        .then(response => {
          res.status(201).json({ Success: "Tool has been created.", tool });
        })
        .catch(err => {
          res.status(500).json({ error: "Unable to add tool." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Unable to add tool." });
    });
});

router.put("/:id", (req, res) => {
  let email = req.user.email;
  let updates = req.body;
  Users.findBy({ email })
    .then(user => {
      Tools.update(user, req.params.id, updates)
        .then(result => {
          res.status(200).json({ success: "Tool updated", updates });
        })
        .catch(err => {
          res.status(500).json({ error: "Could not update tool." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Could not update tool." });
    });
});

//updates tool image
router.put("/:id/image", multerUploads, validateImage, async (req, res) => {
  const toolId = req.params.id;
  const imageData = req.image;

  try {
    const edited = await Tools.editToolImage(imageData, toolId);
    res.status(200).json(edited);
  } catch (err) {
    res.status(500).json({ error: "Image cannot be updated at this moment" });
  }
});

router.delete("/:id", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      Tools.del(user, req.params.id)
        .then(result => {
          res.status(200).json({ Success: "Tool deleted" });
        })
        .catch(err => {
          res.status(500).json({ error: "Could not delete tool." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Could not delete tool." });
    });
});

module.exports = router;

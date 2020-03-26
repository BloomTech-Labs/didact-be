const router = require("express").Router();
const Sources = require("./sourcesModel");
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
      Sources.findByFilter(filter, query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "creator" && query) {
      Sources.findByOwner(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "tag" && query) {
      Sources.findByTag(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  } else {
    Sources.get()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
});

router.get("/:id", (req, res) => {
  Sources.getById(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", multerUploads, validateImage, async (req, res) => {
  let email = req.user.email;
  let source = req.body;
  Users.findBy({ email })
    .then(user => {
      Sources.add(user.id, source)
        .then(response => {
          res.status(201).json({ Success: "Source has been created.", source });
        })
        .catch(err => {
          res.status(500).json({ error: "Unable to add source." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Unable to add source." });
    });
});

router.put("/:id", (req, res) => {
  let email = req.user.email;
  let updates = req.body;
  Users.findBy({ email })
    .then(user => {
      Sources.update(user, req.params.id, updates)
        .then(result => {
          res.status(200).json({ success: "Source updated", updates });
        })
        .catch(err => {
          res.status(500).json({ error: "Could not update source." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Could not update source." });
    });
});

//updates sources image
router.put("/:id/image", multerUploads, validateImage, async (req, res) => {
  const sourceId = req.params.id;
  const imageData = req.image;

  try {
    const edited = await Sources.editSourceImage(imageData, sourceId);
    res.status(200).json(edited);
  } catch (err) {
    res.status(500).json({ error: "Image cannot be updated at this moment" });
  }
});

router.delete("/:id", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      Sources.del(user, req.params.id)
        .then(result => {
          res.status(200).json({ Success: "Source deleted" });
        })
        .catch(err => {
          res.status(500).json({ error: "Could not delete source." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Could not delete source." });
    });
});

module.exports = router;

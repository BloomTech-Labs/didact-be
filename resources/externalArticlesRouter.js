const router = require("express").Router();
const Articles = require("./externalArticlesModel");
const Users = require("../users/usersModel");

router.get("/", (req, res) => {
  if (req.headers.filter) {
    let filter = req.headers.filter;
    let query = req.headers.query;
    if (!query || query === undefined || query === null) {
      res.status(200).json(emptyArray.thing);
    } else if (
      filter === "topic" ||
      filter === "title" ||
      filter === "description"
    ) {
      Articles.findByFilter(filter, query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "creator" && query) {
      Articles.findByOwner(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "tag" && query) {
      Articles.findByTag(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  } else {
    Articles.get()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json(err.response);
      });
  }
});

router.get("/:id", (req, res) => {
  Articles.getById(req.params.id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  let email = req.user.email;
  let article = req.body;
  Users.findBy({ email })
    .then(user => {
      Articles.add(user.id, article)
        .then(response => {
          res
            .status(201)
            .json({ Success: "Article has been created.", article });
        })
        .catch(err => {
          res.status(500).json({ error: "Unable to add article." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Unable to add article." });
    });
});

router.put("/:id", (req, res) => {
  let email = req.user.email;
  let updates = req.body;
  Users.findBy({ email })
    .then(user => {
      Articles.update(user, req.params.id, updates)
        .then(result => {
          res.status(200).json({ success: "Article updated", updates });
        })
        .catch(err => {
          res.status(500).json({ error: "Could not update article." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Could not update article." });
    });
});

router.delete("/:id", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      Articles.del(user, req.params.id)
        .then(result => {
          res.status(200).json({ Success: "Article deleted" });
        })
        .catch(err => {
          res.status(500).json({ error: "Could not delete article." });
        });
    })
    .catch(err => {
      res.status(500).json({ error: "Could not delete article." });
    });
});

module.exports = router;

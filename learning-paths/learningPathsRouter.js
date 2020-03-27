const router = require("express").Router();
const Paths = require("./learningPathsModel");
const Users = require("../users/usersModel");

router.get("/", (req, res) => {
  let email = req.user.email;

  //checking if user making request exists in database using the token (email value) on their request header
  Users.findBy({ email })
    .then(user => {
      //Here is the query and filter check. Should be receiving this info
      //from the query bar on the front-end.
      if (req.headers.filter) {
        let filter = req.headers.filter;
        let query = req.headers.query;
        if (!query || query === undefined || query === null) {
          res.status(200).send([]);
        } else if (
          filter === "topic" ||
          filter === "title" ||
          filter === "description"
        ) {
          Paths.findByFilter(filter, query)
            .then(response => {
              res.status(200).json(response);
            })
            .catch(err => {
              res.status(500).json(err);
            });
        } else if (filter === "tag") {
          Paths.findByTag(query)
            .then(response => {
              res.status(200).json(response);
            })
            .catch(err => {
              res.status(500).json(err);
            });
        } else if (filter === "creator") {
          Paths.findByOwner(query)
            .then(response => {
              res.status(200).json(response);
            })
            .catch(err => {
              res.status(500).json(err);
            });
        }
      } else {
        //passing user id to get paths that user is not on
        Paths.findForNotUserId(user.id)
          .then(response => {
            res.status(200).json(response);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/yours", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        //passing in user id to get paths user is on
        Paths.findForUserId(user.id)
          .then(response => {
            res.status(200).json(response);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      } else
        res.status(500).json({
          message: "Error, could not find user to check learning paths for"
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error, could not find user to check learning paths for"
      });
    });
});

router.get("/yours-owned", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.findForOwner(user.id)
          .then(response => {
            res.status(200).json(response);
          })
          .catch(err => {
            res.status(500).json({
              message: "Error, could not find user to check learning paths for"
            });
          });
      } else
        res.status(500).json({
          message: "Error, could not find user to check learning paths for"
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error, could not find user to check learning paths for"
      });
    });
});

router.get("/:id", (req, res) => {
  Paths.findById(req.params.id)
    .then(response => {
      if (response.code === 404)
        res.status(404).json({ message: response.message });
      else if (response.code === 500)
        res.status(500).json({ message: response.message });
      else res.status(200).json(response.path);
    })
    .catch(error => {
      res.status(500).json({ message: "Error connecting with server" });
    });
});

router.get("/:id/yours", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.findYourPathById(user.id, req.params.id)
          .then(response => {
            if (response.code === 404)
              res.status(404).json({ message: response.message });
            else if (response.code === 500)
              res.status(500).json({ message: response.message });
            else res.status(200).json(response.path);
          })
          .catch(error => {
            res.status(500).json({ message: "Error connecting with server" });
          });
      } else
        res.status(500).json({
          message: "Error, could not find user to check learning path for"
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error, could not find user to check learning path for"
      });
    });
});

function validateLearningPath(req, res, next) {
  if (!req.body)
    res.status(400).json({ message: "Missing learning path data" });
  else if (!req.body.path.title)
    res.status(400).json({ message: "Learning Path title is required" });
  else if (!req.body.userPathOrder)
    res.status(400).json({ message: "userPathOrder is required" });
  else next();
}
//TODO: Update Docs
router.post("/", validateLearningPath, (req, res) => {
  const path = req.body.path;
  const order = req.body.userPathOrder;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.add(user.id, path, order)
          .then(response => {
            res.status(201).json({ id: response });
          })
          .catch(error => {
            res.status(500).json({ message: "Could not add learning path" });
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to add learning path for" });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Could not find user to add learning path for" });
    });
});
//need to verify if working
router.put("/:id", (req, res) => {
  if (!req.body.changes)
    res.status(400).json({ message: "Missing learning path changes" });
  else {
    const changes = req.body.changes;
    let email = req.user.email;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          //passes entire user object into model to check user permissions in the database
          Paths.updatePathById(user, req.params.id, changes)
            .then(response => {
              if (response.code === 404)
                res.status(404).json({ message: response.message });
              else if (response.code === 403)
                res.status(403).json({ message: response.message });
              else res.status(200).json({ message: "Learning path updated" });
            })
            .catch(error => {
              res.status(500).json({ message: "Could not edit learning path" });
            });
        } else
          res
            .status(500)
            .json({ message: "Could not find user to edit learning path for" });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Could not find user to edit learning path for" });
      });
  }
});
// TODO need to verify this code
router.put("/:id/yours", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.togglePathCompletion(user, req.params.id)
          .then(response => {
            if (response.code === 404)
              res.status(404).json({ message: response.message });
            else
              res
                .status(200)
                .json({ message: "Learning path completion toggled" });
          })
          .catch(error => {
            res
              .status(500)
              .json({ message: "Could not toggle learning path completion" });
          });
      } else
        res.status(500).json({
          message: "Could not find user to toggle learning path completion for"
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not find user to toggle learning path completion for"
      });
    });
});

//This code is working, used in deleting learningpaths via specified id
router.delete("/:id", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      Paths.deletePathById(user, req.params.id)
        .then(result => {
          if (res.code === 404) {
            res.status(404).json({ message: res.message });
          }
          if (res.code === 403) {
            res.status(403).json({ message: res.message });
          } else {
            res.status(200).json({ message: "deleted learning path" });
          }
        })
        .catch(err => {
          res.status(500).json({ message: "Could not delete learning path." });
        });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Could not find user to delete learning path for" });
    });
});

//TODO: update docs
router.post("/:id/users", (req, res) => {
  let email = req.user.email;
  if (!req.body.order)
    res.status(400).json({ message: "Must send order for path" });
  else {
    let order = req.body.order;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Paths.joinLearningPath(user.id, req.params.id, order)
            .then(response => {
              response == 1
                ? res.status(200).json({ message: "Joined learning path" })
                : res
                    .status(500)
                    .json({ message: "Could not join learning path" });
            })
            .catch(error => {
              res.status(500).json({ message: "Could not join learning path" });
            });
        } else
          res
            .status(500)
            .json({ message: "Could not find user to join learning path" });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Could not find user to join learning path" });
      });
  }
});
//Only the user can delete the learning path he is part of, not modified
router.delete("/:id/users", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.quitLearningPath(user.id, req.params.id)
          .then(response => {
            res.status(200).json({ message: "Quit learning path" });
          })
          .catch(error => {
            res.status(500).json({ message: "Could not quit learning path" });
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to quit learning path" });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Could not find user to quit learning path" });
    });
});

//verify if working when we implement tags to, this should work.
router.post("/:id/tags", (req, res) => {
  const pathId = req.params.id;
  let email = req.user.email;
  if (!req.body.tag) res.status(400).json({ message: "Missing tag data" });
  else {
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Paths.addPathTag(user, pathId, req.body.tag)
            .then(response => {
              if (response.code === 201)
                res.status(201).json({ message: response.message });
              else
                res.status(response.code).json({ message: response.message });
            })
            .catch(error => {
              res.status(500).json({
                message: "Internal error: Could not add tag to learning path"
              });
            });
        } else
          res
            .status(500)
            .json({ message: "Could not find user to add learning path for" });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Could not find user to add learning path for" });
      });
  }
});
// verify if working
router.delete("/:id/tags", (req, res) => {
  if (!req.body.tag) {
    res.status(400).json({ message: "Missing tag data" });
  } else {
    const pathId = req.params.id;
    let email = req.user.email;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Paths.deletePathTag(user, pathId, req.body.tag)
            .then(response => {
              if (response.code === 200)
                res.status(200).json({ message: response.message });
              else
                res.status(response.code).json({ message: response.message });
            })
            .catch(error => {
              res.status(500).json({
                message: "Internal error: Could not remove tags from path"
              });
            });
        } else
          res
            .status(500)
            .json({ message: "Could not find user to remove tag for" });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Could not find user to remove tag for" });
      });
  }
});

router.post("/:id/courses/:courseId", (req, res) => {
  const pathId = req.params.id;
  const courseId = req.params.courseId;
  let email = req.user.email;
  if (!req.body.order)
    res.status(400).json({ message: "must send order for course in body" });
  else {
    const order = req.body.order;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Paths.addPathCourse(user.id, pathId, courseId, order)
            .then(response => {
              if (response.code === 200)
                res.status(200).json({
                  message: response.message,
                  pathCourses: response.pathCourses
                });
              else
                res.status(response.code).json({ message: response.message });
            })
            .catch(error => {
              res.status(500).json({
                message: "Internal error: Could not add course to learning path"
              });
            });
        } else
          res
            .status(500)
            .json({ message: "Could not find user to add learning path for" });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Could not find user to add learning path for" });
      });
  }
});
// Working. This removes the courses that was added to a learning path
router.delete("/:id/courses/:courseId", (req, res) => {
  const pathId = req.params.id;
  const courseId = req.params.courseId;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.removePathCourse(user, pathId, courseId)
          .then(response => {
            if (response.code === 404)
              res.status(404).json({
                message: response.message,
                pathCourses: response.pathCourses
              });

            if (response.code === 403)
              res.status(403).json({
                message: response.message,
                pathCourses: response.pathCourses
              });

            if (response.code === 200)
              res.status(200).json({
                message: response.message,
                pathCourses: response.pathCourses
              });
            else res.status(response.code).json({ message: response.message });
          })
          .catch(error => {
            res.status(500).json({
              message: "Internal error: Could not remove courses from path"
            });
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to remove course for" });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Could not find user to remove course for" });
    });
});
// verify if working
router.put("/:id/order", (req, res) => {
  const pathId = req.params.id;
  let email = req.user.email;
  if (!req.body.learningPathContent)
    res
      .status(400)
      .json({ message: "must send content for learning path in body" });
  else {
    let content = req.body.learningPathContent;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Paths.updateContentOrder(user, pathId, content)
            .then(response => {
              if (response === 200)
                res.status(200).json({ message: response.message });
              else
                res.status(response.code).json({ message: response.message });
            })
            .catch(error => {
              res.status(500).json({
                message:
                  "Internal error: Could not update learning path content order"
              });
            });
        } else
          res.status(500).json({
            message: "Could not find user to update learning path content order"
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "Could not find user to update learning path content order"
        });
      });
  }
});

function verifyLearningPath(req, res, next) {
  Paths.findById(req.params.id)
    .then(response => next())
    .catch(err =>
      res.status(404).json({ message: "No learning path found with that ID" })
    );
}

function validateLearningPathItem(req, res, next) {
  if (!req.body)
    res.status(400).json({ message: "Missing learning path item data" });
  else if (!req.body.name)
    res.status(400).json({ message: "Learning Path Item name is required" });
  else next();
}
//working code conditionals added
router.post(
  "/:id/path-items",
  verifyLearningPath,
  validateLearningPathItem,
  (req, res) => {
    const pathId = req.params.id;
    const pathItem = req.body;
    let email = req.user.email;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Paths.addPathItem(user, pathId, pathItem)
            .then(response => {
              if (response.code === 403)
                res.status(403).json({ message: response.message });
              else if (response.code === 404)
                res.status(404).json({ message: response.message });
              else
                res
                  .status(201)
                  .json({ message: response.message, id: response.id });
            })
            .catch(error => {
              res
                .status(500)
                .json({ message: "Could not add learning path Item" });
            });
        } else
          res.status(500).json({
            message: "Could not find user to add learning path Item for"
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "Could not find user to add learning path Item for"
        });
      });
  }
);
//verify if working
router.put("/:id/path-items/:itemId", verifyLearningPath, (req, res) => {
  const pathId = req.params.id;
  const itemId = req.params.itemId;
  const changes = req.body;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.updatePathItem(user, pathId, itemId, changes)
          .then(response => {
            if (response.code === 403)
              res.status(403).json({ message: response.message });
            else if (response.code === 404)
              res.status(404).json({ message: response.message });
            else
              res
                .status(200)
                .json({ message: response.message, id: response.id });
          })
          .catch(error => {
            res
              .status(500)
              .json({ message: "Could not update learning path Item" });
          });
      } else
        res.status(500).json({
          message: "Could not find user to update learning path Item for"
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not find user to update learning path Item for"
      });
    });
});
//verify if working
router.put("/:id/path-items/:itemId/yours", verifyLearningPath, (req, res) => {
  const pathId = req.params.id;
  const itemId = req.params.itemId;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.togglePathItemCompletion(user, pathId, itemId)
          .then(response => {
            res.status(200).json({
              message: "Learning path item completion has been toggled"
            });
          })
          .catch(error => {
            res
              .status(500)
              .json({ message: "Could not complete learning path Item" });
          });
      } else
        res.status(500).json({
          message: "Could not find user to complete learning path Item for"
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not find user to complete learning path Item for"
      });
    });
});

//modified to verify roles, working
router.delete("/:id/path-items/:itemId", verifyLearningPath, (req, res) => {
  const pathId = req.params.id;
  const itemId = req.params.itemId;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Paths.deletePathItem(user, pathId, itemId)
          .then(response => {
            if (response.code === 403)
              res.status(403).json({ message: response.message });
            else if (response.code === 404)
              res.status(404).json({ message: response.message });
            else
              res
                .status(200)
                .json({ message: response.message, id: response.id });
          })
          .catch(error => {
            res
              .status(500)
              .json({ message: "Could not delete learning path Item" });
          });
      } else
        res.status(500).json({
          message: "Could not find user to delete learning path Item for"
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not find user to delete learning path Item for"
      });
    });
});
//no conditionals needed
router.put("/", (req, res) => {
  let email = req.user.email;
  if (!req.body.pathOrderArray)
    res.status(400).json({ message: "must send pathOrderArray" });
  else {
    let pathOrderArray = req.body.pathOrderArray;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Paths.updatePathOrder(user.id, pathOrderArray)
            .then(response => {
              if (response === 200)
                res.status(200).json({ message: response.message });
              else
                res.status(response.code).json({ message: response.message });
            })
            .catch(error => {
              res.status(500).json({
                message: "Internal error: Could not update learning path order"
              });
            });
        } else
          res.status(500).json({
            message: "Could not find user to update learning path order for"
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "Could not find user to update learning path order for"
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Could not find user to update learning path order for"
        });
      });
  }
});

module.exports = router;

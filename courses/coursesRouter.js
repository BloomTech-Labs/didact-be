const router = require("express").Router();
const axios = require("axios");
const Courses = require("./coursesModel");
const Users = require("../users/usersModel");

router.get("/", (req, res) => {
  //Here is the query and filter check. Should be receiving this info
  //from the search bar on the front-end.
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
      Courses.findByFilter(filter, query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "creator" && query) {
      Courses.findByOwner(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    } else if (filter === "tag" && query) {
      Courses.findByTag(query)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  } else {
    Courses.find()
      .then(response => {
        if (req.body.url) {
          response = response.filter(el => el.link === req.body.url);
          res.status(200).json(response);
        } else if (req.body.tag) {
          findByTag(response, req.body.tag)
            .then(results => {
              res.status(200).json(results);
            })
            .catch(err =>
              res.status(500).json({ message: "Error connecting with server" })
            );
        } else res.status(200).json(response);
      })
      .catch(error => {
        res.status(500).json({ message: "Error connecting with server" });
      });
  }
});

router.get("/allyours", (req, res) => {
  let email = req.user.email;
  //checking if user making request exists in database using the token (email value) on their request header
  Users.findBy({ email })
    .then(user => {
      if (user) {
        //passing user id into model to get courses belonging to user
        Courses.findAllCoursesForUser(user.id)
          .then(response => {
            if (response.code === 404)
              res.status(404).json({ message: response.message });
            else res.status(200).json(response);
          })
          .catch(error => {
            res.status(500).json({ message: "Could not get all courses" });
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to get all courses for" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", validateCourse, (req, res) => {
  const course = req.body;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.add(user.id, course)
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

router.post("/checkdb", (req, res) => {
  let email = req.user.email;
  if (!req.body.link) res.status(400).json({ message: "link is required" });
  else {
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Courses.checkDbForCourseUrl(req.body.link)
            .then(response => {
              res
                .status(200)
                .json({ courseFound: response.courseFound, id: response.id });
            })
            .catch(error => {
              res.status(500).json({ message: "Could not get courses" });
            });
        } else
          res
            .status(500)
            .json({ message: "Could not find user to get courses for" });
      })
      .catch(err => {
        res.status(500).json({ message: "Could not find user" });
      });
  }
});

router.put("/:id", (req, res) => {
  if (!req.body.changes)
    res.status(400).json({ message: "Missing course changes" });
  else {
    const changes = req.body.changes;
    let email = req.user.email;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Courses.updateCourseById(user, req.params.id, changes)
            .then(response => {
              if (response.code === 404)
                res.status(404).json({ message: response.message });
              else if (response.code === 403)
                res.status(403).json({ message: response.message });
              else res.status(200).json({ message: "course updated" });
            })
            .catch(error => {
              res.status(500).json({ message: "Could not edit course" });
            });
        } else
          res
            .status(500)
            .json({ message: "Could not find user to edit course for" });
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Could not find user to edit course for" });
      });
  }
});

router.put("/all/:id", (req, res) => {
  if (!req.body.changes)
    res.status(400).json({ message: "Missing course changes" });
  else {
    const changes = req.body.changes;
    const courseId = req.params.id;
    let email = req.user.email;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Courses.updateCourseById(user, courseId, changes)
            .then(response => {
              if (response.code === 404)
                res.status(404).json({ message: response.message });
              else res.status(200).json({ message: "course updated" });
            })
            .catch(error => {
              res.status(500).json({ message: "Could not edit course" });
            });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "Could not find user to edit course for" });
      });
  }
});

router.put("/:id/togglecomplete", (req, res) => {
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.manualCourseCompleteToggle(user.id, courseId)
          .then(updateRes => {
            if (updateRes.code === 200)
              res.status(200).json({ message: updateRes.message });
            else
              res.status(updateRes.code).json({ message: updateRes.message });
          })
          .catch(err =>
            res.status(500).json({
              message: "Internal Error: Could not toggle course completion"
            })
          );
      } else
        res
          .status(500)
          .json({ message: "Could not find user to update course for" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to update course for" })
    );
});

router.delete("/:id", (req, res) => {
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.deleteCourseById(user, req.params.id)
          .then(response => {
            if (response.code === 404)
              res.status(404).json({ message: response.message });
            else if (response.code === 403)
              res.status(403).json({ message: response.message });
            else res.status(200).json({ message: "course deleted" });
          })
          .catch(error => {
            res.status(500).json({ message: "Could not delete course" });
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to delete course for" });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Could not find user to delete course for" });
    });
});

router.get("/:id/yours", (req, res) => {
  const id = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.findYoursById(user.id, id)
          .then(response => {
            if (response.code === 404)
              res.status(404).json({ message: response.message });
            else res.status(200).json(response);
          })
          .catch(error => {
            res.status(500).json({ message: "Error connecting with server" });
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to get course for" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Courses.findById(id)
    .then(response => {
      if (response.code === 404)
        res.status(404).json({ message: response.message });
      else res.status(200).json(response.course);
    })
    .catch(error => {
      res.status(500).json({ message: "Error connecting with server" });
    });
});

function validateCourse(req, res, next) {
  if (!req.body) res.status(400).json({ message: "Missing course data" });
  else if (!req.body.title)
    res.status(400).json({ message: "Course title is required" });
  else next();
}

router.post("/:id/tags", (req, res) => {
  const courseId = req.params.id;
  let email = req.user.email;
  if (!req.body.tag) res.status(400).json({ message: "Missing tag data" });
  else {
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Courses.addCourseTag(user, courseId, req.body.tag)
            .then(response => {
              if (response.code === 201)
                res.status(201).json({ message: response.message });
              else
                res.status(response.code).json({ message: response.message });
            })
            .catch(error => {
              res.status(500).json({
                message: "Internal error: Could not add tags to course"
              });
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
  }
});

router.delete("/:id/tags", (req, res) => {
  if (!req.body.tag) {
    res.status(400).json({ message: "Missing tag data" });
  } else {
    const courseId = req.params.id;
    let email = req.user.email;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Courses.deleteCourseTag(user, courseId, req.body.tag)
            .then(response => {
              if (response.code === 200)
                res.status(200).json({ message: response.message });
              else
                res.status(response.code).json({ message: response.message });
            })
            .catch(error => {
              res.status(500).json({
                message: "Internal error: Could not remove tags from course"
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

router.get("/:id/sections", (req, res) => {
  const courseId = req.params.id;
  Courses.findById(courseId)
    .then(response => {
      if (response.code === 200) {
        Courses.findCourseSectionsByCourseId(courseId)
          .then(sections => res.status(200).json({ sections }))
          .catch(err => {
            res.status(500).json(err);
          });
      } else {
        res.status(404).json({
          message: `could not find a course with an id of ${courseId}`
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id/yoursections", (req, res) => {
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.findById(courseId)
          .then(response => {
            if (response.code === 200) {
              Courses.findYourCourseSectionsByCourseId(user.id, courseId)
                .then(sections => res.status(200).json({ sections }))
                .catch(err => {
                  res.status(500).json(err);
                });
            } else {
              res.status(404).json({
                message: `could not find a course with an id of ${courseId}`
              });
            }
          })
          .catch(err => {
            res.status(500).json(err);
          });
      } else
        res
          .status(500)
          .json({ message: "Could not find user to get section for" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/:id/sections", (req, res) => {
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        if (!req.body.section)
          res.status(400).json({ message: "Could not find section in body" });
        else {
          let section = req.body.section;
          section.course_id = req.params.id;
          Courses.addCourseSection(user, courseId, section)
            .then(response => {
              if (response.code === 201) {
                res.status(201).json({
                  message: `Section has been added`,
                  id: response.message
                });
              } else {
                res.status(403).json({ message: response.message });
              }
            })
            .catch(err => {
              res.status(500).json(err);
            });
        }
      } else
        res
          .status(500)
          .json({ message: "Could not find user to add section for" });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Could not find user to add section for" });
    });
});

router.put("/:id/sections/:section_id", (req, res) => {
  const sectionId = req.params.section_id;
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        if (!req.body.changes)
          res.status(400).json({ message: "Could not find section in body" });
        else {
          Courses.updateCourseSection(
            user,
            courseId,
            sectionId,
            req.body.changes
          )
            .then(updateRes => {
              updateRes === 0
                ? res.status(404).json({
                    message: `Section not found with id of ${sectionId}`
                  })
                : updateRes.code === 200
                ? res.status(200).json({ message: `Section has been updated` })
                : res.status(403).json({ message: updateRes.message });
            })
            .catch(err => res.status(500).json(err));
        }
      } else
        res
          .status(500)
          .json({ message: "Could not find user to update section for" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to update section for" })
    );
});

router.put("/:id/sections/:section_id/togglecomplete", (req, res) => {
  const sectionId = req.params.section_id;
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.manualSectionCompleteToggle(user.id, courseId, sectionId)
          .then(updateRes => {
            if (updateRes.code === 200)
              res.status(200).json({ message: updateRes.message });
            else
              res.status(updateRes.code).json({ message: updateRes.message });
          })
          .catch(err =>
            res.status(500).json({
              message: "Internal Error: Could not toggle section completion"
            })
          );
      } else
        res
          .status(500)
          .json({ message: "Could not find user to update section for" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to update section for" })
    );
});

router.delete("/:id/sections/:section_id", (req, res) => {
  const sectionId = req.params.section_id;
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.deleteCourseSection(user, courseId, sectionId)
          .then(deleteRes => {
            deleteRes === 0
              ? res.status(404).json({
                  message: `Section not found with id of ${sectionId}`
                })
              : deleteRes.code === 200
              ? res.status(200).json({ message: `Section has been deleted` })
              : res.status(403).json({ message: deleteRes.message });
          })
          .catch(err => res.status(500).json(err));
      } else
        res
          .status(500)
          .json({ message: "Could not find user to delete section for" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to delete section for" })
    );
});

router.get("/:id/sections/:s_id", (req, res) => {
  const courseSectionsId = req.params.s_id;
  Courses.findSectionDetailsByCourseSectionsId(courseSectionsId)
    .then(courseSection => {
      res.status(200).json({ courseSection });
    })
    .catch(err => res.status(500).json(err));
});

router.get("/:id/yoursections/:s_id", (req, res) => {
  const courseSectionsId = req.params.s_id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.getLessonsWithUserCompletion(user.id, courseSectionsId)
          .then(courseSection => {
            res.status(200).json({ courseSection });
          })
          .catch(err => res.status(500).json(err));
      } else
        res
          .status(500)
          .json({ message: "Could not find user to get section for" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to get section for" })
    );
});

router.post("/:id/sections/:s_id", (req, res) => {
  const courseSectionsId = req.params.s_id;
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        if (!req.body.details)
          res.status(400).json({ message: "Could not find details in body" });
        else {
          const details = req.body.details;
          details.course_sections_id = courseSectionsId;
          Courses.addSectionDetails(user, courseId, details)
            .then(response => {
              if (response.code === 200) {
                res.status(201).json({
                  message: `Section Detail has been added`,
                  id: response.message
                });
              } else {
                res.status(403).json({ message: response.message });
              }
            })
            .catch(err => res.status(500).json(err));
        }
      } else
        res
          .status(500)
          .json({ message: "Could not find user to add lesson for" });
    })
    .catch(err =>
      res.status(500).json({ message: "Could not find user to add lesson for" })
    );
});

router.put("/:id/sections/:section_id/details/:detail_id", (req, res) => {
  const courseId = req.params.id;
  const sectionId = req.params.section_id;
  const detailId = req.params.detail_id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        if (!req.body.changes)
          res.status(400).json({ message: "Could not find changes in body" });
        else {
          Courses.updateSectionDetails(
            user,
            courseId,
            sectionId,
            detailId,
            req.body.changes
          )
            .then(updateRes => {
              updateRes.message === 0
                ? res.status(404).json({
                    message: `Detail ${detailId} not found in Section ${sectionId}`
                  })
                : updateRes.code === 200
                ? res
                    .status(200)
                    .json({ message: `Section Detail has been updated` })
                : res.status(403).json({ message: updateRes.message });
            })
            .catch(err => res.status(500).json(err));
        }
      } else
        res
          .status(500)
          .json({ message: "Could not find user to update lesson for" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to update lesson for" })
    );
});

router.delete("/:id/sections/:section_id/details/:detail_id", (req, res) => {
  const detailId = req.params.detail_id;
  const sectionId = req.params.section_id;
  const courseId = req.params.id;
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      if (user) {
        Courses.deleteSectionDetails(user, courseId, sectionId, detailId)
          .then(deleteRes => {
            deleteRes.message === 0
              ? res.status(404).json({
                  message: `Detail ${detailId} not found in Section ${sectionId}`
                })
              : deleteRes.code === 200
              ? res.status(200).json({ message: `Detail has been deleted` })
              : res.status(403).json({ message: deleteRes.message });
          })
          .catch(err => res.status(500).json(err));
      } else
        res
          .status(500)
          .json({ message: "Could not find user to delete lesson for" });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to delete lesson for" })
    );
});

router.put(
  "/:id/sections/:section_id/details/:detail_id/togglecomplete",
  (req, res) => {
    const courseId = req.params.id;
    const sectionId = req.params.section_id;
    const detailId = req.params.detail_id;
    let email = req.user.email;
    Users.findBy({ email })
      .then(user => {
        if (user) {
          Courses.manualLessonCompleteToggle(
            user.id,
            courseId,
            sectionId,
            detailId
          )
            .then(updateRes => {
              if (updateRes.code === 200)
                res.status(200).json({ message: updateRes.message });
              else
                res.status(updateRes.code).json({ message: updateRes.message });
            })
            .catch(err =>
              res.status(500).json({
                message: "Internal Error: Could not toggle lesson completion"
              })
            );
        } else
          res
            .status(500)
            .json({ message: "Could not find user to update lesson for" });
      })
      .catch(err =>
        res
          .status(500)
          .json({ message: "Could not find user to update lesson for" })
      );
  }
);

module.exports = router;

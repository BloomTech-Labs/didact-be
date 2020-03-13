const router = require("express").Router();
const axios = require("axios");
const {
  linkPresent,
  checkDbForLink,
  checkForUdemyLink
} = require("../utils/checkCourseLink");

const Courses = require("./coursesModel");
const Users = require("../users/usersModel");

router.post("/", linkPresent, checkDbForLink, checkForUdemyLink, (req, res) => {
  // First we make sure the user is valid.
  let email = req.user.email;
  Users.findBy({ email })
    .then(user => {
      const userId = user.id;
      let link = req.body.link;
      const config = {
        headers: {
          // 'Content-Type': 'application/json',
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36"
        }
      };
      // Then we get the web page, and parse it for the course id.
      axios
        .get(link, config)
        .then(response => {
          let courseId = response.data.match(/course-id=\"(\d+)/)[1];

          const config2 = {
            headers: {
              "Content-Type": "application/json",
              YOUR_CLIENT_ID: process.env.YOUR_CLIENT_ID,
              YOUR_CLIENT_SECRET: process.env.YOUR_CLIENT_SECRET
            }
          };

          // let link = `https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/?page=${page}&page_size=100`
          let pubCurlink = `https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/`;

          // Then we go to the page, and get all of the results (sections, lessons)
          getPublicCurriculum(pubCurlink, config2)
            .then(results => {
              // If that worked, proceed
              if (results) {
                // Now we get instructors and title for the course.
                getCoursesDetail(courseId).then(details => {
                  if (details) {
                    // Then, we send it to the model, for insertion into the DB, and send it to the user.
                    // res.status(200).json(results)
                    Courses.generateUdemyCourse(userId, link, results, details)
                      .then(course => res.status(200).json(course))
                      // .then(course => res.status(201).json(course))
                      .catch(err =>
                        res.status(500).json({
                          message: "internal error, could not add course"
                        })
                      );
                  } else
                    res.status(500).json({
                      message: "error: could not retrieve course details"
                    });
                });
              } else
                res
                  .status(500)
                  .json({ message: "error: could not retrieve course" });
            })
            .catch(err => {
              res
                .status(500)
                .json({ message: "error: could not retrieve course" });
            });
        })
        .catch(err => {
          res.status(500).json(err);
        });
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: "Could not find user to add Udemy course for" })
    );
});

async function getPublicCurriculum(link, config2) {
  try {
    let response = await axios.get(`${link}?page=1&page_size=1`);
    let maxPages = Math.min(10, Math.ceil(response.data.count / 100));
    let results = [];
    let detResponse;
    for (let i = 1; i <= maxPages; i++) {
      detResponse = await axios.get(`${link}?page=${i}&page_size=100`);
      results = results.concat(detResponse.data.results);
    }
    return results;
  } catch (err) {
    res.status(500).json({ message: "Couldn't get details for course" });
    return 0;
  }
}

async function getCoursesDetail(id) {
  try {
    let response = await axios.get(
      `https://www.udemy.com/api-2.0/courses/${id}`
    );
    let instructors = response.data.visible_instructors.map(
      el => el.display_name
    );
    let courseTitle = response.data.title;
    return { instructors, courseTitle };
  } catch (err) {
    res.status(500).json({ message: "Couldn't get details for course" });
    return 0;
  }
}

module.exports = router;

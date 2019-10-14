const router = require('express').Router()

const Courses = require('./coursesModel')
const Users = require('../users/usersModel')

/**
 * @api {get} /api/courses Get Courses
 * @apiName GetCourses
 * @apiGroup Courses
 * 
 * @apiHeader {string} Content-Type the type of content being sent
 * @apiHeader {string} token User's token for authorization
 * 
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "Content-Type": "application/json",
 *  "authorization": "sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg"
 * }
 * 
 * @apiSuccess (200) {Array} Courses An array of the courses on the website
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  [
 *      {
 *          "id": 1,
 *          "name": "Learning How to Learn: Powerful mental tools to help you master tough subjects",
 *          "link": "https://www.coursera.org/learn/learning-how-to-learn",
 *          "description": "This course gives you easy access to the invaluable learning techniques used by experts in art, music, literature, math, science, sports, and many other disciplines. We’ll learn about the how the brain uses two very different learning modes and how it encapsulates (“chunks”) information. We’ll also cover illusions of learning, memory techniques, dealing with procrastination, and best practices shown by research to be most effective in helping you master tough subjects.\n\nUsing these approaches, no matter what your skill levels in topics you would like to master, you can change your thinking and change your life. If you’re already an expert, this peep under the mental hood will give you ideas for: turbocharging successful learning, including counter-intuitive test-taking tips and insights that will help you make the best use of your time on homework and problem sets. If you’re struggling, you’ll see a structured treasure trove of practical techniques that walk you through what you need to do to get on track. If you’ve ever wanted to become better at anything, this course will help serve as your guide.",
 *          "category": null,
 *          "creator_id": 1,
 *          "foreign_rating": "4.8 stars",
 *          "foreign_instructors": "Dr. Barbara Oakley, Dr. Terrence Sejnowski"
 *        }
 *  ]
 * }
 * 
 * @apiError (401) {Object} bad-request-error The authorization header is absent
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Forbidden Access!"
 * }
 * 
 * @apiError (401) {Object} bad-request-error The authorization is invalid
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Invalid Credentials"
 * }
 * 

 * @apiError (500) {Object} internal-server-error Could not retrieve courses
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Error connecting with server"
 * }
 * 
 */

router.get('/', (req, res) => {
    Courses.find()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({ message: 'Error connecting with server' })
        })
})

/**
 * @api {get} /api/courses/:id Get Course by ID
 * @apiName GetCourseByID
 * @apiGroup Courses
 * 
 * @apiHeader {string} Content-Type the type of content being sent
 * @apiHeader {string} token User's token for authorization
 * 
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "Content-Type": "application/json",
 *  "authorization": "sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg"
 * }
 * 
 * @apiSuccess (200) {object} Course An object of the course matching the id param
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     "id": 1,
 *     "name": "Learning How to Learn: Powerful mental tools to help you master tough subjects",
 *     "link": "https://www.coursera.org/learn/learning-how-to-learn",
 *     "description": "This course gives you easy access to the invaluable learning techniques used by experts in art, music, literature, math, science, sports, and many other disciplines. We’ll learn about the how the brain uses two very different learning modes and how it encapsulates (“chunks”) information. We’ll also cover illusions of learning, memory techniques, dealing with procrastination, and best practices shown by research to be most effective in helping you master tough subjects.\n\nUsing these approaches, no matter what your skill levels in topics you would like to master, you can change your thinking and change your life. If you’re already an expert, this peep under the mental hood will give you ideas for: turbocharging successful learning, including counter-intuitive test-taking tips and insights that will help you make the best use of your time on homework and problem sets. If you’re struggling, you’ll see a structured treasure trove of practical techniques that walk you through what you need to do to get on track. If you’ve ever wanted to become better at anything, this course will help serve as your guide.",
 *     "category": null,
 *     "creator_id": 1,
 *     "foreign_rating": "4.8 stars",
 *     "foreign_instructors": "Dr. Barbara Oakley, Dr. Terrence Sejnowski"
 *  }
 * 
 * @apiError (401) {Object} bad-request-error The authorization header is absent
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Forbidden Access!"
 * }
 * 
 * @apiError (401) {Object} bad-request-error The authorization is invalid
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Invalid Credentials"
 * }
 * 
 * @apiError (404) {Object} Course-Not-Found The course isn't in the database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Course Not Found
 * {
 *  "message": "No course found with that ID"
 * }
 * 
 * @apiError (500) {Object} internal-server-error Could not retrieve course
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Error connecting with server"
 * }
 * 
 */

router.get('/:id', (req, res) => {
    const id = req.params.id
    Courses.findById(id)
        .then(response => {
            if(response.code === 404) res.status(404).json({message: response.message})
            else res.status(200).json(response.course)
        })
        .catch(error => {
            res.status(500).json({ message: 'Error connecting with server' })
        })
})


/**
 * @api {post} /api/courses Post Course
 * @apiName PostCourse
 * @apiGroup Courses
 * 
 * @apiHeader {string} Content-Type the type of content being sent
 * @apiHeader {string} token User's token for authorization
 * 
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "Content-Type": "application/json",
 *  "authorization": "sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg"
 * }
 * 
 * @apiSuccess (201) {object} Course An object of the course that the user posted
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *  {
 *     "id": 2
 *  }
 * 
 * @apiError (400) {Object} Missing-Course-Data The course data is absent
 * 
 * @apiErrorExample 400-Course-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing course data"
 * }
 * 
 * @apiError (400) {Object} Missing-Course-Name The course name is absent
 * 
 * @apiErrorExample 400-Name-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Course name is required"
 * }
 * 
 * @apiError (401) {Object} bad-request-error The authorization header is absent
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Forbidden Access!"
 * }
 * 
 * @apiError (401) {Object} bad-request-error The authorization is invalid
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Invalid Credentials"
 * }
 * 
 * @apiError (500) {Object} Find-User-Error Could not find user to add course for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to add course for"
 * }
 * 
 * @apiError (500) {Object} Add-Course-Error Could not add course
 * 
 * @apiErrorExample 500-Course-Add-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not add course"
 * }
 * 
 */

router.post('/', validateCourse, (req, res) => {
    const course = req.body
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
            {
                if(user)
                {
                    Courses.add(user.id, course)
                        .then(response => {
                            res.status(201).json({id: response[0]})
                        })
                        .catch(error => {
                            res.status(500).json({ message: 'Could not add course' })
                        })
                }
                else res.status(500).json({ message: 'Could not find user to add course for' })
            })
        .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to add course for' })
            })

})

/**
 * @api {put} /api/courses/:id Edit Course
 * @apiName EditCourse
 * @apiGroup Courses
 * 
 * @apiHeader {string} Content-Type the type of content being sent
 * @apiHeader {string} token User's token for authorization
 * 
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "Content-Type": "application/json",
 *  "authorization": "sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg"
 * }
 * 
 * @apiSuccess (200) {object} Course An object of the course that the user edited
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     "id": 2
 *  }
 * 
 * @apiError (400) {Object} Missing-Course-Data The course data is absent
 * 
 * @apiErrorExample 400-Course-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing course data"
 * }
 * 
 * @apiError (401) {Object} bad-request-error The authorization header is absent
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Forbidden Access!"
 * }
 * 
 * 
 * @apiError (401) {Object} bad-request-error The authorization is invalid
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Invalid Credentials"
 * }
 * 
 * @apiError (403) {Object} bad-request-error The user is not authorized to edit this course
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to change this course"
 * }
 * 
 * @apiError (500) {Object} Find-User-Error Could not find user to edit course for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to edit course for"
 * }
 * 
 * @apiError (500) {Object} Edit-Course-Error Could not edit course
 * 
 * @apiErrorExample 500-Course-Add-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not edit course"
 * }
 * 
 */

router.put('/:id', (req, res) => {
    if(!req.body.changes) res.status(400).json({ message: 'Missing course changes' })
    const changes = req.body.changes
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
            {
                if(user)
                {
                    Courses.updateByCourseId(user.id, changes)
                        .then(response => {
                            res.status(201).json({id: response[0]})
                        })
                        .catch(error => {
                            res.status(500).json({ message: 'Could not add course' })
                        })
                }
                else res.status(500).json({ message: 'Could not find user to add course for' })
            })
        .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to add course for' })
            })

})

function validateCourse(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "Missing course data"})
    else if(!req.body.name) res.status(400).json({ message: "Course name is required"})
    else next()
}

module.exports = router
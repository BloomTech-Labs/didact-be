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
 * @apiParam {String} url The link of the course you want to find (optional)
 * 
 * @apiParamExample {json} Get Course By URL
 * {
 * 	"url": "https://www.coursera.org/learn/learning-how-to-learn"
 * }
 * 
 * @apiParam {String} tag An tag to filter the courses you want to find (optional)
 * 
 * @apiParamExample {json} Get Courses By Tag
 * {
 * 	"tag": "Something else"
 * }
 * 
 * @apiSuccess (200) {Array} Courses An array of the courses on the website, optionally filtered by url sent in body
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 
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
 * 
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

async function filterByTag(aCourses, tag)
{
    let retArr = []
    for(let i=0; i<aCourses.length; i++)
    {
        let tags = await Courses.getTagsForCourse(aCourses[i].id)
        tags = tags.map(el => el.toLowerCase())
        if(tags.includes(tag.toLowerCase()))  await retArr.push(aCourses[i])
    }
    return retArr
}

router.get('/', (req, res) => {
    Courses.find()
        .then(response => {
            if(req.body.url) 
            {
                response = response.filter(el => el.link === req.body.url)
                res.status(200).json(response)
            }
            else if(req.body.tag) 
            {
                filterByTag(response, req.body.tag)
                    .then(results =>
                        {
                            res.status(200).json(results)
                        })
                    .catch(err => res.status(500).json({ message: 'Error connecting with server' }))
            }
            else res.status(200).json(response)
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
 * @apiParam {String} name The name of the course you want to create
 * @apiParam {String} description The description of the course you want to create
 * @apiParam {String} link The link of the course you want to create

 * 
 * @apiParamExample {json} Course-Post-Example:
 * { 
 * 	 "name": "Learn How to Write Docs",
 * 	 "description": "In this course, you will learn the tedium of writing docs.",
 * 	 "link": "http://apidocjs.com/",
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
 * @apiSuccess (200) {Object} Success A message that the course was updated
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     "message": "course updated"
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
 * @apiError (404) {Object} not-found-error The course with id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No course found with that ID"
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
 * @apiErrorExample 500-Course-Edit-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not edit course"
 * }
 * 
 */

router.put('/:id', (req, res) => {
    if(!req.body.changes) res.status(400).json({ message: 'Missing course changes' })
    else
    {
        const changes = req.body.changes
        let email = req.user.email
        Users.findBy({ email })
        .then(user =>
            {
                if(user)
                {
                    Courses.updateCourseById(user.id, req.params.id, changes)
                        .then(response => {
                            if(response.code === 404) res.status(404).json({message: response.message})
                            else if(response.code === 403) res.status(403).json({message: response.message})
                            else res.status(200).json({ message: 'course updated' })
                        })
                        .catch(error => {
                            res.status(500).json({ message: 'Could not edit course' })
                        })
                }
                else res.status(500).json({ message: 'Could not find user to edit course for' })
            })
        .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to edit course for' })
            })
    }
})

/**
 * @api {delete} /api/courses/:id delete Course
 * @apiName DeleteCourse
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
 * @apiSuccess (200) {Object} Success A message that the course was deleted
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     "message": "course deleted"
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
 * @apiError (403) {Object} bad-request-error The user is not authorized to delete this course
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to change this course"
 * }
 * 
 * @apiError (404) {Object} not-found-error The course with id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No course found with that ID"
 * }
 * 
 * @apiError (500) {Object} Find-User-Error Could not find user to delete course for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to delete course for"
 * }
 * 
 * @apiError (500) {Object} Delete-Course-Error Could not delete course
 * 
 * @apiErrorExample 500-Course-Delete-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not delete course"
 * }
 * 
 */

router.delete('/:id', (req, res) => {

    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
        {
            if(user)
            {
                Courses.deleteCourseById(user.id, req.params.id)
                    .then(response => {
                        if(response.code === 404) res.status(404).json({message: response.message})
                        else if(response.code === 403) res.status(403).json({message: response.message})
                        else res.status(200).json({ message: 'course deleted' })
                    })
                    .catch(error => {
                        res.status(500).json({ message: 'Could not delete course' })
                    })
            }
            else res.status(500).json({ message: 'Could not find user to delete course for' })
        })
    .catch(err =>
        {
            res.status(500).json({ message: 'Could not find user to delete course for' })
        })
})

function validateCourse(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "Missing course data"})
    else if(!req.body.name) res.status(400).json({ message: "Course name is required"})
    else next()
}

/**
 * @api {post} /api/courses/:id/tags Post Tags To Course
 * @apiName PostTagsToCourse
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
 * @apiParam {Array} tags The names of the tags you want to create/add for the course
 * 
 * @apiParamExample {json} Tags Post Example:
 * { 
        tags: ['Learning', 'self teaching', 'something else']
 * }
 * 
 * @apiSuccess (201) {string} Message A message that the tags were added
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *  {
 *     message: 'tags added to course'
 *  }
 * 
 * @apiError (400) {Object} Missing-Tags-Data The tags data is absent
 * 
 * @apiErrorExample 400 Tags Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing tags data"
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
 * @apiError (403) {Object} bad-request-error The user is not authorized to add tags to this course
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to change this course"
 * }
 * 
 * @apiError (404) {Object} not-found-error The course with id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No course found with that ID"
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
 * @apiErrorExample 500-Tag-Add-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal error: could not add tags to course"
 * }
 * 
 */

router.post('/:id/tags', (req, res) => {
    const courseId = req.params.id
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
            {
                if(user)
                {
                    Courses.addCourseTags(user.id, courseId, req.body.tags)
                        .then(response => 
                            {
                                if(response.code === 201) res.status(201).json({ message: response.message })
                                else res.status(response.code).json({ message: response.message })
                            })
                        .catch(error => {
                            console.log(error)
                            res.status(500).json({ message: 'Internal error: Could not add tags to course' })
                        })
                }
                else res.status(500).json({ message: 'Could not find user to add course for' })
            })
        .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to add course for' })
            })

})

router.get('/:id/details', (req, res) => {
    const courseId = req.params.id
    Courses.findCourseDetailsByCourseId(courseId)
        .then(details => {
            res.status(200).json({details})
        })
})

router.get('/:id/details/:d_id', (req, res) => {
    const courseDetailsId = req.params.d_id
    Courses.findSectionDetailsByCourseDetailsId(courseDetailsId)
        .then(sectionDetails => {
            res.status(200).json({sectionDetails})
        })
})

module.exports = router
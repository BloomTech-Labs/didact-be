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
 * @api {delete} /api/courses/:id Delete Course
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
 * @api {post} /api/courses/:id/tags Post Tag To Course
 * @apiName PostTagToCourse
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
 * @apiParam {Object} tag The name of the tag you want to create/add for the course
 * 
 * @apiParamExample {json} Tag Post Example:
 * { 
        tag: 'Learning'
 * }
 * 
 * @apiSuccess (201) {string} Message A message that the tag was added
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *  {
 *     message: 'tag added to course'
 *  }
 * 
 * @apiError (400) {Object} Missing-Tag-Data The tag data is absent
 * 
 * @apiErrorExample 400 Tag Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing tag data"
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
 * @apiError (403) {Object} bad-request-error The user is not authorized to add tag to this course
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to add tags to this course"
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
 * @apiError (500) {Object} Find-User-Error Could not find user to add tag for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to add tag for"
 * }
 * 
 * @apiError (500) {Object} Add-Tag-Error Could not add tag
 * 
 * @apiErrorExample 500-Tag-Add-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal error: could not add tag to course"
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
                    Courses.addCourseTag(user.id, courseId, req.body.tag)
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

/**
 * @api {delete} /api/courses/:id/tags Delete Tag From Course
 * @apiName DeleteTagFromCourse
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
 * @apiParam {Object} tag The name of the tag you want to delete from the course
 * 
 * @apiParamExample {json} Tag Delete Example:
 * { 
        tag: 'Learning'
 * }
 * 
 * @apiSuccess (200) {string} Message A message that the tag was removed
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     message: 'tag removed from course'
 *  }
 * 
 * @apiError (400) {Object} Missing-Tag-Data The tag data is absent
 * 
 * @apiErrorExample 400 Tag Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing tag data"
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
 * @apiError (403) {Object} bad-request-error The user is not authorized to remove tag from this course
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to remove tags from this course"
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
 * @apiError (404) {Object} tag-not-found-error The tag with the name sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Tag not found"
 * }
 * 
 * @apiError (500) {Object} Find-User-Error Could not find user to remove tag for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to remove tag for"
 * }
 * 
 * @apiError (500) {Object} Add-Course-Error Could not remove tag
 * 
 * @apiErrorExample 500-Tag-Remove-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal error: could not remove from course"
 * }
 * 
 */

router.delete('/:id/tags', (req, res) => {
    if(!req.body.tag)
    {
        res.status(400).json({ message: "Missing tag data" })
    }
    else
    {
        const courseId = req.params.id
        let email = req.user.email
        Users.findBy({ email })
            .then(user =>
                {
                    if(user)
                    {
                        Courses.deleteCourseTag(user.id, courseId, req.body.tag)
                        .then(response => 
                            {
                                if(response.code === 200) res.status(200).json({ message: response.message })
                                else res.status(response.code).json({ message: response.message })
                            })
                        .catch(error => 
                            {
                                console.log(error)
                                res.status(500).json({ message: 'Internal error: Could not remove tags from course' })
                            })
                    }
                    else res.status(500).json({ message: 'Could not find user to remove tag for' })
                })
            .catch(err =>
                {
                    res.status(500).json({ message: 'Could not find user to remove tag for' })
                })
    }
})


/**
 * @api {get} /api/courses/:id/sections Get Course Sections
 * @apiName GetCourseSections
 * @apiGroup Sections
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
 * @apiSuccess (200) {Array} Sections an array of the course sections
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "sections": [
 *         {
 *             "id": 1,
 *             "name": "What is Learning number 24?",
 *             "course_id": 1,
 *             "description": "Although living brains are very complex, this module uses metaphor and analogy to help simplify matters. You will discover several fundamentally different modes of thinking, and how you can use these modes to improve your learning. You will also be introduced to a tool for tackling procrastination, be given some practical information about memory, and discover surprisingly useful insights about learning and sleep. <br><br>(Please note that this module should only take about an hour--the extra time quoted relates to purely optional activities.)",
 *             "link": "https://www.coursera.org/learn/learning-how-to-learn/home/week/2",
 *             "order": 2
 *         }
 *     ]
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
 * @apiError (404) {Object} not-found-error could not find a course with the passed in id
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "could not find a course with an id of 4"
 * }
 * 
 * @apiError (500) {Object} Find-Section-Error Could not find section to get course for
 * 
 */


router.get('/:id/sections', (req, res) => {
    const courseId = req.params.id
    Courses.findById(courseId)
        .then(response => {
            console.log(response.course)
            if(response.code === 200) {
                Courses.findCourseSectionsByCourseId(courseId)
                .then(sections => res.status(200).json({sections}))
                .catch(err => 
                    {
                        console.log('500 err from get sections', err)
                        res.status(500).json(err)
                    })
            } else {
                res.status(404).json({message: `could not find a course with an id of ${courseId}`})
            }
        })
        .catch(err => 
            {
                console.log(err)
                res.status(500).json(err)
            })
})

/**
 * @api {post} /api/courses/:id/sections Post Course Section
 * @apiName PostCourseSection
 * @apiGroup Sections
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
 * @apiSuccess (201) {Object} Created message with id returned
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *     "message": "Section has been added",
 *     "id": 7
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
 * @apiError (500) {Object} Find-Section-Error Could not find section to get course for
 * 
 */

router.post('/:id/sections', (req, res) => {
    const courseId = req.params.id
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
            {
                if(user)
                {
                    if(!req.body.section) res.status(400).json({message: 'Could not find section in body'})
                    else {
                        let section = req.body.section
                        section.course_id = courseId
                        Courses.addCourseSection(user.id, courseId, section)
                            .then(response => {
                                if(response.code === 201) {
                                    res.status(201).json({ message: `Section has been added`, id: response.message })
                                } else {
                                    res.status(403).json({message: response.message})
                                }
                            })
                            .catch(err => res.status(500).json(err))
                    }
                }
                else res.status(500).json({ message: 'Could not find user to add course for' })
            })
        .catch(err => res.status(500).json({ message: 'Could not find user to add course for' }))
})

/**
 * @api {put} /api/courses/:id/sections/:section_id Put Course Section
 * @apiName PutCourseSection
 * @apiGroup Sections
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
 * @apiSuccess (200) {Object} Updated message
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 Updated
 * {
 *     "message": "Section has been updated"
 * }
 * 
 * @apiError (400) {Object} Missing-Section-Changes The section changes are absent
 * 
 * @apiErrorExample 400-Section-Changes-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Could not find changes in body"
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
 * @apiError (404) {Object} not-found-error could not find a section with the passed in id
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Section not found with id of 4"
 * } 
 * 
 * @apiError (500) {Object} Find-Section-Error Could not find section to get course for
 * 
 */

router.put('/:id/sections/:section_id', (req, res) => {
    const sectionId = req.params.section_id
    const courseId = req.params.id
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
        {
            if(user)
            {
                if(!req.body.changes) res.status(400).json({message: 'Could not find section in body'})
                else {
                    Courses.updateCourseSection(user.id, courseId, sectionId, req.body.changes)
                        .then(updateRes => {
                            updateRes === 0 ? res.status(404).json({message: `Section not found with id of ${sectionId}`}) 
                            : updateRes.code === 200 ? res.status(200).json({message: `Section has been updated`})
                            : res.status(403).json({message: updateRes.message})
                        })
                        .catch(err => res.status(500).json(err))
                }
            }
            else res.status(500).json({ message: 'Could not find user to add course for' })
        })
    .catch(err => res.status(500).json({ message: 'Could not find user to add course for' }))

})

/**
 * @api {delete} /api/courses/:id/sections/:section_id Delete Course Section
 * @apiName DeleteCourseSection
 * @apiGroup Sections
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
 * @apiSuccess (200) {Object} Updated message
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200
 * {
 *     "message": "Section has been deleted"
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
 * @apiError (404) {Object} not-found-error could not find a section with the passed in id
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Section not found with id of 4"
 * } 
 * 
 * @apiError (500) {Object} Find-Section-Error Could not find section to get course for
 * 
 */

router.delete('/:id/sections/:section_id', (req, res) => {
    const sectionId = req.params.section_id
    const courseId = req.params.id
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
        {
            if(user)
            {
                Courses.deleteCourseSection(user.id, courseId, sectionId)
                    .then(deleteRes => {
                        deleteRes === 0 ? res.status(404).json({message: `Section not found with id of ${sectionId}`}) 
                        : deleteRes.code === 200 ? res.status(200).json({message: `Section has been deleted`})
                        : res.status(403).json({message: deleteRes.message})
                    })
                    .catch(err => res.status(500).json(err))
            }
            else res.status(500).json({ message: 'Could not find user to add course for' })
        })
    .catch(err => res.status(500).json({ message: 'Could not find user to add course for' }))

})

/**
 * @api {get} /api/courses/:id/sections/:s_id Get Section Details
 * @apiName GetSectionDetails
 * @apiGroup Details
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
 * @apiSuccess (200) {Array} Sections an array of the course sections
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     
 *   {
 *       "courseSection": [
 *           {
 *               "id": 59,
 *               "name": "How to Become a Better Learner",
 *               "course_sections_id": 4,
 *               "description": "",
 *               "link": "https://www.coursera.org/learn/learning-how-to-learn/lecture/f839b/how-to-become-a-better-learner",
 *               "type": "video",
 *               "order": 1
 *           },
 *           {
 *               "id": 60,
 *               "name": "Introduction to Renaissance Learning and Unlocking Your Potential",
 *               "course_sections_id": 4,
 *               "description": "",
 *               "link": "https://www.coursera.org/learn/learning-how-to-learn/lecture/SIck3/introduction-to-renaissance-learning-and-unlocking-your-potential",
 *               "type": "video",
 *               "order": 2
 *           }
 *       ]
 *  }
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
 * @apiError (404) {Object} not-found-error could not find a detail with the passed in id
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "could not find a detail with an id of 4"
 * }
 * 
 * @apiError (500) {Object} Find-Section-Error Could not find detail to get course for
 * 
 */


router.get('/:id/sections/:s_id', (req, res) => {
    const courseSectionsId = req.params.s_id
    Courses.findSectionDetailsByCourseSectionsId(courseSectionsId)
        .then(courseSection => {
            res.status(200).json({courseSection})
        }) 
        .catch(err => res.status(500).json(err))
})


/**
 * @api {post} /api/courses/:id/sections/:s_id Post Section Details
 * @apiName PostSectionDetails
 * @apiGroup Details
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
 * @apiSuccess (201) {Object} Created message with id returned
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *     "message": "Detail has been added with an id of 7"
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
 * @apiError (500) {Object} Find-Section-Error Could not post Detail to section
 * 
 */


router.post('/:id/sections/:s_id', (req, res) => {
    const courseSectionsId = req.params.s_id
    const courseId = req.params.id
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
            {
                if(user)
                {
                    if(!req.body.details) res.status(400).json({message: 'Could not find details in body'})
                    else {
                        const details = req.body.details
                        details.course_sections_id = courseSectionsId
                        Courses.addSectionDetails(user.id, courseId, details)
                            .then(response => {
                                if(response.code === 200) {
                                    res.status(201).json({message: `Section Detail has been added`, id: response.message})
                                } else {
                                    res.status(403).json({message: response.message})
                                }
                            })
                            .catch(err => res.status(500).json(err))
                    }
                }
                else res.status(500).json({ message: 'Could not find user to add course for' })
            })
        .catch(err => res.status(500).json({ message: 'Could not find user to add course for' }))
})  


/**
 * @api {put} /api/courses/:id/sections/:section_id/details/:detail_id Put Section Details
 * @apiName PutSectionDetails
 * @apiGroup Details
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
 * @apiSuccess (200) {Object} Updated message
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 Updated
 * {
 *     "message": "Detail has been updated"
 * }
 * 
 * @apiError (400) {Object} Missing-Section-Changes The section changes are absent
 * 
 * @apiErrorExample 400-Section-Changes-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Could not find changes in body"
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
 * @apiError (404) {Object} not-found-error could not find a Detail with the passed in id
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Detail 5 not found in Section 3"
 * } 
 * 
 * @apiError (500) {Object} Find-Section-Error Could not update detail from section
 * 
 */


router.put('/:id/sections/:section_id/details/:detail_id', (req, res) => {
    const courseId = req.params.id
    const sectionId = req.params.section_id
    const detailId = req.params.detail_id
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
            {
                console.log(user)
                if(user)
                {
                    if(!req.body.changes) res.status(400).json({message: 'Could not find changes in body'})
                    else {
                        Courses.updateSectionDetails(user.id, courseId, sectionId, detailId, req.body.changes)
                            .then(updateRes => {
                                updateRes.message === 0 ? res.status(404).json({message: `Detail ${detailId} not found in Section ${sectionId}`}) 
                                : updateRes.code === 200 ? res.status(200).json({message: `Section Detail has been updated`})
                                : res.status(403).json({message: updateRes.message})
                            })
                            .catch(err => res.status(500).json(err))
                    }
                }
                else res.status(500).json({ message: 'Could not find user to update course for' })
            })
        .catch(err => res.status(500).json({ message: 'Could not find user to update course for' }))
    
})

/**
 * @api {delete} /api/courses/:id/sections/:section_id/details/:detail_id Delete Course Section Details
 * @apiName DeleteCourseSectionDetails
 * @apiGroup Details
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
 * @apiSuccess (200) {Object} Updated message
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 
 * {
 *     "message": "Detail has been deleted"
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
 * @apiError (404) {Object} not-found-error could not find a detail with the passed in id
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Detail 2 not found in Section 4"
 * } 
 * 
 * @apiError (500) {Object} Find-Section-Error Could not delete detail from section
 * 
 */


router.delete('/:id/sections/:section_id/details/:detail_id', (req, res) => {
    const detailId = req.params.detail_id
    const sectionId = req.params.section_id
    const courseId = req.params.id
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
            {
                console.log(user)
                if(user)
                {
                    Courses.deleteSectionDetails(user.id, courseId, sectionId, detailId)
                        .then(deleteRes => {
                            deleteRes.message === 0 ? res.status(404).json({message: `Detail ${detailId} not found in Section ${sectionId}`}) 
                            : deleteRes.code === 200 ? res.status(200).json({message: `Detail has been deleted`}) 
                            : res.status(403).json({message: deleteRes.message})
                        })
                        .catch(err => res.status(500).json(err))
                }
                else res.status(500).json({ message: 'Could not find user to delete course for' })
            })
        .catch(err => res.status(500).json({ message: 'Could not find user to delete course for' }))  
})

module.exports = router

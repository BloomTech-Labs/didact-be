const router = require('express').Router()
const Paths = require('./learningPathsModel')
const Users = require('../users/usersModel')

/**
 * @api {get} /api/learning-paths Get Learning Paths
 * @apiName GetLearningPaths
 * @apiGroup Learning Paths
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
 * @apiParam {String} tag An tag to filter the Learning Paths you want to find (optional)
 * 
 * @apiParamExample {json} Get Learning Paths By Tag
 * {
 * 	"tag": "Something else"
 * }
 * 
 * @apiSuccess (200) {Array} Learning Paths An array of the Learning Paths on the website, optionally filtered by url sent in body
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 
 * [
 *   {
 *     "id": 1,
 *     "name": "Onboarding Learning Path",
 *     "description": "This learning path will get you on the road to success.",
 *     "category": "Learning"
 *   }
 * ]
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
 * @apiError (500) {Object} internal-server-error Could not retrieve learning paths
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Error connecting with server"
 * }
 * 
 */

async function filterByTag(aLearningPaths, tag)
{
    let retArr = []
    for(let i=0; i<aLearningPaths.length; i++)
    {
        let tags = await Paths.getTagsForPath(aLearningPaths[i].id)
        tags = tags.map(el => el.toLowerCase())
        if(tags.includes(tag.toLowerCase())) retArr.push(aLearningPaths[i])
    }
    return retArr
}

router.get('/', (req, res) => {
    Paths.find()
    .then(response => 
        {
            if(req.body.tag) 
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
    .catch(error => 
        {
            res.status(500).json({ message: 'Error connecting with server' })
        })
})


/**
 * @api {get} /api/learning-paths/:id Get Learning Path
 * @apiName GetLearningPath
 * @apiGroup Learning Paths
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
 * @apiSuccess (200) {Object} Learning Path An object of the Learning Path
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 
 * {
 *     "id": 1,
 *     "name": "Onboarding Learning Path",
 *     "description": "This learning path will get you on the road to success.",
 *     "category": "Learning"
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
 * @apiError (500) {Object} internal-server-error Could not retrieve learning path
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Error connecting with server"
 * }
 * 
 */

router.get('/:id', (req, res) => {
    Paths.findById(req.params.id)
    .then(response => 
        {
            if(response.code === 404) res.status(404).json({ message: response.message })
            else res.status(200).json(response.path)
        })
    .catch(error => 
        {
            res.status(500).json({ message: 'Error connecting with server' })
        })
})

/**
 * @api {post} /api/courses Post Learning Path
 * @apiName PostLearningPath
 * @apiGroup Learning Paths
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
 * @apiParam {String} name The name of the Learning Path you want to create
 * @apiParam {String} description The description of the Learning Path you want to create
 * @apiParam {String} category The category of the Learning Path you want to create

 * 
 * @apiParamExample {json} Learning Path-Post-Example:
 * { 
 * 	 "name": "Learn How to Write Docs",
 * 	 "description": "In this Learning Path, you will learn the tedium of writing docs.",
 * 	 "category": "Learning",
 * }
 * 
 * @apiSuccess (201) {integer} Id An id of the Learning Path that the user posted
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *  {
 *     "id": 2
 *  }
 * 
 * @apiError (400) {Object} Missing-Learning-Path-Data The Learning Path data is absent
 * 
 * @apiErrorExample 400-Learning Path-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing Learning Path data"
 * }
 * 
 * @apiError (400) {Object} Missing-Learning-Path-Name The Learning Path name is absent
 * 
 * @apiErrorExample 400-Name-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Learning Path name is required"
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
 * @apiError (500) {Object} Find-User-Error Could not find user to add Learning Path for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to add Learning Path for"
 * }
 * 
 * @apiError (500) {Object} Add-Learning Path-Error Could not add Learning Path
 * 
 * @apiErrorExample 500-Learning-Path-Add-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not add Learning Path"
 * }
 * 
 */

function validateLearningPath(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "Missing learning path data"})
    else if(!req.body.name) res.status(400).json({ message: "Learning Path name is required"})
    else next()
}

router.post('/', validateLearningPath, (req, res) => {
    const path = req.body
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            console.log('user.id', user.id)
            Paths.add(user.id, path)
                .then(response => 
                {
                    console.log('b')
                    res.status(201).json({id: response})
                })
                .catch(error => {
                    console.log('a')
                    res.status(500).json({ message: 'Could not add learning path' })
                })
        }
        else res.status(500).json({ message: 'Could not find user to add learning path for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to add learning path for' })
    })
})

/**
 * @api {put} /api/learning-paths/:id Edit Learning Path
 * @apiName EditLearningPath
 * @apiGroup Learning Paths
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
 * @apiSuccess (200) {Object} Success A message that the Learning Path was updated
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     "message": "Learning path updated"
 *  }
 * 
 * @apiError (400) {Object} Missing-Learning-Path-Data The Learning Path data is absent
 * 
 * @apiErrorExample 400-Path-Data-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing Learning Path data"
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
 * @apiError (403) {Object} bad-request-error The user is not authorized to edit this Learning Path
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to change this learning path"
 * }
 * 
 * @apiError (404) {Object} not-found-error The Learning Path with id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No Learning Path found with that ID"
 * }
 * 
 * @apiError (500) {Object} Find-User-Error Could not find user to edit Learning Path for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to edit Learning Path for"
 * }
 * 
 * @apiError (500) {Object} Edit-Learning Path-Error Could not edit Learning Path
 * 
 * @apiErrorExample 500-Learning Path-Edit-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not edit Learning Path"
 * }
 * 
 */

router.put('/:id', (req, res) => {
    if(!req.body.changes) res.status(400).json({ message: 'Missing learning path changes' })
    else
    {
        const changes = req.body.changes
        let email = req.user.email
        Users.findBy({ email })
        .then(user =>
        {
            if(user)
            {
                Paths.updatePathById(user.id, req.params.id, changes)
                .then(response => 
                {
                    if(response.code === 404) res.status(404).json({message: response.message})
                    else if(response.code === 403) res.status(403).json({message: response.message})
                    else res.status(200).json({ message: 'Learning path updated' })
                })
                .catch(error => 
                {
                    res.status(500).json({ message: 'Could not edit learning path' })
                })
            }
            else res.status(500).json({ message: 'Could not find user to edit learning path for' })
        })
        .catch(err =>
        {
            res.status(500).json({ message: 'Could not find user to edit learning path for' })
        })
    }
})

/**
 * @api {delete} /api/learning-paths/:id Delete Learning Path
 * @apiName DeleteLearningPath
 * @apiGroup Learning Paths
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
 * @apiSuccess (200) {Object} Success A message that the learning path was deleted
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     "message": "Learning path deleted"
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
 * @apiError (403) {Object} bad-request-error The user is not authorized to delete this learning path
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to change this learning path"
 * }
 * 
 * @apiError (404) {Object} not-found-error The learning path with id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No learning path found with that ID"
 * }
 * 
 * @apiError (500) {Object} Find-User-Error Could not find user to delete learning path for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to delete learning path for"
 * }
 * 
 * @apiError (500) {Object} Delete-learning path-Error Could not delete learning path
 * 
 * @apiErrorExample 500-learning path-Delete-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not delete learning path"
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
                Paths.deletePathById(user.id, req.params.id)
                    .then(response => {
                        if(response.code === 404) res.status(404).json({message: response.message})
                        else if(response.code === 403) res.status(403).json({message: response.message})
                        else res.status(200).json({ message: 'Learning path deleted' })
                    })
                    .catch(error => {
                        res.status(500).json({ message: 'Could not delete learning path' })
                    })
            }
            else res.status(500).json({ message: 'Could not find user to delete learning path for' })
        })
    .catch(err =>
        {
            res.status(500).json({ message: 'Could not find user to delete learning path for' })
        })
})

module.exports = router

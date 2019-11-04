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
 * @apiParam {Integer} getYours Filters the learning paths by whether or not you're only getting the ones you signed up for.
 * 
 * @apiParamExample {json} Get Learning Paths
 * {
 * 	"getYours": true
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
    if(req.body.getYours)
    {
        let email = req.user.email
        Users.findBy({ email })
        .then(user =>
        {
            if(user)
            {
                Paths.findForUserId(user.id)
                .then(response =>
                {
                    res.status(200).json(response)
                })
                .catch(err =>
                {
                    res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
                })
            }
            else res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
        })
        .catch(err =>
        {
            res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
        })
    }
    else
    {
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
    }
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
 *   "id": 1,
 *   "name": "Onboarding Learning Path",
 *   "description": "This learning path will get you on the road to success.",
 *   "category": "Learning",
 *   "tags": [
 *     "Video",
 *     "Coursera",
 *     "Free"
 *   ],
 *   "courses": [
 *     {
 *       "id": 1,
 *       "name": "Learning How to Learn: Powerful mental tools to help you master tough subjects",
 *       "path_order": 0
 *     }
 *   ],
 *   "pathItems": [
 *     {
 *       "id": 1,
 *       "name": "seed path item",
 *       "path_id": 1,
 *       "description": "temporary seed path item, until we have a better placeholder",
 *       "link": null,
 *       "type": "video",
 *       "path_order": 7
 *     }
 *   ],
 *   "creatorId": 1
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
 * @apiError (404) {Object} not-found-error The Learning Path with id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No Learning Path found with that ID"
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
 * @api {post} /api/learning-paths Post Learning Path
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
 * @apiError (500) {Object} Add-Learning-Path-Error Could not add Learning Path
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
            Paths.add(user.id, path)
                .then(response => 
                {
                    res.status(201).json({id: response})
                })
                .catch(error => {
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
 * @apiError (403) {Object} Unauthorized The user is not authorized to edit this Learning Path
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
 * @apiError (403) {Object} Unauthorized The user is not authorized to delete this learning path
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

/**
 * @api {post} /api/learning-paths/:id/users Join Learning Path
 * @apiName JoinLearningPath
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
 * @apiError (500) {Object} Find-User-Error Could not find user to join to learning path
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to join to learning path"
 * }
 * 
 * @apiError (500) {Object} Join-Learning-Path-Error Could not join learning path
 * 
 * @apiErrorExample 500-Join-Learning-Path-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not join learning path"
 * }
 * 
 */

router.post('/:id/users', (req, res) => {
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.joinLearningPath(user.id, req.params.id)
            .then(response => 
            {
                console.log('b')
                res.status(200).json({ message: 'Joined learning path' })
            })
            .catch(error => {
                console.log('a')
                res.status(500).json({ message: 'Could not join learning path' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to join learning path' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to join learning path' })
    })
})

/**
 * @api {delete} /api/learning-paths/:id/users Quit Learning Path
 * @apiName QuitLearningPath
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
 * @apiSuccess (201) {integer} Id An id of the Learning Path that the user quit
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     "message": "Quit learning path"
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
 * @apiError (500) {Object} Find-User-Error Could not find user to quit to learning path
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to quit to learning path"
 * }
 * 
 * @apiError (500) {Object} quit-Learning-Path-Error Could not quit learning path
 * 
 * @apiErrorExample 500-quit-Learning-Path-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not quit learning path"
 * }
 * 
 */

router.delete('/:id/users', (req, res) => {
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.quitLearningPath(user.id, req.params.id)
            .then(response => 
            {
                console.log('b')
                res.status(200).json({ message: 'Quit learning path' })
            })
            .catch(error => {
                console.log('a')
                res.status(500).json({ message: 'Could not quit learning path' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to quit learning path' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to quit learning path' })
    })
})

/**
 * @api {post} /api/learning-paths/:id/tags Post Tag To Learning Path
 * @apiName PostTagToLearningPath
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
 * @apiParam {Object} tag The name of the tag you want to create/add for the learning path
 * 
 * @apiParamExample {json} Tag Post Example:
 * { 
 *   tag: 'Learning'
 * }
 * 
 * @apiSuccess (201) {string} Message A message that the tag was added
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *  {
 *     message: 'tag added to learning path'
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
 * @apiError (403) {Object} Unauthorized The user is not authorized to add tag to this learning path
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to add tag to this learning path"
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
 *  "message": "Internal error: could not add tag to learning path"
 * }
 * 
 */

router.post('/:id/tags', (req, res) => {
    const pathId = req.params.id
    let email = req.user.email
    if(!req.body.tag) res.status(400).json({ message: "Missing tag data" })
    else
    {
        Users.findBy({ email })
            .then(user =>
            {
                if(user)
                {
                    Paths.addPathTag(user.id, pathId, req.body.tag)
                    .then(response => 
                    {
                        if(response.code === 201) res.status(201).json({ message: response.message })
                        else res.status(response.code).json({ message: response.message })
                    })
                    .catch(error => 
                    {
                        console.log(error)
                        res.status(500).json({ message: 'Internal error: Could not add tag to learning path' })
                    })
                }
                else res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
    }
})

/**
 * @api {delete} /api/learning-paths/:id/tags Delete Tag From Learning Path
 * @apiName DeleteTagFromLearningPath
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
 * @apiParam {Object} tag The name of the tag you want to delete from the learning path
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
 *     message: 'tag removed from learning path'
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
 * @apiError (403) {Object} Unauthorized The user is not authorized to remove tag from this learning path
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to remove tags from this learning path"
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
 * @apiError (500) {Object} Delete-Tag-Error Could not remove tag
 * 
 * @apiErrorExample 500-Tag-Remove-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal error: could not remove tag from learning path"
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
        const pathId = req.params.id
        let email = req.user.email
        Users.findBy({ email })
            .then(user =>
                {
                    if(user)
                    {
                        Paths.deletePathTag(user.id, pathId, req.body.tag)
                        .then(response => 
                            {
                                if(response.code === 200) res.status(200).json({ message: response.message })
                                else res.status(response.code).json({ message: response.message })
                            })
                        .catch(error => 
                            {
                                console.log(error)
                                res.status(500).json({ message: 'Internal error: Could not remove tags from path' })
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
 * @api {post} /api/learning-paths/:id/courses/:courseId Post Course To Learning Path
 * @apiName PostCourseToLearningPath
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
 * @apiParam {Object} Order The order of the course to be added to the learning path
 * 
 * @apiParamExample {json} Course Post Example:
 * { 
 *    "order": 3
 * }
 * 
 * @apiSuccess (201) {string} Message A message that the course was added
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 *  {
 *     message: 'Course added to learning path'
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
 * @apiError (403) {Object} Unauthorized The user is not authorized to add course to this learning path
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to add course to this learning path"
 * }
 * 
 * @apiError (404) {Object} course-not-found-error The course with the id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Course not found"
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
 * @apiErrorExample 500-Add-Course-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal error: could not add course to learning path"
 * }
 * 
 */

router.post('/:id/courses/:courseId', (req, res) => {
    const pathId = req.params.id
    const courseId = req.params.courseId
    let email = req.user.email
    if(!req.body.order) res.status(400).json({ message: "must send order for course in body" })
    else
    {
        const order = req.body.order
        Users.findBy({ email })
            .then(user =>
            {
                if(user)
                {
                    Paths.addPathCourse(user.id, pathId, courseId, order)
                    .then(response => 
                    {
                        console.log('response', response)
                        if(response.code === 200) res.status(200).json({ message: response.message, pathCourses: response.pathCourses })
                        else res.status(response.code).json({ message: response.message })
                    })
                    .catch(error => 
                    {
                        console.log(error)
                        res.status(500).json({ message: 'Internal error: Could not add course to learning path' })
                    })
                }
                else res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
    }
})

/**
 * @api {delete} /api/learning-paths/:id/courses/courseId Remove Course From Learning Path
 * @apiName RemoveCourseFromLearningPath
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
 * @apiSuccess (200) {string} Message A message that the course was removed
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     message: 'Course removed from learning path'
 *  }
 * 
 * @apiError (401) {Object} Bad-Request-Error The authorization header is absent
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Forbidden Access!"
 * }
 * 
 * @apiError (401) {Object} Bad-Request-Error The authorization is invalid
 * 
 * @apiErrorExample 401-Error-Response:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Invalid Credentials"
 * }
 * 
 * @apiError (403) {Object} Unauthorized The user is not authorized to remove course from this learning path
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to remove courses from this learning path"
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
 * @apiError (404) {Object} course-not-found-error The course with the id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Course not found"
 * }
 * 
 * @apiError (500) {Object} Find-User-Error Could not find user to remove course for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to remove course for"
 * }
 * 
 * @apiError (500) {Object} Remove-Course-Error Could not remove course
 * 
 * @apiErrorExample 500-Remove-Course-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal error: could not remove course from learning path"
 * }
 * 
 */

router.delete('/:id/courses/:courseId', (req, res) => 
{
    const pathId = req.params.id
    const courseId = req.params.courseId
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
        {
            if(user)
            {
                Paths.removePathCourse(user.id, pathId, courseId)
                .then(response => 
                {
                    if(response.code === 200) res.status(200).json({ message: response.message, pathCourses: response.pathCourses })
                    else res.status(response.code).json({ message: response.message })
                })
                .catch(error => 
                {
                    res.status(500).json({ message: 'Internal error: Could not remove courses from path' })
                })
            }
            else res.status(500).json({ message: 'Could not find user to remove course for' })
        })
        .catch(err =>
        {
            res.status(500).json({ message: 'Could not find user to remove course for' })
        })
})

/**
 * @api {put} /api/learning-paths/:id/courses/:courseId Update Course Order In Learning Path
 * @apiName UpdateCourseOrderInLearningPath
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
 * @apiParam {Object} Order The order of the course to be updated in the learning path
 * 
 * @apiParamExample {json} Course Post Example:
 * { 
 *    "order": 3
 * }
 * 
 * @apiSuccess (200) {Object} Message A message that the course was updated
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *     message: 'Course order updated in learning path'
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
 * @apiError (403) {Object} Unauthorized The user is not authorized to update course order in this learning path
 * 
 * @apiErrorExample 403-Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "User is not permitted to update course order in this learning path"
 * }
 * 
 * @apiError (404) {Object} course-not-found-error The course with the id sent was not found in database
 * 
 * @apiErrorExample 404-Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Course not found"
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
 * @apiError (500) {Object} Find-User-Error Could not find user to update course order for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to update course order for"
 * }
 * 
 * @apiError (500) {Object} Update-Course-Order-Error Could not update course order
 * 
 * @apiErrorExample 500-Update-Course-Order-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal error: could not update course order in learning path"
 * }
 * 
 */

router.put('/:id/courses/:courseId', (req, res) => {
    const pathId = req.params.id
    const courseId = req.params.courseId
    let email = req.user.email
    if(!req.body.order) res.status(400).json({ message: "must send order for course in body" })
    else
    {
        const order = req.body.order
        Users.findBy({ email })
            .then(user =>
            {
                if(user)
                {
                    Paths.updateCourseOrder(user.id, pathId, courseId, order)
                    .then(response => 
                    {
                        if(response.code === 200) res.status(200).json({ message: response.message })
                        else res.status(response.code).json({ message: response.message })
                    })
                    .catch(error => 
                    {
                        console.log(error)
                        res.status(500).json({ message: 'Internal error: Could not update course order' })
                    })
                }
                else res.status(500).json({ message: 'Could not find user to update course order for' })
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to update course order for' })
            })
    }
})

/**
 * @api {post} /api/learning-paths/:id/path-items Post Learning Path Item
 * @apiName PostLearningPathItem
 * @apiGroup Learning Path Items
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
 * @apiParam {String} name The name of the Learning Path Item you want to create
 * @apiParam {String} description The description of the Learning Path Item you want to create
 * @apiParam {String} category The category of the Learning Path Item you want to create
 * @apiParam {String} link The link of the Learning Path Item you want to create
 * @apiParam {Integer} path_order The order of the Learning Path Item in the path
 * 
 * @apiParamExample {json} Learning Path Item-Post-Example:
 * { 
 * 	 "name": "apidoc video",
 * 	 "description": "In this Learning Path Item, you will learn the tedium of writing docs.",
 * 	 "category": "Docs",
 * }
 * 
 * @apiSuccess (201) {integer} Id An id of the Learning Path Item that the user posted
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "message": "item added to path",
 *   "id": 4
 * }
 * 
 * @apiError (400) {Object} Missing-Learning-Path-Item-Data The Learning Path Item data is absent
 * 
 * @apiErrorExample 400-Learning Path Item-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Missing Learning Path Item data"
 * }
 * 
 * @apiError (400) {Object} Missing-Learning-Path-Item-Name The Learning Path Item name is absent
 * 
 * @apiErrorExample 400-Name-Missing:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Learning Path Item name is required"
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
 * @apiError (500) {Object} Find-User-Error Could not find user to add Learning Path Item for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to add Learning Path Item for"
 * }
 * 
 * @apiError (404) {Object} Find-Path-Error Could not find Learning Path to add Learning Path Item for
 * 
 * @apiErrorExample 404-Path-Not-Found:
 * HTTP/1.1 404 Internal Server Error
 * {
 *  "message": "No learning path found with that ID"
 * }
 * 
 * @apiError (403) {Object} Not-Authorized Could not add Learning Path item, user not authorized
 * 
 * @apiErrorExample 403-Not-Authorized-Found:
 * HTTP/1.1 403 Internal Server Error
 * {
 *  "message": "User is not permitted to change this path"
 * }
 * 
 * @apiError (500) {Object} Add-Learning-Path-Item-Error Could not add Learning Path Item
 * 
 * @apiErrorExample 500-Learning-Path-Add-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not add Learning Path Item"
 * }
 * 
 */

function verifyLearningPath(req, res, next)
{
    Paths.findById(req.params.id)
    .then(response => next())
    .catch(err => res.status(404).json({ message: "No learning path found with that ID" }))
}

function validateLearningPathItem(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "Missing learning path item data"})
    else if(!req.body.name) res.status(400).json({ message: "Learning Path Item name is required"})
    else next()
}

router.post('/:id/path-items', verifyLearningPath, validateLearningPathItem, (req, res) => {
    const pathId = req.params.id
    const pathItem = req.body
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.addPathItem(user.id, pathId, pathItem)
            .then(response => 
            {
                if(response.code === 403) res.status(403).json({ message: response.message })
                else if(response.code === 404) res.status(404).json({ message: response.message })
                else res.status(201).json({ message: response.message, id: response.id })
            })
            .catch(error => 
            {
                res.status(500).json({ message: 'Could not add learning path Item' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to add learning path Item for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to add learning path Item for' })
    })
})

/**
 * @api {put} /api/learning-paths/:id/path-items/:itemId Update Learning Path Item
 * @apiName UpdateLearningPathItem
 * @apiGroup Learning Path Items
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
 * @apiParam {String} name The name of the Learning Path Item you want to create
 * @apiParam {String} description The description of the Learning Path Item you want to create
 * @apiParam {String} category The category of the Learning Path Item you want to create
 * @apiParam {String} link The link of the Learning Path Item you want to create
 * 
 * @apiParamExample {Object} Learning-Path-Item-Update-Example:
 * { 
 *   "changes":
 *   {
 *      "name": "apidoc videos",
 * 	    "description": "In this Learning Path Item, you will learn the tedium of writing docs.",
 * 	    "category": "Docs"
 *   }
 * }
 * 
 * @apiSuccess (200) {integer} Id An id of the Learning Path Item that the user Updated
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "path item with id 4 updated",
 *   "id": "4"
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
 * @apiError (500) {Object} Find-User-Error Could not find user to update Learning Path Item for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to update Learning Path Item for"
 * }
 * 
 * @apiError (404) {Object} Find-Path-Error Could not find Learning Path to update Learning Path Item for
 * 
 * @apiErrorExample 404-Path-Not-Found:
 * HTTP/1.1 404 Internal Server Error
 * {
 *  "message": "No learning path found with that ID"
 * }
 * 
 * @apiError (403) {Object} Not-Authorized Could not add Learning Path item, user not authorized
 * 
 * @apiErrorExample 403-Not-Authorized:
 * HTTP/1.1 403 Internal Server Error
 * {
 *  "message": "User is not permitted to change this path"
 * }
 * 
 * @apiError (500) {Object} Update-Learning-Path-Item-Error Could not update Learning Path Item
 * 
 * @apiErrorExample 500-Update-Learning-Path-Item-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not update Learning Path Item"
 * }
 * 
 */

router.put('/:id/path-items/:itemId', verifyLearningPath, (req, res) => {
    const pathId = req.params.id
    const itemId = req.params.itemId
    const changes = req.body
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.updatePathItem(user.id, pathId, itemId, changes)
            .then(response => 
            {
                if(response.code === 403) res.status(403).json({ message: response.message })
                else if(response.code === 404) res.status(404).json({ message: response.message })
                else res.status(200).json({ message: response.message, id: response.id })
            })
            .catch(error => 
            {
                res.status(500).json({ message: 'Could not update learning path Item' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to update learning path Item for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to update learning path Item for' })
    })
})

/**
 * @api {delete} /api/learning-paths/:id/path-items/:itemId Delete Learning Path Item
 * @apiName DeleteLearningPathItem
 * @apiGroup Learning Path Items
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
 * @apiSuccess (200) {integer} Id An id of the Learning Path Item that the user deleted
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "path item with id 4 deleted",
 *   "id": "4"
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
 * @apiError (500) {Object} Find-User-Error Could not find user to delete Learning Path Item for
 * 
 * @apiErrorExample 500-User-Not-Found:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not find user to delete Learning Path Item for"
 * }
 * 
 * @apiError (404) {Object} Find-Path-Error Could not find Learning Path to delete Learning Path Item for
 * 
 * @apiErrorExample 404-Path-Not-Found:
 * HTTP/1.1 404 Internal Server Error
 * {
 *  "message": "No learning path found with that ID"
 * }
 * 
 * @apiError (403) {Object} Not-Authorized Could not delete Learning Path item, user not authorized
 * 
 * @apiErrorExample 403-Not-Authorized-Found:
 * HTTP/1.1 403 Internal Server Error
 * {
 *  "message": "User is not permitted to change this path item"
 * }
 * 
 * @apiError (500) {Object} Delete-Learning-Path-Item-Error Could not add Learning Path Item
 * 
 * @apiErrorExample 500-Delete-Learning-Path-Item-Error:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Could not delete Learning Path Item"
 * }
 * 
 */

router.delete('/:id/path-items/:itemId', verifyLearningPath, (req, res) => {
    const pathId = req.params.id
    const itemId = req.params.itemId
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.deletePathItem(user.id, pathId, itemId)
            .then(response => 
            {
                if(response.code === 403) res.status(403).json({ message: response.message })
                else if(response.code === 404) res.status(404).json({ message: response.message })
                else res.status(200).json({ message: response.message, id: response.id })
            })
            .catch(error => 
            {
                res.status(500).json({ message: 'Could not delete learning path Item' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to delete learning path Item for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to delete learning path Item for' })
    })
})

module.exports = router

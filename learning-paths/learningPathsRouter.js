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
            res.status(200).json(response)
        })
    .catch(error => 
        {
            res.status(500).json({ message: 'Error connecting with server' })
        })
})

module.exports = router

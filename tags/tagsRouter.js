const router = require('express').Router()

const Tags = require('./tagsModel')

/**
 * @api {get} /api/tags Get Tags
 * @apiName GetTags
 * @apiGroup Tags
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
 * @apiSuccess (200) {Array} Tags An array of the tags on the website
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 
 * [
 *   {
 *     "id": 1,
 *     "name": "Video"
 *   },
 *   {
 *     "id": 2,
 *     "name": "Coursera"
 *   },
 *   {
 *     "id": 3,
 *     "name": "Free"
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

 * @apiError (500) {Object} internal-server-error Could not retrieve tags
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Internal Error: Could not get tags"
 * }
 * 
 */

router.get('/', (req, res) =>
{
    Tags.find()
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(error =>
            {
                res.status(500).json({ message: `Internal Error: Could not get tags` })
            })
})

module.exports = router
/**
 * @api {post} /api/auth/register Post User Registration
 * @apiName PostUser
 * @apiGroup Authentication
 * 
 * @apiParam {String} email The email of the new user
 * @apiParam {String} password The password of the new user
 * @apiParam {String} first_name The first_name of the new user
 * @apiParam {String} last_name The last_name of the new user
 * 
 * @apiParamExample {json} Request-Example:
 *  {
 *    "email": "doctest@example.com",
 *    "password": "blahblahblah",
 *    "first_name": "Doc",
 *    "last_name": "Test"
 *  }
 * 
 * @apiSuccess (201) {Object} user An object with the user id, email and token
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "token": "fn9837f987fnh3987fn48fng98h",
 *   "id": 3,
 *   "email": "doctest@example.com",
 *   "first_name": "Doc",
 *   "last_name": "Test"
 * }
 * 
 * @apiError (400) {Object} bad-request-error The username or password is missing.
 * 
 * @apiErrorExample 400-Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "email, password, first_name, and last_name are required"
 * }
 * 
 * @apiError (409) {Object} duplicate-email-error The email is already registered
 * 
 * @apiErrorExample 409-Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *  "message": "A user with that email already exists"
 * }
 * @apiError (500) {Object} internal-server-error The user couldn't be registered
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal-Server-Error
 * {
 *  "message": "Error connecting with server"
 * }
 * 
 */

/**
 * @api {post} /api/auth/login Post User Login
 * @apiName PostLogin
 * @apiGroup Authentication
 * 
 * @apiParam {String} email The email of the existant user
 * @apiParam {String} password The password of the existant user
 * 
 * @apiParamExample {json} Request-Example:
 *  {
 *    "email": "doctest@example.com",
 *    "password": "blahblahblah"
 *  }
 * 
 * @apiSuccess (200) {Object} user An object with the user id and username and token
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "fn9837f987fnh3987fn48fng98h",
 *   "id": 3,
 *   "email": "doctest@example.com",
 *   "first_name": "Doc",
 *   "last_name": "Test"
 * }
 * 
 * @apiError (400) {Object} bad-request-error The username or password is missing.
 * 
 * @apiErrorExample 400-Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "missing email or password"
 * }
 * 
 * @apiError (500) {Object} internal-server-error The user couldn't be logged in
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal-Server-Error
 * {
 *  "message": "Couldn't connect to login service"
 * }
 * 
 */

/**
 * @api {post} /api/auth/ Post Token For Verification
 * @apiName PostTokenForVerification
 * @apiGroup Authentication
 * 
 * @apiParam {String} token The user's token
 * 
 * @apiParamExample {json} Request-Example:
 *  {
 *    "token": "1f1n3h87fh1938rfng9387fn"
 *  }
 * 
 * @apiSuccess (200) {Object} user An object with the user id and username and token
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "email": "doctest@example.com",
 *   "id": 3,
 *   "photo": null,
 *   "first_name": "Doc",
 *   "last_name": "Test"
 * }
 * 
 * @apiError (400) {Object} bad-request-error The token is missing.
 * 
 * @apiErrorExample 400-Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "No token provided"
 * }
 * 
 * @apiError (401) {Object} Verify-Error Token does not exist
 * 
 * @apiErrorExample 401-Verify-Error:
 * HTTP/1.1 401 Bad Request
 * {
 *  "message": "Token does not exist"
 * }
 * 
 * @apiError (404) {Object} User-Not-Found The User Wasn't Found for the Token.
 * 
 * @apiErrorExample 404-User-Not-Found:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "No such user found"
 * }
 * 
 * @apiError (500) {Object} internal-server-error Could not retrieve user.
 * 
 * @apiErrorExample 500-Error-Response:
 * HTTP/1.1 500 Internal-Server-Error
 * {
 *  "message": "Internal server error, could not retrieve user"
 * }
 * 
 */


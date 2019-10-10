require('dotenv').config()
const server = require('../api/server')
const request = require('supertest')
const db = require('../database/dbConfig')
const prepareTestDB = require('../utils/prepareTestDB')
const restricted = require('../utils/restricted')
jest.mock('../utils/restricted')

beforeEach(prepareTestDB)
beforeEach(() => restricted.mockClear())

describe('GET /api/courses', () =>
{
    it('returns a 200', async () =>
    {
        restricted.mockImplementationOnce((req, res, next) =>
        {
            req.user = {email: "bob@bobmail.com"}
            next()
        })
        const res = await request(server)
            .get('/api/courses')
            .send()
        expect(res.status).toBe(200)
    })
    it('is an array of objects with links', async () =>
    {
        restricted.mockImplementationOnce((req, res, next) =>
        {
            req.user = {email: "bob@bobmail.com"}
            next()
        })
        const res = await request(server)
            .get('/api/courses')
            .send()
        expect(res.body[0]).toHaveProperty("link")
    })
})
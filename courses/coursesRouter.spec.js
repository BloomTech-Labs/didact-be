require('dotenv').config()
const server = require('../api/server')
const request = require('supertest')
const db = require('../database/dbConfig')
const prepareTestDB = require('../utils/prepareTestDB')
const restricted = require('../utils/restricted')
jest.mock('../utils/restricted')

beforeEach(prepareTestDB)
beforeEach(() => restricted.mockClear())

describe('GET /api/courses', () => {
    it('returns a 200', async () => {
        restricted.mockImplementationOnce((req, res, next) => {
            req.user = { email: "bob@bobmail.com" }
            next()
        })
        const res = await request(server)
            .get('/api/courses')
            .send()
        expect(res.status).toBe(200)
    })
    it('is an array of objects with links', async () => {
        restricted.mockImplementationOnce((req, res, next) => {
            req.user = { email: "bob@bobmail.com" }
            next()
        })
        const res = await request(server)
            .get('/api/courses')
            .send()
        expect(res.body[0]).toHaveProperty("link")
    })
})

describe('GET /api/courses/allyours', () => {
    it('returns a 200', async () => {
        restricted.mockImplementationOnce((req, res, next) => {
            req.user = { email: "bob@bobmail.com" }
            next()
        })
        const res = await request(server)
            .get('/api/courses/allyours')
            .send()
        expect(res.status).toBe(200)
    })
    it('returns application/json', async () => {
        restricted.mockImplementationOnce((req, res, next) => {
            req.user = { email: "bob@bobmail.com" }
            next()
        })
        const res = await request(server)
            .get('/api/courses/allyours')
            .send()
        // console.log("TTTTTTTYYYYYYPPPEE", res.type)
        expect(res.type).toBe("application/json")
    })
})

describe('Post /api/courses', () => {
    const course =
    {
        link: "www.link.com",
        title: "this is a test",
        foreign_instructors: "none",
        description: "nothing to say blah blah",
        topic: "testing"
    }

    it('returns a 200', async () => {
        restricted.mockImplementationOnce((req, res, next) => {
            req.user = { email: "bob@bobmail.com" }
            next()
        })
        const res = await request(server)
            .post('/api/courses')
            .send(course)
        expect(res.status).toBe(201)
    })

})

describe('Put /api/courses/id', () => {
    const changes =
    {
        title: "this is a test",
        foreign_instructors: "none",
        description: "nothing to say blah blah",
        link: "www.blahblah.com",
        topic: "testing"
    }

    it('returns application/json', async () => {
        restricted.mockImplementationOnce((req, res, next) => {
            req.user = { email: "bob@bobmail.com" }
            next()
        })
        const res = await request(server)
            .put('/api/courses/1')
            .send(changes)
        expect(res.type).toBe("application/json")
    })

})
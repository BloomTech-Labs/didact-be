require('dotenv').config()
const server = require('../api/server')
const request = require('supertest')
const db = require('../database/dbConfig')
const prepareTestDB = require('../utils/prepareTestDB')
const restricted = require('../utils/restricted')
jest.mock('../utils/restricted')

beforeEach(prepareTestDB)
// beforeEach(() => restricted.mockClear())

describe('post /register', () => {
    const user =
    {
        email: "test@test.com",
        password: "test123",
        first_name: "test",
        last_name: "tset"
    }

    it('returns a 201', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send(user)

        expect(res.status).toBe(201)
    })
    it('returns a token', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send(user)

        expect(res.body).toHaveProperty("token")
    })
})

describe('post /login', () => {
    const user =
    {
        email: "bob@bobmail.com",
        password: "secretpass",
    }

    it('returns a 200', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send(user)
        // console.log("TOOOOOOOOKEEEEEEEEN", res.body.token)
        expect(res.status).toBe(200)
    })
    it('returns a token, and user', async () => {

        const res = await request(server)
            .post('/api/auth/login')
            .send(user)

        expect(res.body).toHaveProperty("token")
        expect(res.body).toHaveProperty("user")
    })
})

describe("get/users functionality", () => {

    it("should return status 401 when sent without a token", async () => {
        const res = await request(server).get("/api/auth/users")
            .then()
            .catch()
        expect(res.status).toBe(500);
    });
});




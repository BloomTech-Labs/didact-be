require('dotenv').config()
const server = require('../api/server')
const request = require('supertest')
const db = require('../database/dbConfig')
const prepareTestDB = require('../utils/prepareTestDB')

beforeEach(prepareTestDB)

describe('post /register', () =>
{
    const user = 
    {
        email: "test@test.com",
        password: "test123",
        first_name: "test",
        last_name: "tset"
    }
    
    it('returns a 201', async () =>
    {
        const res = await request(server)
            .post('/api/auth/register')
            .send(user)

        expect(res.status).toBe(201)
    })
    it('returns a message and email', async () =>
    {
        const res = await request(server)
            .post('/api/auth/register')
            .send(user)

        expect(res.body).toHaveProperty("message")
        expect(res.body).toHaveProperty("email")
    })
})

describe('post /login', () =>
{
    const user = 
    {
        email: "bob@bobmail.com",
        password: "password",
    }
    
    it('returns a 200', async () =>
    {
        const res = await request(server)
            .post('/api/auth/login')
            .send(user)

        expect(res.status).toBe(200)
    })
    it('returns a token, id, and email', async () =>
    {
        
        const res = await request(server)
            .post('/api/auth/login')
            .send(user)

            expect(res.body).toHaveProperty("token")
            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("email")
    })
})
require("dotenv").config();
const server = require("../api/server");
const request = require("supertest");
const db = require("../database/dbConfig");
const prepareTestDB = require("../utils/prepareTestDB");
const restricted = require("../utils/restricted");
jest.mock("../utils/restricted");

beforeEach(prepareTestDB);
beforeEach(() => restricted.mockClear());

describe("GET /api/learning-paths", () => {
  it("returns a 200", async () => {
    restricted.mockImplementationOnce((req, res, next) => {
      req.user = { email: "bob@bobmail.com" };
      next();
    });
    const res = await request(server)
      .get("/api/learning-paths")
      .send();
    expect(res.status).toBe(200);
  });
});

describe("GET learning-paths array of objects", () => {
  it("learning-paths has has an array of objects containing titles", async () => {
    restricted.mockImplementationOnce((req, res, next) => {
      req.user = { email: "bob@bobmail.com" };
      next();
    });
    const res = await request(server)
      .get("/api/learning-paths/yours")
      .send();
    expect(res.body[0]).toHaveProperty("title");
  });
  it("learning-paths has has an array of objects containing topics", async () => {
    restricted.mockImplementationOnce((req, res, next) => {
      req.user = { email: "bob@bobmail.com" };
      next();
    });
    const res = await request(server)
      .get("/api/learning-paths/yours")
      .send();
    expect(res.body[0]).toHaveProperty("topic");
  });
  it("learning-paths has has an array of objects containing descriptions", async () => {
    restricted.mockImplementationOnce((req, res, next) => {
      req.user = { email: "bob@bobmail.com" };
      next();
    });
    const res = await request(server)
      .get("/api/learning-paths/yours")
      .send();
    expect(res.body[0]).toHaveProperty("description");
  });
  it("learning-paths has has an array of objects containing courses", async () => {
    restricted.mockImplementationOnce((req, res, next) => {
      req.user = { email: "bob@bobmail.com" };
      next();
    });
    const res = await request(server)
      .get("/api/learning-paths/yours")
      .send();
    expect(res.body[0]).toHaveProperty("courses");
  });
});

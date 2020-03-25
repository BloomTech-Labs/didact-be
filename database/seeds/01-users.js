const bcryptjs = require("bcryptjs");
const hashCount = require("../../utils/hashCount");
const secrets = require("../../config/secret.js");
exports.seed = function(knex, Promise) {
  return knex("users").insert([
    {
      email: "didactlms@gmail.com",
      first_name: "Mark",
      last_name: "Dudlik",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      owner: true
    },
    {
      email: "bob@bobmail.com",
      first_name: "Bob",
      last_name: "Bobson",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      admin: true
    },
    {
      email: "amy@example.com",
      first_name: "Amy",
      last_name: "Lee",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      moderator: true
    },
    {
      email: "owner@gmail.com",
      first_name: "Tom",
      last_name: "Boss",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      owner: true
    },
    {
      email: "jd@gmail.com",
      first_name: "John",
      last_name: "Smith",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      moderator: true
    },
    {
      email: "stephen@gmail.com",
      first_name: "Stephen",
      last_name: "Chow",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      moderator: true
    },
    {
      email: "alice@gmail.com",
      first_name: "Alice",
      last_name: "Childs",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      moderator: true
    },
    {
      email: "carlos@gmail.com",
      first_name: "Carlos",
      last_name: "Sanchez",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      admin: true
    },
    {
      email: "ziggy@gmail.com",
      first_name: "Seigfreid",
      last_name: "Nosche",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
      admin: true
    },
    {
      email: "isabel@gmail.com",
      first_name: "Isabel",
      last_name: "Ortega",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount)
    },
    {
      email: "suzzette@gmail.com",
      first_name: "Suzzette",
      last_name: "Arnando",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount)
    },
    {
      email: "felice@gmail.com",
      first_name: "Felicity",
      last_name: "Black",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount)
    },
    {
      email: "patrick@gmail.com",
      first_name: "Patrick",
      last_name: "Fitzsimmons",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount)
    },
    {
      email: "michael@gmail.com",
      first_name: "Michael",
      last_name: "Takashi",
      password: bcryptjs.hashSync(secrets.adminSecret, hashCount)
    }
  ]);
};

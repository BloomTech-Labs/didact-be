const bcryptjs = require('bcryptjs')
const hashCount = require('../../utils/hashCount')

exports.seed = function(knex, Promise)
{
    return knex('users')
    .insert(
        [
            {
                email: "bob@bobmail.com",
                first_name: "bob",
                last_name: "bobson",
                password: bcryptjs.hashSync("password", hashCount)
            },
            {
                email: "amy@example.com",
                first_name: "amy",
                last_name: "lee",
                password: bcryptjs.hashSync("123", hashCount)
            }
        ]
    )
}
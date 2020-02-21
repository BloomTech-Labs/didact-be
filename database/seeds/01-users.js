const bcryptjs = require('bcryptjs')
const hashCount = require('../../utils/hashCount')
const secrets = require('../../config/secret.js');
exports.seed = function(knex, Promise)
{
    return knex('users')
    .insert(
        [
            
            {
                email: "didactlms@gmail.com",
                first_name: "Mark",
                last_name: "Dudlik",
                password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
                owner: true
            },{
                email: "bob@bobmail.com",
                first_name: "bob",
                last_name: "bobson",
                password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
                admin: true
            },
            {
                email: "amy@example.com",
                first_name: "amy",
                last_name: "lee",
                password: bcryptjs.hashSync(secrets.adminSecret, hashCount),
                moderator: true
            }
        ]
    )
}
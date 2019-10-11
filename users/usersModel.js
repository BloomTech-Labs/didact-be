const db = require('../database/dbConfig');

module.exports = {
    add,
    findBy,
    findById,
    findAll,
    FBfindOrCreate
};

function findBy(filter) {
    return db('users')
        // .select('id', 'email', 'first_name', 'last_name')
        .where(filter)
        .first();
}

function add(user) {
    return db('users').insert(user);
}

function findById(id) {
    return db('users')
        .select('id', 'email', 'first_name', 'last_name')
        .where({ id })
        .first();
}

function findAll() {
    return db('users')
        .select('*')
}

async function FBfindOrCreate(facebookID, first_name, last_name, email)
{
    let user = await db('users')
                .where({ facebookID })
    if (user.length === 0)
    {
        let newUser = await db('users')
            .insert({email, first_name, last_name, facebookID}, 'id')
        return db('users').where({id: newUser.id}).first()
    }
    else
    {
        return user[0]
    }
}
const db = require('../database/dbConfig');

module.exports = {
    add,
    findBy,
    findById,
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
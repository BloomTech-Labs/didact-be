const db = require('../database/dbConfig');

module.exports = {
    add,
    findBy,
    findById,
    findAll,
    FBfindOrCreate,
    GGLfindOrCreate
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

async function FBfindOrCreate(userObj) {

    console.log(userObj)
    let user = await db('users')
        .where({ email: userObj.email })
    if (user.length > 0) {
        if (!user.facebookID) {
            let newUser = await db('users')
                .update({ facebookID: userObj.facebookID }, 'id')
            console.log(newUser)
            return db('users').where({ id: newUser[0] }).first()
        }
        else {
            return user[0]
        }
    }

    user = await db('users')
        .where({ facebookID: userObj.facebookID })
    if (user.length === 0) {
        let newUser = await db('users')
            .insert({ email: userObj.email, first_name: userObj.first_name, last_name: userObj.last_name, facebookID: userObj.facebookID, photo: userObj.photo }, 'id')
        console.log(newUser)
        return db('users').where({ id: newUser[0] }).first()
    }
    else {
        return user[0]
    }
}

async function GGLfindOrCreate(userObj) {

    console.log(userObj)
    let user = await db('users')
        .where({ email: userObj.email })
    if (user.length > 0) {
        if (!user.googleID) {
            let newUser = await db('users')
                .update({ googleID: userObj.googleID }, 'id')
            console.log(newUser)
            return db('users').where({ id: newUser[0] }).first()
        }
        else {
            return user[0]
        }
    }

    user = await db('users')
        .where({ googleID: userObj.googleID })
    if (user.length === 0) {
        let newUser = await db('users')
            .insert({ email: userObj.email, first_name: userObj.first_name, last_name: userObj.last_name, googleID: userObj.googleID, photo: userObj.photo }, 'id')
        console.log(newUser)
        return db('users').where({ id: newUser[0] }).first()
    }
    else {
        return user[0]
    }
}
const db = require('../database/dbConfig');
const learningPath = require('../learning-paths/learningPathsModel')

module.exports = {
    find,
    update,
    add,
    findBy,
    findById,
    findAll,
    FBfindOrCreate,
    GGLfindOrCreate,
    addToEmailList,
    getEmailList,
    checkEmailListForEmail
};

function find() {
    return db("users");
}

function update(id, changes) {
    return db("users")
        .where({ id })
        .update(changes);
}

function findBy(filter) {
    return db('users')
        .where(filter)
        .first();
}

async function add(user) {
    let userId = await db('users').insert(user, 'id');
    console.log(userId)
    await learningPath.joinLearningPath(userId[0], 1, 1)
    return userId
}

function findById(id) {
    return db('users')
        .select('id', 'email', 'first_name', 'last_name', 'owner', 'admin', 'moderator')
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
        await learningPath.joinLearningPath(newUser[0], 1, 1)
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
        await learningPath.joinLearningPath(newUser[0], 1, 1)
        return db('users').where({ id: newUser[0] }).first()
    }
    else {
        return user[0]
    }
}

function addToEmailList(email) {
    return db('email_list').insert({ email })
}

function getEmailList() { return db('email_list') }

function checkEmailListForEmail(email) {
    return db('email_list').where({ email }).first()
}
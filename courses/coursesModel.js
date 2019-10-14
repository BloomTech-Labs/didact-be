const db = require('../database/dbConfig');


module.exports = {
    find,
    findById,
    add,
    updateByCourseId
}

function find() {
    return db('courses')
}

async function findById(id)
{
    let course = await db('courses').where({id}).first()
    if(!course) return {message: 'No course found with that ID', code: 404}
    return {course, code: 200}
}

function add(userId, courseObj)
{
    return db('courses').insert(courseObj, 'id')
}

function updateByCourseId(userId, changes)
{
    
}
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
    courseObj.creator_id = userId
    return db('courses').insert(courseObj, 'id')
}

async function updateByCourseId(userId, courseId, changes)
{
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to change this course', code: 403}
    await db('courses').where({id: courseId}).update(changes)
    return {code: 200}
}
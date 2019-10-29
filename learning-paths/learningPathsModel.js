const db = require('../database/dbConfig')

module.exports = 
{
    find,
    findById,
    add,
}

function find() 
{
    return db('paths')
}

async function findById(id)
{
    let path = await db('paths').where({id}).first()
    
    if(!path) return {message: 'No learning path found with that ID', code: 404}
    path.tags = await getTagsForPath(id)
    path.courses = await findCoursesForPath(id)
    path.creatorId = await getCreatorIdForPath(id)
    return {path, code: 200}
}

async function getTagsForPath(pathId) 
{
    let tagList = await db('paths as p')
        .join('tags_paths as tp', 'tp.path_id', '=', 'p.id')
        .join('tags as t', 'tp.tag_id', '=', 't.id')
        .select('t.name')
        .where({ 'p.id': pathId })

    nameList = tagList.map(el => el.name)
    return nameList
}

async function getCreatorIdForPath(pathId)
{
    let creatorId = await db('paths as p')
        .join('users_paths as up', 'up.path_id', '=', 'p.id')
        .select('up.user_id')
        .where({ 'p.id': pathId, 'up.created': 1 })
    
    console.log('creatorId', creatorId)
    return creatorId[0].user_id
}

async function findCoursesForPath(pathId)
{
    let courseList = await db('paths as p')
        .join('paths_courses as pc', 'pc.path_id', '=', 'p.id')
        .join('courses as c', 'pc.course_id', '=', 'c.id')
        .select('c.id', 'c.name')
        .where({ 'p.id': pathId })

    return courseList
}

async function add(userId, path)
{
    let pathIds = await db('paths').insert(path, 'id')
    let pathId = pathIds[0]
    if(pathId) 
    {
        let up = await db('users_paths').insert({user_id: userId, path_id: pathId, created: 1})
        console.log('up', up)
        return pathId
    }
}
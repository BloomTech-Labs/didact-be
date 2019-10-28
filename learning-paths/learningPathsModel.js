const db = require('../database/dbConfig')

module.exports = 
{
    find,
    findById,
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
    return {path, code: 200}
}

async function getTagsForPath(pathId) {
    let tagList = await db('paths as p')
        .join('tags_paths as tp', 'tp.path_id', '=', 'p.id')
        .join('tags as t', 'tp.tag_id', '=', 't.id')
        .select('t.name')
        .where({ 'p.id': pathId })

    nameList = tagList.map(el => el.name)
    return nameList
}
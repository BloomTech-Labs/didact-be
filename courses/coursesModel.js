const db = require('../database/dbConfig');


module.exports = {
    find,
    findById,
    add,
    updateCourseById,
    deleteCourseById,
    addCourseTags,
    getTagsForCourse,
    findCourseSectionsByCourseId,
    findSectionDetailsByCourseSectionsId,
    addCourseSection,
    updateCourseSection,
    deleteCourseSection
}

function find() {
    return db('courses')
}

async function findById(id)
{
    
    let course = await db('courses').where({id}).first()
    
    if(!course) return {message: 'No course found with that ID', code: 404}
    course.tags = await getTagsForCourse(id)
    return {course, code: 200}
}

function add(userId, courseObj)
{
    courseObj.creator_id = userId
    return db('courses').insert(courseObj, 'id')
}

async function updateCourseById(userId, courseId, changes)
{
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to change this course', code: 403}
    await db('courses').where({id: courseId}).update(changes)
    return {code: 200}
}

async function deleteCourseById(userId, courseId)
{
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to change this course', code: 403}
    let delReturn = await db('courses').where({id: courseId}).del()
    return {code: 200}
}

async function addCourseTags(userId, courseId, aTags)
{
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to add tags to this course', code: 403}
    
    for(let i = 0; i < aTags.length; i++)
    {
        let tagId = await checkForTag(aTags[i])
        if(tagId === -1) 
        {
            tagId = await db('tags').insert({name: aTags[i]}, 'id')
            console.log('tagId from add', tagId[0])
            await db('tags_courses').insert({tag_id: tagId[0], course_id: courseId})
        }
        else await db('tags_courses').insert({tag_id: tagId, course_id: courseId})
    }
    
    return { message: 'tags added to course', code: 201 }
}

async function checkForTag(tagName)
{
    let tag = await db('tags').where({ name: tagName })
    if(tag.length === 0) return (-1)
    console.log('tag.id', tag[0].id)
    return tag[0].id 
}

async function getTagsForCourse(courseId) {
    let tagList = await db('courses as c')
        .join('tags_courses as ct', 'ct.course_id', '=', 'c.id')
        .join('tags as t', 'ct.tag_id', '=', 't.id')
        .select('t.name')
        .where({ 'c.id': courseId })

    nameList = tagList.map(el => el.name)
    return nameList
}

async function findCourseSectionsByCourseId(id) {
    let details = await db('course_sections as cs')
        .where({'cs.course_id': id})
    return details 
}

function addCourseSection(section) {
    return db('course_sections')
        .insert(section, 'id')
}

function updateCourseSection(sectionId, changes) {
    return db('course_sections')
        .where({id: sectionId})
        .update(changes)
}

function deleteCourseSection(sectionId) {
    return db('course_sections')
        .where({id: sectionId})
        .del()
}


async function findSectionDetailsByCourseSectionsId(id) {
    let section = await db('section_details as sd')
        .where({'sd.course_sections_id': id})
    return section
}




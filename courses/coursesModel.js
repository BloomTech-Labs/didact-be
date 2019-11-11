const db = require('../database/dbConfig');


module.exports = {
    find,
    findById,
    add,
    updateCourseById,
    deleteCourseById,
    addCourseTag,
    deleteCourseTag,
    getTagsForCourse,
    findCourseSectionsByCourseId,
    findSectionDetailsByCourseSectionsId,
    addCourseSection,
    updateCourseSection,
    deleteCourseSection,
    addSectionDetails,
    updateSectionDetails,
    deleteSectionDetails,
    manualLessonCompleteToggle,
    manualSectionCompleteToggle,
    manualCourseCompleteToggle,
    getLessonsWithUserCompletion,
    findYourCourseSectionsByCourseId,
    findYoursById,
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

async function addCourseTag(userId, courseId, tag)
{
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to add tags to this course', code: 403}
    
    let tagId = await checkForTag(tag)
    if(tagId === -1) 
    {
        tagId = await db('tags').insert({name: tag}, 'id')
        console.log('tagId from add', tagId[0])
        await db('tags_courses').insert({tag_id: tagId[0], course_id: courseId})
    }
    else await db('tags_courses').insert({tag_id: tagId, course_id: courseId})
    
    return { message: 'tag added to course', code: 201 }
}

async function deleteCourseTag(userId, courseId, tag)
{
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to remove tags from this course', code: 403}

    let tagId = await checkForTag(tag)

    if(tagId === -1) 
    {
        return {message: 'Tag not found', code: 404}
    }
    else await db('tags_courses').where({tag_id: tagId, course_id: courseId}).del()
    
    return { message: 'tag removed from course', code: 200 }
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

async function addCourseSection(userId, courseId, section) {
    let courseObj = await findById(courseId)
    let course = courseObj.course
    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to add sections to this course', code: 403}
    let addreturn = await db('course_sections')
        .insert(section, 'id')
    return {code: 201, message: addreturn}
}

async function updateCourseSection(userId, courseId, sectionId, changes) {
    let courseObj = await findById(courseId)
    let course = courseObj.course
    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to update sections to this course', code: 403}
    let updatereturn = await db('course_sections')
        .where({id: sectionId})
        .update(changes)
    return {code: 200, message: updatereturn}
}

async function deleteCourseSection(userId, courseId, sectionId) {
    let courseObj = await findById(courseId)
    let course = courseObj.course
    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to update sections to this course', code: 403}
    await db('course_sections')
        .where({id: sectionId})
        .del()
    return {code: 200, message: 'delete successful'}
}

async function findSectionDetailsByCourseSectionsId(id) {
    let section = await db('section_details as sd')
        .where({'sd.course_sections_id': id})
    return section
}

async function addSectionDetails(userId, courseId, details) {
    let courseObj = await findById(courseId)
    let course = courseObj.course
    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to add Details to this Course Section', code: 403}
    else {
        let addreturn = await db('section_details')
        .insert(details, 'id')
        return {code: 200, message: addreturn}
    }
        
}

async function updateSectionDetails(userId, courseId, sectionId, detailId, changes) {
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {message: 'User is not permitted to add Details to this Course Section', code: 403}
    else {
        let addreturn = await db('section_details')
            .where({id: detailId, course_sections_id: sectionId})
            .update(changes)
        return {code: 200, message: addreturn}
    }
}

async function deleteSectionDetails(userId, courseId, sectionId, detailId) {
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if(!course) return {message: 'No course found with that ID', code: 404}
    if(course.creator_id !== userId) return {code: 403, message: 'User is not permitted to add Details to this Course Section', code: 403}
    await db('section_details')
        .where({id: detailId, course_sections_id: sectionId})
        .del()
    return {code: 200, message: 'delete successful'}
}

async function generateUdemyCourse(userId, title, courseId, courseArray)
{
    
}


async function findUserSectionDetailsBySectionId(userId, sectionId)
{
    try 
    {
        return await db('course_sections as cs')
            .join('section_details as sd','sd.course_sections_id', '=', 'cs.id')
            .join('users_section_details as usd', 'usd.section_detail_id', '=', 'sd.id')
            .select('usd.*')
            .where({'usd.user_id': userId, 'cs.id': sectionId})
    }
    catch(error)
    {
        return 0
    }
}

async function manualLessonCompleteToggle(userId, courseId, sectionId, sectionDetailId)
{
    try
    {
        let userLesson = await db('users_section_details').where({user_id: userId, section_detail_id: sectionDetailId}).first()
        userLesson.manually_completed = !userLesson.manually_completed
        await db('users_section_details').where({user_id: userId, section_detail_id: sectionDetailId}).update(userLesson)

        //automaticall complete sections, if all lessons completed
        let userSectionDetails = await findUserSectionDetailsBySectionId(userId, sectionId)
        let isComplete = userSectionDetails.every(el => el.automatically_completed || el.manually_completed)
        if(isComplete) await db('users_sections as us')
            .where({'us.section_id': sectionId, 'us.user_id': userId})
            .update({automatically_completed: true})
        
        return {code: 200, message: 'Lesson completion toggled'}
    }
    catch(error)
    {
        console.log(error)
        return {code: 500, message: 'Internal Error: Could not toggle lesson completion'}
    }
}

async function findUserSectionsByCourseId(userId, courseId)
{
    try 
    {
        return await db('courses as c')
            .join('course_sections as cs','cs.course_id', '=', 'c.id')
            .join('users_sections as us', 'us.section_id', '=', 'cs.id')
            .select('us.*')
            .where({'us.user_id': userId, 'c.id': courseId})
    }
    catch(error)
    {
        return 0
    }
}

async function manualSectionCompleteToggle(userId, courseId, sectionId)
{
    try
    {
        let userSection = await db('users_sections').where({user_id: userId, section_id: sectionId}).first()
        userSection.manually_completed = !userSection.manually_completed
        await db('users_sections').where({user_id: userId, section_id: sectionId}).update(userSection)

        // automatically complete lessons below section for user
        let usersSectionDetails = await db('course_sections as cs')
            .join('section_details as sd', 'sd.course_sections_id', '=', 'cs.id')
            .join('users_section_details as usd', 'usd.section_detail_id', '=', 'sd.id')
            .select('usd.*')
            .where({'cs.id': sectionId, 'usd.user_id': userId})

        for(let i=0; i<usersSectionDetails.length; i++)
        {
            console.log('toggling lessons in section', usersSectionDetails[i].section_detail_id)
            await db('users_section_details').where({user_id: userId, section_detail_id: usersSectionDetails[i].section_detail_id})
                .update({automatically_completed: !usersSectionDetails[i].automatically_completed})
        }

        //automatically complete course above section if all sections complete
        let userSections = await findUserSectionsByCourseId(userId, courseId)
        console.log('blah', userSections)
        let isComplete = userSections.every(el => el.automatically_completed || el.manually_completed)
        if(isComplete) await db('users_courses as uc')
            .where({'uc.course_id': courseId, 'uc.user_id': userId})
            .update({automatically_completed: true})

        return {code: 200, message: 'Section completion toggled'}
    }
    catch(error)
    {
        console.log(error)
        return {code: 500, message: 'Internal Error: Could not toggle section completion'}
    }
}

async function findUserCoursesByPathId(userId, pathId)
{
    try 
    {
        console.log('userId, pathId', userId, pathId)
        return await db('paths as p')
            .join('paths_courses as pc','pc.path_id', '=', 'p.id')
            .join('users_courses as uc', 'uc.course_id', '=', 'pc.course_id')
            .select('uc.*')
            .where({'uc.user_id': userId, 'pc.path_id': pathId})
    }
    catch(error)
    {
        return 0
    }
}

async function findPathIdsForUserIdCourseId(userId, courseId)
{
    try
    {
        return await db('paths as p')
            .join('paths_courses as pc', 'pc.path_id', '=', 'p.id')
            .join('users_paths as up', 'pc.path_id', '=', 'p.id')
            .select('p.id')
            .where({'up.user_id': userId, 'pc.course_id': courseId})
    }
    catch(error)
    {
        return 0
    }
}

async function manualCourseCompleteToggle(userId, courseId)
{
    try
    {
        let userCourse = await db('users_courses').where({user_id: userId, course_id: courseId}).first()
        userCourse.manually_completed = !userCourse.manually_completed
        await db('users_courses').where({user_id: userId, course_id: courseId}).update(userCourse)

        // automatically complete sections below course for user
        let usersSections = await db('courses as c')
            .join('course_sections as cs', 'cs.course_id', '=', 'c.id')
            .join('users_sections as us', 'us.section_id', '=', 'cs.id')
            .select('us.*')
            .where({'c.id': courseId, 'us.user_id': userId})

        for(let i=0; i<usersSections.length; i++)
        {
            console.log('toggling sections in course. Section ID:', usersSections[i].section_id)
            await db('users_sections').where({user_id: userId, section_id: usersSections[i].section_id})
                .update({automatically_completed: !usersSections[i].automatically_completed})

            // automatically complete lessons below each section for user
            let sectionId = usersSections[i].section_id
            let usersSectionDetails = await db('course_sections as cs')
            .join('section_details as sd', 'sd.course_sections_id', '=', 'cs.id')
            .join('users_section_details as usd', 'usd.section_detail_id', '=', 'sd.id')
            .select('usd.*')
            .where({'cs.id': sectionId, 'usd.user_id': userId})

            for(let j=0; j<usersSectionDetails.length; j++)
            {
                console.log('toggling lessons in section. Lesson ID:', usersSectionDetails[j].section_detail_id)
                await db('users_section_details').where({user_id: userId, section_detail_id: usersSectionDetails[j].section_detail_id})
                    .update({automatically_completed: !usersSectionDetails[j].automatically_completed})
            }
        }

        

        //automatically complete path above course if all courses complete

        // Find Path IDs for all paths that have the course, that the user is on.
        let pathIds = await findPathIdsForUserIdCourseId(userId, courseId)
        for(let i=0; i<pathIds.length; i++)
        {
            // Find all courses in those paths, then check if all complete. If so, auto-complete the path
            let userCourses = await findUserCoursesByPathId(userId, pathIds[i].id)
            console.log('blah', userCourses)
            let isComplete = userCourses.every(el => el.automatically_completed || el.manually_completed)
            if(isComplete) await db('users_paths as up')
                .where({'up.path_id': pathIds[i].id, 'up.user_id': userId})
                .update({automatically_completed: true})

        }

        return {code: 200, message: 'Course completion toggled'}
    }
    catch(error)
    {
        console.log(error)
        return {code: 500, message: 'Internal Error: Could not toggle course completion'}
    }
}

async function getLessonsWithUserCompletion(userId, sectionId)
{
    let userLessons = await db('section_details as sd')
        .join('users_section_details as usd', 'sd.id', '=', 'usd.section_detail_id')
        .select('sd.*', 'usd.manually_completed', 'usd.automatically_completed')
        .where({'sd.course_sections_id': sectionId, 'usd.user_id': userId})
    return userLessons
}

async function findYourCourseSectionsByCourseId(userId, courseId)
{
    let userSections = await findUserSectionsByCourseId(userId, courseId)
    let sectionIds = userSections.map(el => el.section_id)
    let sectionArr = []
    for(let i = 0; i < sectionIds.length; i++)
    {
        let tempSection = await db('course_sections as cs')
            .where({'cs.id': sectionIds[i]}).first()
        
        let tempUserSection = userSections.find(el => el.section_id === sectionIds[i])
        tempSection.manually_completed = tempUserSection.manually_completed
        tempSection.automatically_completed = tempUserSection.automatically_completed
        sectionArr.push(tempSection)

    }
    return sectionArr
}

async function findYoursById(userId, courseId)
{
    let userSections = await findUserSectionsByCourseId(userId, courseId)
    let sectionIds = userSections.map(el => el.section_id)
    let lessonArr = []
    for(let i = 0; i < sectionIds.length; i++)
    {
        let sectionLessons = await findUserSectionDetailsBySectionId(userId, sectionIds[i])
        sectionLessons.forEach(el => 
        {
            lessonArr.push(el)
        })
    }
    let total = lessonArr.length
    let completed = lessonArr.filter(el => (el.manually_completed || el.automatically_completed)).length
    
    let retCourse = await findById(courseId)
    retCourse.course.total = total
    retCourse.course.completed = completed
    return retCourse
}

const db = require('../database/dbConfig')
const Courses = require('../courses/coursesModel')

module.exports = 
{
    find,
    findById,
    add,
    updatePathById,
    deletePathById,
    joinLearningPath,
    quitLearningPath,
    addPathTag,
    deletePathTag,
    addPathCourse,
    removePathCourse,
    updateCourseOrder,
    findForUserId,
    findPathItemsForPath,
    addPathItem,
    updatePathItem,
    deletePathItem,
    updateContentOrder,
    findForNotUserId,
    findForOwner,
    updatePathOrder,
    findYourPathById,
    togglePathItemCompletion,
    togglePathCompletion,
    findYourPathItemsForPath,
    
}

async function getUsernameByUserId(userId)
{
    let nameObj = await db('users as u')
        .select('u.first_name', 'u.last_name')
        .where({'u.id': userId}).first()


    return nameObj
}

function find() 
{
    return db('paths')
}

async function findForUserId(userId)
{
    let usersPaths = await db('paths as p')
        .join('users_paths as up', 'up.path_id', '=', 'p.id')
        .select('p.id', 'p.name', 'p.description', 'p.category', 'p.creator_id', 'up.user_path_order')
        .where({'up.user_id': userId})

    let yourPaths = []
    console.log(usersPaths)
    for(let i=0; i<usersPaths.length; i++)
    {
        let yourPath = await findYourPathById(userId, usersPaths[i].id)
        yourPath = yourPath.path
        yourPath.user_path_order = usersPaths[i].user_path_order
        console.log('c', yourPath)
        let total = 0
        let completed = 0
        yourPath.courses.forEach(el => 
        {
            total += el.total
            completed += el.completed
        })
        yourPath.pathItems.forEach(el =>
        {
            total += 1
            if(el.manually_completed || el.automatically_completed) completed++
        })
        yourPath.total = total
        yourPath.completed = completed
        yourPaths.push(yourPath)
    }
    // console.log(yourPaths)
    return yourPaths
    // return 1
}

async function findForOwner(userId)
{
    let ownedPaths = await db('paths as p').where({'p.creator_id': userId})
    for(let i=0; i<ownedPaths.length; i++)
    {
        let tempCourses = await findCoursesForPath(ownedPaths[i].id)
        tempCourses = tempCourses.map(el => el.id)
        ownedPaths[i].courseIds = tempCourses

        let tempPI = await findPathItemsForPath(ownedPaths[i].id)

        ownedPaths[i].contentLength = tempPI.length + tempCourses.length
    }

    return ownedPaths
}

async function findForNotUserId(userId)
{
    let allPaths = await find()
    let usersPaths = await findForUserId(userId)
    console.log('usersPaths', usersPaths)
    usersPaths = usersPaths.map(el => el.id)
    let notUsersPaths = allPaths.filter(el => !usersPaths.includes(el.id) )
    console.log('notUsersPaths', notUsersPaths)
    return notUsersPaths
}

function findByFilter(userId, filter, query) {
    return findForNotUserId(userId).select('*').where(`paths.${filter}`, query)
}

async function findById(id)
{
    try
    {
        let path = await db('paths').where({id}).first()
        
        if(!path) return {message: 'No learning path found with that ID', code: 404}
        path.tags = await getTagsForPath(id)
        path.courses = await findCoursesForPath(id)
        path.pathItems = await findPathItemsForPath(id)
        path.creatorId = path.creator_id
        // if(creatorId) path.creatorId = creatorId
        return {path, code: 200}
    }
    catch(error)
    {
        console.log('error from findById', error)
        return {message: error, code: 500}
    }
}

async function findYourPathById(userId, pathId)
{
    try
    {
        let path = await db('paths').where({'id': pathId}).first()
        
        if(!path) return {message: 'No learning path found with that ID', code: 404}
        path.tags = await getTagsForPath(pathId)
        let tempCourses = await findCoursesForPath(pathId)
        let pathCourses = []
        for(let i = 0; i < tempCourses.length; i++)
        {
            let completionCourse = await Courses.findYoursById(userId, tempCourses[i].id)
            completionCourse.path_order = tempCourses[i].path_order
            pathCourses.push(completionCourse)
        }
        path.courses = pathCourses
        path.pathItems = await findYourPathItemsForPath(userId, pathId)
        path.creatorId = path.creator_id
        path.creator = await getUsernameByUserId(path.creatorId)
        // if(creatorId) path.creatorId = creatorId
        return {path, code: 200}
    }
    catch(error)
    {
        console.log('error from findById', error)
        return {message: error, code: 500}
    }
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
    try
    {
        let creatorId = await db('paths as p')
            .join('users_paths as up', 'up.path_id', '=', 'p.id')
            .select('up.user_id')
            .where({ 'p.id': pathId, 'up.created': 1 })
        
        return creatorId[0].user_id
    }
    catch(error)
    {
        return 0
    }
}

async function findCoursesForPath(pathId)
{
    let courseList = await db('paths as p')
        .join('paths_courses as pc', 'pc.path_id', '=', 'p.id')
        .join('courses as c', 'pc.course_id', '=', 'c.id')
        .select('c.id', 'c.name', 'pc.path_order', 'c.link', 'c.description', 'c.foreign_instructors', 'c.foreign_rating')
        .where({ 'p.id': pathId })

    return courseList
}

function findPathItemsForPath(pathId)
{
    return db('path_items as pi').where({'pi.path_id': pathId})
}

async function findYourPathItemsForPath(userId, pathId)
{
    let retItems = await db('path_items as pi')
        .join('users_path_items as upi', 'upi.path_item_id', '=', 'pi.id')
        .select('pi.*', 'upi.manually_completed', 'upi.automatically_completed')
        .where({'pi.path_id': pathId, 'upi.user_id': userId})

    return retItems
}

async function addPathItem(userId, pathId, item)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path
    if(!path) return {message: 'No learning path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to change this path', code: 403}
    item.path_id = Number(pathId)
    console.log(item)
    let addReturn = await db('path_items').insert(item, 'id')
    console.log(addReturn)
    updateUsersPathItemsOnItemAdd(addReturn[0], pathId)
    return {code: 201, message: `item added to path`, id: addReturn[0] }
}

async function updatePathItem(userId, pathId, itemId, changes)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path
    if(!path) return {message: 'No learning path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to change this path', code: 403}
    await db('path_items').where({id: itemId}).update(changes)
    return {code: 200, message: `path item with id ${itemId} updated`, id: itemId }
}

async function togglePathItemCompletion(userId, pathId, itemId)
{
    try 
    {
        let currentPathItem = await db('users_path_items as upi')
            .where({'upi.user_id': userId, 'upi.path_item_id': itemId}).first()
        console.log(`curpathit`, currentPathItem)
        await db('users_path_items as upi')
            .where({'upi.user_id': userId, 'upi.path_item_id': itemId})
            .update({...currentPathItem, manually_completed: !currentPathItem.manually_completed})
        Courses.cascadeUp(userId, itemId, 'pathItem')
        return 1
    }
    catch(error)
    {
        return 0
    }
}

async function deletePathItem(userId, pathId, itemId)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path
    if(!path) return {message: 'No learning path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to change this path', code: 403}
    await db('path_items').where({id: itemId}).del()
    return {code: 200, message: `path item with id ${itemId} deleted`, id: itemId }
}

async function add(userId, path, order)
{
    path.creator_id = Number(userId)
    let pathIds = await db('paths').insert(path, 'id')
    let pathId = pathIds[0]
    if(pathId) 
    {
        let up = await db('users_paths').insert({user_id: userId, path_id: pathId, created: 1, user_path_order: order})
        
        return pathId
    }
}

async function updatePathById(userId, pathId, changes)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path
    if(!path) return {message: 'No learning path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to change this path', code: 403}
    await db('paths').where({id: pathId}).update(changes)
    return {code: 200}
}

async function togglePathCompletion(userId, pathId)
{
    // First we update the path's manual completion
    let pathObj = await findById(pathId)
    let path = pathObj.path
    if(!path) return {message: 'No learning path found with that ID', code: 404}
    let curUserPath = await db('users_paths as up')
        .where({'up.user_id': userId, 'up.path_id': pathId}).first()

    let isCompleted = !curUserPath.manually_completed

    await db('users_paths as up')
        .where({'up.user_id': userId, 'up.path_id': pathId})
        .update({...curUserPath, manually_completed: !curUserPath.manually_completed})

    // Next, we update the path items in the path to be automatically completed
    let pathItems = await findPathItemsForPath(pathId)
    for(let i=0; i<pathItems.length; i++)
    {
        await db('users_path_items as ups')
            .where({'ups.user_id': userId, 'ups.path_item_id': pathItems[i].id})
            .update({automatically_completed: !curUserPath.manually_completed})
    }

    // Next we update the courses in the path to be automatically completed
    let pathCourses = await findCoursesForPath(pathId)
    for(let i=0; i<pathCourses.length; i++)
    {
        await Courses.autoCourseCompleteToggle(userId, pathCourses[i].id, isCompleted)
    }

    return {code: 200}
}

async function deletePathById(userId, pathId)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path

    if(!path) return {message: 'No path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to change this path', code: 403}
    await db('paths').where({id: pathId}).del()
    return {code: 200}
}

async function joinLearningPath(userId, pathId, order)
{
    try
    {
        await db('users_paths').insert({ user_id: userId, path_id: pathId, user_path_order: order })
        let pathItems = await findPathItemsForPath(pathId)
        let pathCourses = await findCoursesForPath(pathId)
        await pathItems.forEach(el => addUserPathItem(userId, el.id))
        await pathCourses.forEach(el => addUserCourse(userId, el.id))
        return 1
    }
    catch(error)
    {
        console.log(`error from join learning path`, error)
        return 0
    }
}

async function addUserPathItem(userId, pathItemId)
{
    try
    {
        let existingEntry = await db('users_path_items').where({'user_id': userId, 'path_item_id': pathItemId}).first()
        console.log('existingEntry', existingEntry)
        if(!existingEntry)
        {
            await db('users_path_items').insert({user_id: userId, path_item_id: pathItemId})
        }
        return 1
    }
    catch(error)
    {
        console.log('error from addUserPathItem', error)
        return 0
    }
}

async function addUserCourse(userId, courseId)
{
    try
    {
        let existingEntry = await db('users_courses').where({'user_id': userId, 'course_id': courseId}).first()
        console.log('existingEntry', existingEntry)
        if(!existingEntry)
        {
            await db('users_courses').insert({user_id: userId, course_id: courseId})
            let sections = await Courses.findCourseSectionsByCourseId(courseId)
            sections.forEach(el => addUserSection(userId, el.id))
        }
        return 1
    }
    catch(error)
    {
        console.log('error from addUserCourse', error)
        return 0
    }
}

async function addUserSection(userId, sectionId)
{
    try
    {
        let existingEntry = await db('users_sections').where({'user_id': userId, 'section_id': sectionId}).first()
        console.log('existingEntry', existingEntry)
        if(!existingEntry)
        {
            await db('users_sections').insert({user_id: userId, section_id: sectionId})
            let sectionDetails = await Courses.findSectionDetailsByCourseSectionsId(sectionId)
            sectionDetails.forEach(el => addUserSectionDetail(userId, el.id))
        }
        return 1
    }
    catch(error)
    {
        console.log('error from addUserSection', error)
        return 0
    }
}

async function addUserSectionDetail(userId, sectionDetailId)
{
    try
    {
        let existingEntry = await db('users_section_details').where({'user_id': userId, 'section_detail_id': sectionDetailId}).first()
        console.log('existingEntry', existingEntry)
        if(!existingEntry)
        {
            await db('users_section_details').insert({user_id: userId, section_detail_id: sectionDetailId})
        }
        return 1
    }
    catch(error)
    {
        console.log('error from addUserSectionDetail', error)
        return 0
    }
}

function quitLearningPath(userId, pathId)
{
    return db('users_paths')
        .where({ user_id: userId, path_id: pathId })
        .del()
}

async function checkForTag(tagName)
{
    let tag = await db('tags').where({ name: tagName })
    if(tag.length === 0) return (-1)
    console.log('tag.id', tag[0].id)
    return tag[0].id 
}

async function addPathTag(userId, pathId, tag)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path

    if(!path) return {message: 'No path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to add tag to this path', code: 403}
    
    let tagId = await checkForTag(tag)
    if(tagId === -1) 
    {
        tagId = await db('tags').insert({name: tag}, 'id')
        await db('tags_paths').insert({tag_id: tagId[0], path_id: pathId})
    }
    else await db('tags_paths').insert({tag_id: tagId, path_id: pathId})
    
    return { message: 'tag added to path', code: 201 }
}

async function deletePathTag(userId, pathId, tag)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path

    if(!path) return {message: 'No path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to remove tags from this path', code: 403}

    let tagId = await checkForTag(tag)

    if(tagId === -1) 
    {
        return {message: 'Tag not found', code: 404}
    }
    else await db('tags_paths').where({tag_id: tagId, path_id: pathId}).del()
    
    return { message: 'tag removed from path', code: 200 }
}

async function findCourseById(id)
{
    let course = await db('courses').where({id}).first()
    
    if(!course) return false
    else return true
}

async function addPathCourse(userId, pathId, courseId, path_order)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path

    if(!path) return {message: 'No path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to add course to this path', code: 403}
    let courseExists = await findCourseById(courseId)
    // console.log('a', courseExists)
    if(!courseExists) return {message: 'Course not found', code: 404}
    else
    {
        let addReturn = await db('paths_courses').insert({ course_id: courseId, path_id: pathId, path_order }, 'course_id')
        let pathCourses = await findCoursesForPath(pathId)
        updateUsersCoursesOnCourseAdd(addReturn[0], pathId)
        return { message: 'Course added to path', code: 200, pathCourses }
    }
}

async function removePathCourse(userId, pathId, courseId)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path
    if(!path) return {message: 'No path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to add course to this path', code: 403}
    let courseExists = await findCourseById(courseId)
    if(!courseExists) return {message: 'Course not found', code: 404}
    else
    {
        await db('paths_courses').where({ course_id: courseId, path_id: pathId}).del()
        let pathCourses = await findCoursesForPath(pathId)
        return { message: 'Course removed from path', code: 200, pathCourses }
    }
}

async function updateCourseOrder(userId, pathId, courseId, path_order)
{
    let pathObj = await findById(pathId)
    let path = pathObj.path

    if(!path) return {message: 'No path found with that ID', code: 404}
    if(path.creatorId !== userId) return {message: 'User is not permitted to add course to this path', code: 403}
    let courseExists = await findCourseById(courseId)
    if(!courseExists) return {message: 'Course not found', code: 404}
    else
    {
        await db('paths_courses').where({path_id: pathId, course_id: courseId}).update({path_order})
        return { message: 'Course order updated in learning path', code: 200 }
    }
}

async function updateContentOrder(userId, pathId, content)
{
    try
    {
        let pathObj = await findById(pathId)
        let path = pathObj.path
    
        if(!path) return {message: 'No path found with that ID', code: 404}
        if(path.creatorId !== userId) return {message: 'User is not permitted to add course to this path', code: 403}
        for(let i=0; i<content.length; i++)
        {
            if(content[i].path_id && content[i].path_id === Number(pathId))
            {
                await updatePathItem(userId, pathId, content[i].id, {path_order: content[i].path_order})
            }
            else
            {
                await updateCourseOrder(userId, pathId, content[i].id, content[i].path_order)
            }
        }
        return {message: 'Learning Path order updated', code: 200}
    }
    catch(error)
    {
        return {message: 'Error updating learning path order', code: 500}
    }
}

async function updatePathOrder(userId, pathOrderArray)
{
    // console.log('pathOrderArray', pathOrderArray)
    try
    {
        let usersPaths = await db('users_paths')
            .where({'user_id': userId})

        // console.log(`usersPaths`, usersPaths)
        let pathOrderIds = pathOrderArray.map(el => el.pathId)
        for(let i=0; i<usersPaths.length; i++)
        {
            let ind = pathOrderIds.indexOf(usersPaths[i].path_id)
            if(ind >= -1)
            {
                console.log('ind',ind)
                console.log('pathorderarr[ind]', pathOrderArray[ind])
                let user_path_order = pathOrderArray[ind].userPathOrder
                await db('users_paths').where({path_id: usersPaths[i].path_id, user_id: userId}).update({user_path_order})
            }
        }
        return {code: 200, message: 'User\'s path order updated'}
    }
    catch(error)
    {
        console.log('error', error)
        return {code: 500, message: 'Internal error: Could not update learning path order'}
    }
}

async function updateUsersCoursesOnCourseAdd(courseId, pathId)
{
    let pathUsers = await db('paths as p')
        .join('users_paths as up', 'up.path_id', '=', 'p.id')
        .select('up.user_id')
        .where({'p.id': pathId})
    let pathUsersIds = pathUsers.map(el => el.user_id)

    let courseUsers = await db('courses as c')
        .join('users_courses as uc', 'uc.course_id',  '=', 'c.id')
        .select('uc.user_id')
        .where({'c.id': courseId})
    
    let courseUsersIds = courseUsers.map(el => el.user_id)

    console.log('courseUserIds', courseUsersIds)
    console.log('pathUsersIds', pathUsersIds)
    
    pathUsersIds = pathUsersIds.filter(el => !courseUsersIds.includes(el))
    
    console.log('filtered pathUsersIds', pathUsersIds)

    for(let i=0; i < pathUsersIds.length; i++)
    {

        try
        {
            await db('users_courses')
                .insert({user_id: pathUsersIds[i], course_id: courseId})
        }
        catch(error)
        {

        }
    }
}

async function updateUsersPathItemsOnItemAdd(itemId, pathId)
{
    let pathUsers = await db('paths as p')
        .join('users_paths as up', 'up.path_id', '=', 'p.id')
        .select('up.user_id')
        .where({'p.id': pathId})
    let pathUsersIds = pathUsers.map(el => el.user_id)
    for(let i=0; i < pathUsersIds.length; i++)
    {
        await db('users_path_items')
            .insert({user_id: pathUsersIds[i], path_item_id: itemId})
    }
}
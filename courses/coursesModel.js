const db = require('../database/dbConfig');
// const Paths = require('../learning-paths/learningPathsModel')


module.exports = {
    find,
    // findUserById,
    findById,
    findByFilter,
    findCoursesByOwner,
    findByTag,
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
    autoCourseCompleteToggle,
    itemCascadeUp,
    cascadeUp,
    generateUdemyCourse,
    findAllCoursesForUser,
    checkDbForCourseUrl,
    update
}

function find() {
    return db('courses')
}

async function findCoursesByOwner(name) {
    let nameTweak = name.toLowerCase();
    //looks for users using search input value, checks many possible case sensitivities
    let users = db('users').orWhereRaw("LOWER(first_name || ' ' || last_name) ~ ?", [nameTweak])
    return findCoursesForUsers(users)
}

async function findCoursesForUsers(users) {
    return users.map(async user => {
        return db("courses")
        .join('users', 'courses.creator_id', 'users.id')
        .where('courses.creator_id', user.id)
        .select('courses.*', 'users.first_name as creator_first_name', 'users.last_name as creator_last_name')
    }).then(result => {
        let flattenedArray = result.flatMap(arr => arr)
        return flattenedArray
    })
}

function findByFilter(filter, query) {
    let queryTweak = query.toLowerCase();
    return db('courses')
        .whereRaw(`LOWER(courses.${filter}) ~ ?`, [queryTweak])
}

function findByTag(tag) {
    let tagTweak = tag.toLowerCase();
    return db('courses')
        .join('tags_courses', 'tags_courses.course_id', 'courses.id')
        .join('tags', 'tags.id', 'tags_courses.tag_id')
        .whereRaw('LOWER(tags.name) ~ ?', [tagTweak])
        .then(result => {
            return result
        })
}

async function findById(id) {
    let course = await db('courses').where({ id }).first()

    if (!course) return { message: 'No course found with that ID', code: 404 }
    course.tags = await getTagsForCourse(id)
    return { course, code: 200 }
}

async function findAllCoursesForUser(userId) {

    let usersPaths = await db('users_paths as up').select('up.path_id').where({ 'up.user_id': userId })
    usersPaths = usersPaths.map(el => el.path_id)

    let courses = []
    for (let i = 0; i < usersPaths.length; i++) {
        let tempPathCourses = await db('paths_courses as pc')
            .join('courses as c', 'pc.course_id', '=', 'c.id')
            .join('users_courses as uc', 'uc.course_id', '=', 'c.id')
            .select('c.*', 'uc.manually_completed', 'uc.automatically_completed')
            .where({ 'pc.path_id': usersPaths[i], 'uc.user_id': userId })

        tempPathCourses.forEach(el => {
            let curCourseIds = courses.map(elem => elem.id)
            if (!curCourseIds.includes(el.id)) courses.push(el)
        })
    }

    // let courses = await db('users_courses as uc')
    //     .join('courses as c', 'uc.course_id', '=', 'c.id')
    //     .select('c.*', 'uc.automatically_completed', 'uc.manually_completed')
    //     .where({'uc.user_id': userId})

    return courses
}

async function add(userId, courseObj) {
    courseObj.creator_id = userId
    let ids = await db('courses').insert(courseObj, 'id')
    let courseId = ids[0]
    await db('users_courses').insert({ user_id: userId, course_id: courseId, manually_completed: false, automatically_completed: false })
    return ids
}

async function updateCourseById(courseId, changes) {
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if (!course) return { message: 'No course found with that ID', code: 404 }
    await db('courses').where({ id: courseId }).update(changes)
    return { code: 200 }
}
// NEED TO VERIFY CONDITIONAL HERE
async function deleteCourseById(courseId) {
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if (!course) return { message: 'No course found with that ID', code: 404 }
    let delReturn = await db('courses').where({ id: courseId }).del()
    return { code: 200 }
}

async function addCourseTag(courseId, tag) {
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if (!course) return { message: 'No course found with that ID', code: 404 }

    let tagId = await checkForTag(tag)
    if (tagId === -1) {
        tagId = await db('tags').insert({ name: tag }, 'id')
        console.log('tagId from add', tagId[0])
        await db('tags_courses').insert({ tag_id: tagId[0], course_id: courseId })
    }
    else await db('tags_courses').insert({ tag_id: tagId, course_id: courseId })

    return { message: 'tag added to course', code: 201 }
}

async function deleteCourseTag(courseId, tag) {
    let courseObj = await findById(courseId)
    let course = courseObj.course


    if (!course) return { message: 'No course found with that ID', code: 404 }

    let tagId = await checkForTag(tag)

    if (tagId === -1) {
        return { message: 'Tag not found', code: 404 }
    }
    else await db('tags_courses').where({ tag_id: tagId, course_id: courseId }).del()

    return { message: 'tag removed from course', code: 200 }
}

async function checkForTag(tagName) {
    let tag = await db('tags').where({ name: tagName })
    if (tag.length === 0) return (-1)
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
        .where({ 'cs.course_id': id })
    return details
}

async function addCourseSection(userId, courseId, section) {
    const owner = req.user.owner
    const admin = req.user.admin
    const moderator = req.user.moderator
    let courseObj = await findById(courseId)
    let course = courseObj.course
    if (!course) return { message: 'No course found with that ID', code: 404 }
    if (course.creator_id !== userId && owner === false && admin === false && moderator === false) return { message: 'User is not permitted to add sections to this course', code: 403 }
    section.course_id = courseId
    let addReturn = await db('course_sections')
        .insert(section, 'id')
    await updateUsersSectionsOnSectionAdd(addReturn[0], courseId)
    return { code: 201, message: addReturn }
}

async function updateCourseSection(courseId, sectionId, changes) {
    let courseObj = await findById(courseId)
    let course = courseObj.course
    if (!course) return { message: 'No course found with that ID', code: 404 }
    // if (course.creator_id !== userId) return { message: 'User is not permitted to update sections to this course', code: 403 }
    let updatereturn = await db('course_sections')
        .where({ id: sectionId })
        .update(changes)
    return { code: 200, message: updatereturn }
}

async function deleteCourseSection(courseId, sectionId) {
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if (!course) return { message: 'No course found with that ID', code: 404 }

    await db('course_sections')
        .where({ id: sectionId })
        .del()
    return { code: 200, message: 'delete successful' }
}

async function findSectionDetailsByCourseSectionsId(id) {
    let section = await db('section_details as sd')
        .where({ 'sd.course_sections_id': id })
    return section
}

async function addSectionDetails(userId, courseId, details) {
    let courseObj = await findById(courseId)
    let course = courseObj.course
    if (!course) return { message: 'No course found with that ID', code: 404 }
    // if (course.creator_id !== userId) return { message: 'User is not permitted to add Details to this Course Section', code: 403 }
    else {
        let addreturn = await db('section_details')
            .insert(details, 'id')
        // console.log('addreturn', addreturn)
        await updateUsersLessonsOnLessonAdd(addreturn[0], details.course_sections_id)
        return { code: 200, message: addreturn }
    }
}

async function updateSectionDetails(courseId, sectionId, detailId, changes) {
    let courseObj = await findById(courseId)
    let course = courseObj.course

    if (!course) return { message: 'No course found with that ID', code: 404 }
    // if (course.creator_id !== userId) return { message: 'User is not permitted to add Details to this Course Section', code: 403 }
    else {
        let addreturn = await db('section_details')
            .where({ id: detailId, course_sections_id: sectionId })
            .update(changes)
        return { code: 200, message: addreturn }
    }
}

async function deleteSectionDetails(courseId, sectionId, detailId) {
    let courseObj = await findById(courseId)
    let course = courseObj.course


    if (!course) return { message: 'No course found with that ID', code: 404 }

    await db('section_details')
        .where({ id: detailId, course_sections_id: sectionId })
        .del()
    return { code: 200, message: 'delete successful' }
}

async function lessonCascadeUp(userId, contentId) {
    try {
        let sectionId = await db('section_details as sd')
            .select('sd.course_sections_id')
            .where({ id: contentId }).first()
        let userSectionDetails = await findUserSectionDetailsBySectionId(userId, sectionId.course_sections_id)
        isComplete = userSectionDetails.every(el => el.automatically_completed || el.manually_completed)
        userSectionDetails.forEach(el => {
            if (!(el.manually_completed) && !(el.automatically_completed)) { console.log(el) }
        })
        await db('users_sections as us')
            .where({ 'us.section_id': sectionId.course_sections_id, 'us.user_id': userId })
            .update({ automatically_completed: isComplete })

        return sectionId.course_sections_id
    }
    catch (error) {
        return 0
    }
}

async function sectionCascadeUp(userId, contentId) {
    try {
        let courseId = await db('course_sections as cs')
            .select('cs.course_id')
            .where({ id: contentId }).first()
        let userSections = await findUserSectionsByCourseId(userId, courseId.course_id)
        isComplete = userSections.every(el => el.automatically_completed || el.manually_completed)
        let a = await db('users_courses as uc')
            .where({ 'uc.course_id': courseId.course_id, 'uc.user_id': userId })
            .update({ automatically_completed: isComplete })
        return courseId.course_id
    }

    catch
    {
        return 0
    }
}

function findYourPathItemsForPath(userId, pathId) {
    return db('path_items as pi')
        .join('users_path_items as upi', 'upi.path_item_id', '=', 'pi.id')
        .select('pi.*', 'upi.manually_completed', 'upi.automatically_completed')
        .where({ 'pi.path_id': pathId, 'upi.user_id': userId })
}

async function courseCascadeUp(userId, contentId) {
    try {
        let pathIds = await db('courses as c')
            .join('paths_courses as pc', 'pc.course_id', '=', 'c.id')
            .select('pc.path_id')
            .where({ 'c.id': contentId })
        console.log('pathIds, pathIds.length', pathIds, pathIds.length)
        for (let i = 0; i < pathIds.length; i++) {
            let tempPathCourses = await findUserCoursesByPathId(userId, pathIds[i].path_id)
            let tempPathItems = await findYourPathItemsForPath(userId, pathIds[i].path_id)
            let isCoursesComplete = tempPathCourses.every(el => el.automatically_completed || el.manually_completed)
            let isItemsComplete = tempPathItems.every(el => el.automatically_completed || el.manually_completed)
            let isComplete = (isCoursesComplete && isItemsComplete)
            await db('users_paths as up')
                .where({ 'up.path_id': pathIds[i].path_id, 'up.user_id': userId })
                .update({ automatically_completed: isComplete })
        }
        return 1
    }
    catch (error) {
        return 0
    }
}

async function itemCascadeUp(userId, contentId) {
    try {
        let pathId = await db('path_items as pi').select('pi.path_id').where({ id: contentId }).first()
        let pathCourses = await findUserCoursesByPathId(userId, pathId.path_id)
        let pathItems = await findYourPathItemsForPath(userId, pathId.path_id)
        let isCoursesComplete = pathCourses.every(el => el.automatically_completed || el.manually_completed)
        let isItemsComplete = pathItems.every(el => el.automatically_completed || el.manually_completed)
        let isComplete = (isCoursesComplete && isItemsComplete)
        console.log('isComplete', isComplete)
        await db('users_paths as up')
            .where({ 'up.path_id': pathId.path_id, 'up.user_id': userId })
            .update({ automatically_completed: isComplete })
        return 1
    }
    catch
    {
        return 0
    }
}

async function cascadeUp(userId, contentId, contentType) {
    if (contentType === 'lesson') {
        let sectionId = await lessonCascadeUp(userId, contentId)
        if (sectionId > 0) {
            let courseId = await sectionCascadeUp(userId, sectionId)
            if (courseId > 0) {
                await courseCascadeUp(userId, courseId)
            }
        }
    }
    if (contentType === 'section') {
        let courseId = await sectionCascadeUp(userId, contentId)
        if (courseId > 0) {
            await courseCascadeUp(userId, contentId)
        }
    }
    if (contentType === 'course') {
        await courseCascadeUp(userId, contentId)
    }
    if (contentType === 'pathItem') {
        await itemCascadeUp(userId, contentId)
    }
}

async function findUserSectionDetailsBySectionId(userId, sectionId) {
    try {
        return await db('course_sections as cs')
            .join('section_details as sd', 'sd.course_sections_id', '=', 'cs.id')
            .join('users_section_details as usd', 'usd.section_detail_id', '=', 'sd.id')
            .select('usd.*')
            .where({ 'usd.user_id': userId, 'cs.id': sectionId })
    }
    catch (error) {
        return 0
    }
}

async function manualLessonCompleteToggle(userId, courseId, sectionId, sectionDetailId) {
    try {
        let userLesson = await db('users_section_details').where({ user_id: userId, section_detail_id: sectionDetailId }).first()
        notIsCompleted = !(userLesson.manually_completed || userLesson.automatically_completed)
        console.log('notIsCompleted', notIsCompleted)
        userLesson.manually_completed = notIsCompleted
        if (!notIsCompleted) userLesson.automatically_completed = notIsCompleted
        await db('users_section_details').where({ user_id: userId, section_detail_id: sectionDetailId }).update(userLesson)
        await cascadeUp(userId, userLesson.section_detail_id, 'lesson')

        return { code: 200, message: 'Lesson completion toggled' }
    }
    catch (error) {
        console.log(error)
        return { code: 500, message: 'Internal Error: Could not toggle lesson completion' }
    }
}

async function findUserSectionsByCourseId(userId, courseId) {
    try {
        return await db('courses as c')
            .join('course_sections as cs', 'cs.course_id', '=', 'c.id')
            .join('users_sections as us', 'us.section_id', '=', 'cs.id')
            .select('us.*')
            .where({ 'us.user_id': userId, 'c.id': courseId })
    }
    catch (error) {
        return 0
    }
}

async function manualSectionCompleteToggle(userId, courseId, sectionId) {
    try {
        let userSection = await db('users_sections').where({ user_id: userId, section_id: sectionId }).first()
        userSection.manually_completed = !userSection.manually_completed
        await db('users_sections').where({ user_id: userId, section_id: sectionId }).update(userSection)

        // automatically complete lessons below section for user
        let usersSectionDetails = await db('course_sections as cs')
            .join('section_details as sd', 'sd.course_sections_id', '=', 'cs.id')
            .join('users_section_details as usd', 'usd.section_detail_id', '=', 'sd.id')
            .select('usd.*')
            .where({ 'cs.id': sectionId, 'usd.user_id': userId })

        for (let i = 0; i < usersSectionDetails.length; i++) {
            // console.log('toggling lessons in section', usersSectionDetails[i].section_detail_id)
            await db('users_section_details').where({ user_id: userId, section_detail_id: usersSectionDetails[i].section_detail_id })
                .update({ automatically_completed: userSection.manually_completed })
        }

        //automatically complete course above section if all sections complete
        await cascadeUp(userId, sectionId, 'section')

        return { code: 200, message: 'Section completion toggled' }
    }
    catch (error) {
        console.log(error)
        return { code: 500, message: 'Internal Error: Could not toggle section completion' }
    }
}

async function findUserCoursesByPathId(userId, pathId) {
    try {
        console.log('userId, pathId', userId, pathId)
        return await db('paths as p')
            .join('paths_courses as pc', 'pc.path_id', '=', 'p.id')
            .join('users_courses as uc', 'uc.course_id', '=', 'pc.course_id')
            .select('uc.*')
            .where({ 'uc.user_id': userId, 'pc.path_id': pathId })
    }
    catch (error) {
        return 0
    }
}

async function findPathIdsForUserIdCourseId(userId, courseId) {
    try {
        return await db('paths as p')
            .join('paths_courses as pc', 'pc.path_id', '=', 'p.id')
            .join('users_paths as up', 'pc.path_id', '=', 'p.id')
            .select('p.id')
            .where({ 'up.user_id': userId, 'pc.course_id': courseId })
    }
    catch (error) {
        return 0
    }
}

async function manualCourseCompleteToggle(userId, courseId) {
    try {
        let userCourse = await db('users_courses').where({ user_id: userId, course_id: courseId }).first()
        userCourse.manually_completed = !userCourse.manually_completed
        if (!userCourse.manually_completed) userCourse.automatically_completed = userCourse.manually_completed

        await db('users_courses').where({ user_id: userId, course_id: courseId }).update(userCourse)

        // automatically complete sections below course for user
        let usersSections = await db('courses as c')
            .join('course_sections as cs', 'cs.course_id', '=', 'c.id')
            .join('users_sections as us', 'us.section_id', '=', 'cs.id')
            .select('us.*')
            .where({ 'c.id': courseId, 'us.user_id': userId })

        for (let i = 0; i < usersSections.length; i++) {
            // console.log('toggling sections in course. Section ID:', usersSections[i].section_id)
            await db('users_sections').where({ user_id: userId, section_id: usersSections[i].section_id })
                .update({ automatically_completed: userCourse.manually_completed })

            // automatically complete lessons below each section for user
            let sectionId = usersSections[i].section_id
            let usersSectionDetails = await db('course_sections as cs')
                .join('section_details as sd', 'sd.course_sections_id', '=', 'cs.id')
                .join('users_section_details as usd', 'usd.section_detail_id', '=', 'sd.id')
                .select('usd.*')
                .where({ 'cs.id': sectionId, 'usd.user_id': userId })

            for (let j = 0; j < usersSectionDetails.length; j++) {
                let lessonAutComp = (usersSections[i].manually_completed || userCourse.manually_completed)
                // console.log('toggling lessons in section. Lesson ID:', usersSectionDetails[j].section_detail_id)
                await db('users_section_details').where({ user_id: userId, section_detail_id: usersSectionDetails[j].section_detail_id })
                    .update({ automatically_completed: lessonAutComp })
            }
        }



        //automatically complete path above course if all courses complete

        // Find Path IDs for all paths that have the course, that the user is on.
        // let pathIds = await findPathIdsForUserIdCourseId(userId, courseId)
        // for(let i=0; i<pathIds.length; i++)
        // {
        //     // Find all courses in those paths, then check if all complete. If so, auto-complete the path
        //     let userCourses = await findUserCoursesByPathId(userId, pathIds[i].id)
        //     console.log('blah', userCourses)
        //     let isComplete = userCourses.every(el => el.automatically_completed || el.manually_completed)
        //     if(isComplete) await db('users_paths as up')
        //         .where({'up.path_id': pathIds[i].id, 'up.user_id': userId})
        //         .update({automatically_completed: true})

        // }
        await cascadeUp(userId, courseId, 'course')

        return { code: 200, message: 'Course completion toggled' }
    }
    catch (error) {
        console.log(error)
        return { code: 500, message: 'Internal Error: Could not toggle course completion' }
    }
}

async function getLessonsWithUserCompletion(userId, sectionId) {
    let userLessons = await db('section_details as sd')
        .join('users_section_details as usd', 'sd.id', '=', 'usd.section_detail_id')
        .select('sd.*', 'usd.manually_completed', 'usd.automatically_completed')
        .where({ 'sd.course_sections_id': sectionId, 'usd.user_id': userId })
    return userLessons
}

async function findYourCourseSectionsByCourseId(userId, courseId) {
    let userSections = await findUserSectionsByCourseId(userId, courseId)
    let sectionIds = userSections.map(el => el.section_id)
    let sectionArr = []
    for (let i = 0; i < sectionIds.length; i++) {
        let tempSection = await db('course_sections as cs')
            .where({ 'cs.id': sectionIds[i] }).first()

        let tempUserSection = userSections.find(el => el.section_id === sectionIds[i])
        tempSection.manually_completed = tempUserSection.manually_completed
        tempSection.automatically_completed = tempUserSection.automatically_completed
        sectionArr.push(tempSection)

    }
    return sectionArr
}

async function findYoursById(userId, courseId) {
    let userSections = await findUserSectionsByCourseId(userId, courseId)
    let sectionIds = userSections.map(el => el.section_id)
    let lessonArr = []
    for (let i = 0; i < sectionIds.length; i++) {
        let sectionLessons = await findUserSectionDetailsBySectionId(userId, sectionIds[i])
        sectionLessons.forEach(el => {
            lessonArr.push(el)
        })
    }
    let total = lessonArr.length
    let completed = lessonArr.filter(el => (el.manually_completed || el.automatically_completed)).length

    let retCourse = await findById(courseId)
    retCourse.course.total = total
    retCourse.course.completed = completed
    let manAutComp = await db('users_courses as uc')
        .select('uc.manually_completed', 'uc.automatically_completed')
        .where({ 'uc.course_id': courseId, 'uc.user_id': userId }).first()

    retCourse.course.manually_completed = manAutComp.manually_completed
    retCourse.course.automatically_completed = manAutComp.automatically_completed

    return retCourse.course
}

async function autoCourseCompleteToggle(userId, courseId, isPathCompleted) {
    try {
        let userCourse = await db('users_courses').where({ user_id: userId, course_id: courseId }).first()
        userCourse.automatically_completed = isPathCompleted
        await db('users_courses').where({ user_id: userId, course_id: courseId }).update(userCourse)

        // automatically complete sections below course for user
        let usersSections = await db('courses as c')
            .join('course_sections as cs', 'cs.course_id', '=', 'c.id')
            .join('users_sections as us', 'us.section_id', '=', 'cs.id')
            .select('us.*')
            .where({ 'c.id': courseId, 'us.user_id': userId })

        for (let i = 0; i < usersSections.length; i++) {
            // console.log('toggling sections in course. Section ID:', usersSections[i].section_id)
            await db('users_sections').where({ user_id: userId, section_id: usersSections[i].section_id })
                .update({ automatically_completed: isPathCompleted })

            // automatically complete lessons below each section for user
            let sectionId = usersSections[i].section_id
            let usersSectionDetails = await db('course_sections as cs')
                .join('section_details as sd', 'sd.course_sections_id', '=', 'cs.id')
                .join('users_section_details as usd', 'usd.section_detail_id', '=', 'sd.id')
                .select('usd.*')
                .where({ 'cs.id': sectionId, 'usd.user_id': userId })

            for (let j = 0; j < usersSectionDetails.length; j++) {
                // console.log('toggling lessons in section. Lesson ID:', usersSectionDetails[j].section_detail_id)
                await db('users_section_details').where({ user_id: userId, section_detail_id: usersSectionDetails[j].section_detail_id })
                    .update({ automatically_completed: isPathCompleted })
            }
        }

        //automatically complete path above course if all courses complete

        // Find Path IDs for all paths that have the course, that the user is on.
        let pathIds = await findPathIdsForUserIdCourseId(userId, courseId)
        for (let i = 0; i < pathIds.length; i++) {
            // Find all courses in those paths, then check if all complete. If so, auto-complete the path
            let userCourses = await findUserCoursesByPathId(userId, pathIds[i].id)
            console.log('blah', userCourses)
            let isComplete = userCourses.every(el => el.automatically_completed || el.manually_completed)
            if (isComplete) await db('users_paths as up')
                .where({ 'up.path_id': pathIds[i].id, 'up.user_id': userId })
                .update({ automatically_completed: true })
            else await db('users_paths as up')
                .where({ 'up.path_id': pathIds[i].id, 'up.user_id': userId })
                .update({ automatically_completed: false })
        }

        return { code: 200, message: 'Course completion toggled' }
    }
    catch (error) {
        console.log(error)
        return { code: 500, message: 'Internal Error: Could not toggle course completion' }
    }
}

async function updateUsersLessonsOnLessonAdd(lessonId, sectionId) {
    let sectionUsers = await db('course_sections as cs')
        .join('users_sections as us', 'us.section_id', '=', 'cs.id')
        .select('us.user_id')
        .where({ 'cs.id': sectionId })
    let sectionUsersIds = sectionUsers.map(el => el.user_id)
    for (let i = 0; i < sectionUsersIds.length; i++) {
        await db('users_section_details')
            .insert({ user_id: sectionUsersIds[i], section_detail_id: lessonId })
        await cascadeUp(sectionUsersIds[i], lessonId, 'lesson')
    }
} // 😈

async function updateUsersSectionsOnSectionAdd(sectionId, courseId) {
    let courseUsers = await db('courses as c')
        .join('users_courses as uc', 'uc.course_id', '=', 'c.id')
        .select('uc.user_id')
        .where({ 'c.id': courseId })
    let courseUsersIds = courseUsers.map(el => el.user_id)
    for (let i = 0; i < courseUsersIds.length; i++) {
        await db('users_sections')
            .insert({ user_id: courseUsersIds[i], section_id: sectionId })
        await cascadeUp(courseUsersIds[i], sectionId, 'section')
    }
}

async function generateUdemyCourse(userId, link, results, details) {
    let title = details.courseTitle
    let foreign_instructors = ''
    details.instructors.forEach((el, index) => {
        if (details.instructors.length > 1 && index != details.instructors.length - 1) {
            foreign_instructors += el + ', '
        }
        else foreign_instructors += el
    })

    // console.log('foreign_instructors', foreign_instructors)
    // console.log('name', name)

    let courseObj =
    {
        title,
        foreign_instructors,
        link,
        creator_id: userId
    }

    let courseId = await add(userId, courseObj)
    courseId = courseId[0]
    // console.log('courseId', courseId)

    let sectionId
    let sectionOrder = 1
    let lessonOrder = 1

    let chapterFound = false
    if (results[0]._class !== "chapter") {
        for (let i = 0; i < results.length && !chapterFound; i++) {
            if (results[i]._class === "chapter") {
                let section = results.splice(i, 1)
                results.unshift(section[0])
                chapterFound = true
            }
        }
    }

    for (let i = 0; i < results.length; i++) {
        if (results[i]._class === "chapter") {
            console.log('section title', results[i].title)
            let section =
            {
                name: results[i].title,
                description: results[i].description,
                order: sectionOrder,
            }
            // console.log('section', section)
            sectionOrder++ ,
                lessonOrder = 1
            sectionId = await addCourseSection(userId, courseId, section)
            sectionId = sectionId.message[0]
            console.log('sectionId', sectionId)
        }
        else if (results[i]._class === "lecture") {
            let asset_type = ""
            if (results[i].asset && results[i].asset.asset_type) asset_type = results[i].asset.asset_type

            let lesson =
            {
                name: results[i].title,
                description: results[i].description,
                course_sections_id: sectionId,
                order: lessonOrder,
                link: `${link}learn/lecture/${results[i].id}`,
                type: asset_type
            }
            lessonOrder++
            lessonId = await addSectionDetails(userId, courseId, lesson)
            lessonId = lessonId.message[0]
        }
        else if (results[i]._class === "quiz") {

            let lesson =
            {
                name: results[i].title,
                description: results[i].description,
                course_sections_id: sectionId,
                order: lessonOrder,
                link: `${link}learn/quiz/${results[i].id}`,
                type: "quiz"
            }
            lessonOrder++
            lessonId = await addSectionDetails(userId, courseId, lesson)
            lessonId = lessonId[0]
        }
        // https://www.udemy.com/course/complete-react-developer-zero-to-mastery/learn/lecture/15081792#overview
        // https://www.udemy.com/course/complete-react-developer-zero-to-mastery/
    }

    return db('courses').where({ id: courseId }).first()
}

async function checkDbForCourseUrl(link) {
    let course = await db('courses as c')
        .where({ link }).first()

    if (!course) return { courseFound: false, id: -1 }
    else return { courseFound: true, id: course.id }
}

function update(id, changes) {
    return db("courses")
        .where({ id })
        .update(changes);
}
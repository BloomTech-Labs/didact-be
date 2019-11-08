const router = require('express').Router()
const Paths = require('./learningPathsModel')
const Users = require('../users/usersModel')

// async function filterByTag(aLearningPaths, tag)
// {
//     let retArr = []
//     for(let i=0; i<aLearningPaths.length; i++)
//     {
//         let tags = await Paths.getTagsForPath(aLearningPaths[i].id)
//         tags = tags.map(el => el.toLowerCase())
//         if(tags.includes(tag.toLowerCase())) retArr.push(aLearningPaths[i])
//     }
//     return retArr
// }

router.get('/', (req, res) => {
    
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.findForNotUserId(user.id)
            .then(response =>
            {
                res.status(200).json(response)
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
            })
        }
        else res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
    })
})

router.get('/yours', (req, res) => {
    
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.findForUserId(user.id)
            .then(response =>
            {
                res.status(200).json(response)
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
            })
        }
        else res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
    })
})

router.get('/yours-owned', (req, res) => {
    
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.findForOwner(user.id)
            .then(response =>
            {
                res.status(200).json(response)
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
            })
        }
        else res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Error, could not find user to check learning paths for' })
    })
})

router.get('/:id', (req, res) => {
    Paths.findById(req.params.id)
    .then(response => 
        {
            if(response.code === 404) res.status(404).json({ message: response.message })
            else if (response.code === 500) res.status(500).json({ message: response.message })
            else res.status(200).json(response.path)
        })
    .catch(error => 
        {
            res.status(500).json({ message: 'Error connecting with server' })
        })
})

function validateLearningPath(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "Missing learning path data"})
    else if(!req.body.name) res.status(400).json({ message: "Learning Path name is required"})
    else next()
}

router.post('/', validateLearningPath, (req, res) => {
    const path = req.body
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.add(user.id, path)
                .then(response => 
                {
                    res.status(201).json({id: response})
                })
                .catch(error => {
                    res.status(500).json({ message: 'Could not add learning path' })
                })
        }
        else res.status(500).json({ message: 'Could not find user to add learning path for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to add learning path for' })
    })
})

router.put('/:id', (req, res) => {
    if(!req.body.changes) res.status(400).json({ message: 'Missing learning path changes' })
    else
    {
        const changes = req.body.changes
        let email = req.user.email
        Users.findBy({ email })
        .then(user =>
        {
            if(user)
            {
                Paths.updatePathById(user.id, req.params.id, changes)
                .then(response => 
                {
                    if(response.code === 404) res.status(404).json({message: response.message})
                    else if(response.code === 403) res.status(403).json({message: response.message})
                    else res.status(200).json({ message: 'Learning path updated' })
                })
                .catch(error => 
                {
                    res.status(500).json({ message: 'Could not edit learning path' })
                })
            }
            else res.status(500).json({ message: 'Could not find user to edit learning path for' })
        })
        .catch(err =>
        {
            res.status(500).json({ message: 'Could not find user to edit learning path for' })
        })
    }
})

router.delete('/:id', (req, res) => {

    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
        {
            if(user)
            {
                Paths.deletePathById(user.id, req.params.id)
                    .then(response => {
                        if(response.code === 404) res.status(404).json({message: response.message})
                        else if(response.code === 403) res.status(403).json({message: response.message})
                        else res.status(200).json({ message: 'Learning path deleted' })
                    })
                    .catch(error => {
                        res.status(500).json({ message: 'Could not delete learning path' })
                    })
            }
            else res.status(500).json({ message: 'Could not find user to delete learning path for' })
        })
    .catch(err =>
        {
            res.status(500).json({ message: 'Could not find user to delete learning path for' })
        })
})
//TODO: Validate order, update docs
router.post('/:id/users', (req, res) => {
    let email = req.user.email
    let order = req.body.order
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.joinLearningPath(user.id, req.params.id, order)
            .then(response => 
            {
                console.log('b')
                res.status(200).json({ message: 'Joined learning path' })
            })
            .catch(error => {
                console.log('a')
                res.status(500).json({ message: 'Could not join learning path' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to join learning path' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to join learning path' })
    })
})

router.delete('/:id/users', (req, res) => {
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.quitLearningPath(user.id, req.params.id)
            .then(response => 
            {
                console.log('b')
                res.status(200).json({ message: 'Quit learning path' })
            })
            .catch(error => {
                console.log('a')
                res.status(500).json({ message: 'Could not quit learning path' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to quit learning path' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to quit learning path' })
    })
})

router.post('/:id/tags', (req, res) => {
    const pathId = req.params.id
    let email = req.user.email
    if(!req.body.tag) res.status(400).json({ message: "Missing tag data" })
    else
    {
        Users.findBy({ email })
            .then(user =>
            {
                if(user)
                {
                    Paths.addPathTag(user.id, pathId, req.body.tag)
                    .then(response => 
                    {
                        if(response.code === 201) res.status(201).json({ message: response.message })
                        else res.status(response.code).json({ message: response.message })
                    })
                    .catch(error => 
                    {
                        console.log(error)
                        res.status(500).json({ message: 'Internal error: Could not add tag to learning path' })
                    })
                }
                else res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
    }
})

router.delete('/:id/tags', (req, res) => {
    if(!req.body.tag)
    {
        res.status(400).json({ message: "Missing tag data" })
    }
    else
    {
        const pathId = req.params.id
        let email = req.user.email
        Users.findBy({ email })
            .then(user =>
                {
                    if(user)
                    {
                        Paths.deletePathTag(user.id, pathId, req.body.tag)
                        .then(response => 
                            {
                                if(response.code === 200) res.status(200).json({ message: response.message })
                                else res.status(response.code).json({ message: response.message })
                            })
                        .catch(error => 
                            {
                                console.log(error)
                                res.status(500).json({ message: 'Internal error: Could not remove tags from path' })
                            })
                    }
                    else res.status(500).json({ message: 'Could not find user to remove tag for' })
                })
            .catch(err =>
                {
                    res.status(500).json({ message: 'Could not find user to remove tag for' })
                })
    }
})

router.post('/:id/courses/:courseId', (req, res) => {
    const pathId = req.params.id
    const courseId = req.params.courseId
    let email = req.user.email
    if(!req.body.order) res.status(400).json({ message: "must send order for course in body" })
    else
    {
        const order = req.body.order
        Users.findBy({ email })
            .then(user =>
            {
                if(user)
                {
                    Paths.addPathCourse(user.id, pathId, courseId, order)
                    .then(response => 
                    {
                        console.log('response', response)
                        if(response.code === 200) res.status(200).json({ message: response.message, pathCourses: response.pathCourses })
                        else res.status(response.code).json({ message: response.message })
                    })
                    .catch(error => 
                    {
                        console.log(error)
                        res.status(500).json({ message: 'Internal error: Could not add course to learning path' })
                    })
                }
                else res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to add learning path for' })
            })
    }
})

router.delete('/:id/courses/:courseId', (req, res) => 
{
    const pathId = req.params.id
    const courseId = req.params.courseId
    let email = req.user.email
    Users.findBy({ email })
        .then(user =>
        {
            if(user)
            {
                Paths.removePathCourse(user.id, pathId, courseId)
                .then(response => 
                {
                    if(response.code === 200) res.status(200).json({ message: response.message, pathCourses: response.pathCourses })
                    else res.status(response.code).json({ message: response.message })
                })
                .catch(error => 
                {
                    res.status(500).json({ message: 'Internal error: Could not remove courses from path' })
                })
            }
            else res.status(500).json({ message: 'Could not find user to remove course for' })
        })
        .catch(err =>
        {
            res.status(500).json({ message: 'Could not find user to remove course for' })
        })
})

router.put('/:id/order', (req, res) => {
    const pathId = req.params.id
    let email = req.user.email
    if(!req.body.learningPathContent) res.status(400).json({ message: "must send content for learning path in body" })
    else
    {
        let content = req.body.learningPathContent
        Users.findBy({ email })
            .then(user =>
            {
                if(user)
                {
                    Paths.updateContentOrder(user.id, pathId, content)
                    .then(response => 
                    {
                        if(response=== 200) res.status(200).json({ message: response.message })
                        else res.status(response.code).json({ message: response.message })
                    })
                    .catch(error => 
                    {
                        res.status(500).json({ message: 'Internal error: Could not update learning path content order' })
                    })
                }
                else res.status(500).json({ message: 'Could not find user to update learning path content order' })
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to update learning path content order' })
            })
    }
})

function verifyLearningPath(req, res, next)
{
    Paths.findById(req.params.id)
    .then(response => next())
    .catch(err => res.status(404).json({ message: "No learning path found with that ID" }))
}

function validateLearningPathItem(req, res, next)
{
    if(!req.body) res.status(400).json({ message: "Missing learning path item data"})
    else if(!req.body.name) res.status(400).json({ message: "Learning Path Item name is required"})
    else next()
}

router.post('/:id/path-items', verifyLearningPath, validateLearningPathItem, (req, res) => {
    const pathId = req.params.id
    const pathItem = req.body
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.addPathItem(user.id, pathId, pathItem)
            .then(response => 
            {
                if(response.code === 403) res.status(403).json({ message: response.message })
                else if(response.code === 404) res.status(404).json({ message: response.message })
                else res.status(201).json({ message: response.message, id: response.id })
            })
            .catch(error => 
            {
                res.status(500).json({ message: 'Could not add learning path Item' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to add learning path Item for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to add learning path Item for' })
    })
})

router.put('/:id/path-items/:itemId', verifyLearningPath, (req, res) => {
    const pathId = req.params.id
    const itemId = req.params.itemId
    const changes = req.body
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.updatePathItem(user.id, pathId, itemId, changes)
            .then(response => 
            {
                if(response.code === 403) res.status(403).json({ message: response.message })
                else if(response.code === 404) res.status(404).json({ message: response.message })
                else res.status(200).json({ message: response.message, id: response.id })
            })
            .catch(error => 
            {
                res.status(500).json({ message: 'Could not update learning path Item' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to update learning path Item for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to update learning path Item for' })
    })
})

router.delete('/:id/path-items/:itemId', verifyLearningPath, (req, res) => {
    const pathId = req.params.id
    const itemId = req.params.itemId
    let email = req.user.email
    Users.findBy({ email })
    .then(user =>
    {
        if(user)
        {
            Paths.deletePathItem(user.id, pathId, itemId)
            .then(response => 
            {
                if(response.code === 403) res.status(403).json({ message: response.message })
                else if(response.code === 404) res.status(404).json({ message: response.message })
                else res.status(200).json({ message: response.message, id: response.id })
            })
            .catch(error => 
            {
                res.status(500).json({ message: 'Could not delete learning path Item' })
            })
        }
        else res.status(500).json({ message: 'Could not find user to delete learning path Item for' })
    })
    .catch(err =>
    {
        res.status(500).json({ message: 'Could not find user to delete learning path Item for' })
    })
})

router.put('/', (req, res) => {
    let email = req.user.email
    if(!req.body.pathOrderArray) res.status(400).json({ message: "must send pathOrderArray" })
    else
    {
        let pathOrderArray = req.body.pathOrderArray
        Users.findBy({ email })
            .then(user =>
            {
                if(user)
                {
                    Paths.updatePathOrder(user.id, pathOrderArray)
                    .then(response => 
                    {
                        if(response=== 200) res.status(200).json({ message: response.message })
                        else res.status(response.code).json({ message: response.message })
                    })
                    .catch(error => 
                    {
                        res.status(500).json({ message: 'Internal error: Could not update learning path order' })
                    })
                }
                else res.status(500).json({ message: 'Could not find user to update learning path order for' })
            })
            .catch(err =>
            {
                res.status(500).json({ message: 'Could not find user to update learning path order for' })
            })
    }
})

module.exports = router

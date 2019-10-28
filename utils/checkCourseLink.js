const db = require('../database/dbConfig')

function linkPresent(req, res, next)
{
    if(!req.body.link) res.status(400).json({ message: 'No link present in post body' })
    else next()
}

async function checkDbForLink(req, res, next)
{
    let course = await db('courses').where({ link: req.body.link }).first()
    if(!course) next()
    else res.status(200).json({ message: 'Course already exists in Database', course: course })
}

function checkForUdemyLink(req, res, next)
{
    if(!req.body.link.includes('www.udemy.com/')) res.status(400).json({ message: 'Not a Udemy Link' })
    else next()
}

module.exports = 
{
    linkPresent,
    checkDbForLink,
    checkForUdemyLink
}
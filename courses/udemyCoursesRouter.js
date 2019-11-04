const router = require('express').Router()
const axios = require('axios')
const {linkPresent, checkDbForLink, checkForUdemyLink} = require('../utils/checkCourseLink')

const Courses = require('./coursesModel')
const Users = require('../users/usersModel')

router.post('/', linkPresent, checkDbForLink, checkForUdemyLink, (req, res) =>
{
    // First we make sure the user is valid.
    Users.findBy({ email })
    .then(user =>
    {
        const userId = user.id
        let link = req.body.link
        const config = 
        {
            headers:
            {
                // 'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36'
            }
        }
        // Then we get the web page, and parse it for the course id.
        axios.get(link, config)
        .then(response =>
        {
            let courseId = (response.data.match(/course-id=\"(\d+)/))[1]
            console.log(courseId)
            
            const config2 = 
            {
                headers: 
                {
                    'Content-Type': 'application/json',
                    'YOUR_CLIENT_ID': process.env.YOUR_CLIENT_ID,
                    'YOUR_CLIENT_SECRET': process.env.YOUR_CLIENT_SECRET
                }
            }

            // let link = `https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/?page=${page}&page_size=100`
            let link = `https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/`

            // Then we go to the page, and get all of the results (sections, lessons)
            getPublicCurriculum(link, config2)
            .then(resp =>
            {
                // If that worked, proceed
                if(results)
                {
                    let results = resp
                    // Now we get instructors for the course.
                    getCoursesDetail(courseId)
                    .then(instructors =>
                    {
                        if(instructors)
                        {
                            // Then, we send it to the model, for insertion into the DB, and send it to the user.
                            Courses.addUdemyCourse(userId, results, instructors)
                            .then(course => res.status(201).json(course))
                            .catch(err => res.status(500).json({ message: 'internal error, could not add course' }))
                        }
                        else res.status(500).json({ message: 'error: could not retrieve instructors' })
                    })
                }
                else res.status(500).json({ message: 'error: could not retrieve course' })
            })
            .catch(err =>
            {
                console.log('err from getPublicCurriculum', err)
                res.status(500).json({ message: 'error: could not retrieve course' })
            })
        })
        .catch(err => 
        {
            console.log(err)
            res.status(500).json(err)
        })
    })
    .catch(err => res.status(500).json({ message: 'Could not find user to add Udemy course for' }))
})

async function getPublicCurriculum(link, config2)
{
    console.log(`${link}?page=1&page_size=1`)
    try
    {
        let response = await axios.get(`${link}?page=1&page_size=1`)
        console.log('count', response.data.count)
        console.log('Math.ceil(response.data.count/100)', Math.ceil(response.data.count/100))
        // console.log('Math.Ceil(overview.count)', overview.count)
        let maxPages = Math.min(10, Math.ceil(response.data.count/100))
        let results = []
        let detResponse
        for(let i=1; i<=maxPages; i++)
        {
            detResponse = await axios.get(`${link}?page=${i}&page_size=100`)
            results = results.concat(detResponse.data.results)
        }
        return results
    }
    catch(err)
    {
        console.log('err from get details axios call', err)
        
        res.status(500).json({ message: "Couldn't get details for course" })
        return 0
    }
}

async function getCoursesDetail(id)
{
    console.log(`https://www.udemy.com/api-2.0/courses/${id}`)
    try
    {
        let response = await axios.get(`https://www.udemy.com/api-2.0/courses/${id}`)
        console.log(`response from axios get detail`, response)
        let instructors = response.data.visible_instructors.map(el => el.display_name)
        return instructors
    }
    catch(err)
    {
        console.log('err from get details axios call', err)
        
        res.status(500).json({ message: "Couldn't get details for course" })
        return 0
    }
}

module.exports = router
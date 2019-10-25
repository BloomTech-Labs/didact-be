const router = require('express').Router()
const axios = require('axios')
const {linkPresent, checkDbForLink, checkForUdemyLink} = require('../utils/checkCourseLink')

const Courses = require('./coursesModel')
const Users = require('../users/usersModel')


router.post('/', linkPresent, checkDbForLink, checkForUdemyLink, (req, res) =>
{
    console.log('a')
    let link = req.body.link
    console.log('link', link)
    console.log('b')
    const config = {
        headers:
        {
            // 'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36'
        }
    }
    axios.get(link, config)
    .then(response =>
        {
            // console.log(response.data)
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
            let nextIsNull = false
            let page = 1
            let link = `https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/?page=${page}&page_size=100`
            let results = []
            let erroneous = false
            // while(!nextIsNull && !erroneous)
            // {
            //     axios.get(link)
            //     .then(responseDetail =>
            //     {
            //         if(responseDetail.data.next == null) nextIsNull = true
            //         else page++
            //         results.concat(responseDetail.results)
            //     })
            //     .catch(err =>
            //     {
            //         console.log('err from detail axios get', err)
            //         erroneous = true
            //         res.status(500).json({ message: 'error in retrieving course details' })
            //     })
            // }
            axios.get(link)
                .then(responseDetail =>
                {
                    
                    if(responseDetail.data.next == null) nextIsNull = true
                    else page++
                    console.log('responseDetail', responseDetail.data.results)
                    let a = results.concat(responseDetail.data.results)
                    res.status(200).json(a)
                })
                .catch(err =>
                {
                    console.log('err from get details axios call', err)
                    res.status(500).json({ message: "Couldn't get details for course" })
                })
        })
    .catch(err => 
        {
            console.log(err)
            res.status(500).json(err)
        })
    // console.log('c')
    // console.log('courseId', courseId)
    // res.status(200)
    // res.status(500)
    
})

router.post('/course/:id', linkPresent, checkDbForLink, checkForUdemyLink, (req, res) =>
{
    console.log('a')
    let link = req.body.link
    console.log('link', link)
    console.log('b')
    const config = {
        headers:
        {
            'Content-Type': 'application/json',
            'YOUR_CLIENT_ID': process.env.YOUR_CLIENT_ID,
            'YOUR_CLIENT_SECRET': process.env.YOUR_CLIENT_SECRET,
            
        }
    }
    axios.get(link, config)
    .then(response =>
        {
            console.log(response.data)
            // let courseId = response.match(/'course-id="'[0-9]+^["]/)
            res.status(200).json(response.data)
        })
    .catch(err => 
        {
            console.log(err)
            res.status(500).json(err)
        })
    // console.log('c')
    // console.log('courseId', courseId)
    // res.status(200)
    // res.status(500)
    
})

module.exports = router
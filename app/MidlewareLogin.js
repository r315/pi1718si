'use strict'

let router = require('express').Router()
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')
let passport = require('passport')

router.use(cookieParser())

router.get('/', (req, resp, next)=>{
    resp.render('login',{'title':'Title'})
})
router.post('/', bodyparser.urlencoded({ extended: false }), (req, resp, next)=>{

/*
    function authenticateUser (username, password, cb) {
        if (username !== 'palbp' || password !== 'penta') {
            cb(new Error('Invalid credentials'), null)
            return
        }

        cb(null, {
            username: 'palbp',
            email: 'palbp@cc.isel.ipl.pt'
        })
    }

    authenticateUser(req.body.username, req.body.password, (err, user) => {
        if (err) { next(err); return }

        req.logIn(user, (error) => {
            if (error) { next(error); return }
            res.redirect('/')
        })
    })
}

*/



         // check credentials with database
        // add session id to logged collection
        loggedusers.push(req.cookies)
        // if cookie with login info 
        // redirect to user page
        resp.end()

    resp.render('login',{'title':'Title'})
})

module.exports = router
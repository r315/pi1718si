'use strict'

let router = require('express').Router()
let fs = require('fs')
let hb = require('handlebars')
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')

const logger = (msg) => {console.log('Midleware User: ' + msg); return msg;}
const TEMPLATE_FILE_USER = 'templateviews/user.hbs'
const TEMPLATE_FILE_LOGIN = 'templateviews/login.hbs'
const LOGIN_PATH = '/users/login'

/**
 * 
 * @param {*} req 
 * @param {*} resp 
 */
function userLogin(req, resp){
    fs.readFile(TEMPLATE_FILE_LOGIN, function(error, data){
        let source = data.toString()
        let template = hb.compile(source) 

        let dataobj = {
            'login_link' : LOGIN_PATH
        }
        resp.send(template(dataobj))        
    })
    
   
}

/**
 * 
 * @param {*} req 
 * @param {*} resp 
 */
function userLoginRequest(req, resp){

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
}

/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function userProfile(req, resp, next){

    let cookie = req.cookies

    if(cookie.status == 'logged' && req.params.id == cookie.username){
        // user already looged proceed to his home page
        next()       
    }

    if(cookie['login-info'] == undefined || req.params.id != cookie.username){
        //user tried to access his user area without login first
        let  username = req.params.id //newUser()
        resp.cookie('login-info',{'username' : username} )// createUser(username))
        resp.redirect('/login')
    }
    next()
}

router.use(cookieParser())
router.get('/', (req,resp,next) => {
    next()
})

router.use('/:id', userProfile)
router.get('/:id/lists',(req, resp, next) => {
    next()
})

//router.post('/login', userLoginRequest)

module.exports = router
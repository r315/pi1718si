'use strict'

let router = require('express').Router()
let fs = require('fs')
let hb = require('handlebars')
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')
let passport = require('passport')

const logger = (msg) => {console.log('Midleware User: ' + msg); return msg;}
const TEMPLATE_FILE_USER = 'templateviews/user.hbs'
const TEMPLATE_FILE_LOGIN = 'templateviews/login.hbs'
const LOGIN_PATH = '/users/login'

let loggedusers = []

function isLogged(userid){
    return loggedusers.find( o => o.id == userid)
}


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

    if(cookie.status == 'logged'){
        // user already looged proceed to his home page
       
    }

    if(cookie['login-info'] == undefined){
        //user tried to access his user area without login first
        let  username = req.params.id
        resp.cookie('login-info',{'teste' : '12345'} )// createUser(username))
    }
    resp.redirect('/login')
}



//TODO fixe routes /login/*
router.use(cookieParser())
router.get('/login', userLogin)
router.use('/:id', userProfile)
router.post('/', bodyparser.urlencoded({ extended: false }), userLoginRequest)
//router.post('/login', userLoginRequest)

module.exports = router
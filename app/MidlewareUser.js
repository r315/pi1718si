'use strict'

let router = require('express')()
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

    let id = req.params.id

    if(isNaN(id)){
        next()  //TODO discuss response to invalid paths
        return
    }

    if(isLogged(id) != undefined){
        console.log(`Profile acessed ${id}`)
        resp.end()
        return
    }
    
    //user tried to access his user area without login first
    resp.cookie('login-info',{
        'userid' : id,
        'status':'notLogged',
        'sessionId' : new Date().getDate()
    })

    resp.redirect('/users/login')
}

router.use(cookieParser())
router.use('/:id',userProfile)
router.get('/login',userLogin)
//router.post('/login', bodyparser.urlencoded({ extended: false }), userLoginRequest)
router.post('/login', passport.authenticate('local'),userLoginRequest)

module.exports = router
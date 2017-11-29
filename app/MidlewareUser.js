'use strict'

let router = require('express').Router()
let fs = require('fs')
let hb = require('handlebars')
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')

const logger = (msg) => {console.log('Midleware User: ' + msg); return msg;}
const COOKIE_NAME = 'login-info'

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

    if(cookie['login-info'] == undefined || req.params.id != cookie[COOKIE_NAME].username
){
        //user tried to access his user area without login first
        let  username = req.params.id //newUser()
        resp.cookie(COOKIE_NAME,{'username' : username} )// createUser(username))
        resp.redirect('/login')
    }
    next()
}

router.use(cookieParser())
router.get('/', (req,resp,next) => {
    next()
})

router.use('/:id', userProfile)

module.exports = router
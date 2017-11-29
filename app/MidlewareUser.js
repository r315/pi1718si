'use strict'

let router = require('express').Router()
let fs = require('fs')
let hb = require('handlebars')
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')
//let user = require('./user')

const logger = (msg) => {console.log('Midleware User: ' + msg); return msg;}
const COOKIE_NAME = 'login-info'

/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function userProfile(req, resp, next){

    let cookie = req.cookies[COOKIE_NAME]
    let username = req.params.id

    if(cookie == undefined || username != cookie.username){
        //user tried to access his user area without login first        
        //resp.cookie(COOKIE_NAME,user.createUser(username))
        resp.cookie(COOKIE_NAME,{
            'username' : username,
            'status' : 'redirect',
            'redirect' : req.baseUrl 
        })
        resp.redirect('/login')
        return
    }

    if(cookie.status == 'logged'){
        // user already looged proceed to his home page
        resp.render('userHome',{'username':username})
        return  
    }    
    resp.redirect('/login')
}

router.use(cookieParser())
router.get('/', (req,resp,next) => { next() })
router.use('/:id', userProfile)

module.exports = router
'use strict'

const router = require('express').Router()
const bodyparser = require('body-parser')
const passport = require('passport')
const usermod = require('./user')
const couchdb = require('./CouchDb')

const logger = (msg) => {console.log('Login: ' + msg); return msg;}

/**
 * 
 * @param {http request object} req 
 * @param {object} user 
 */
function putUserOnCookie(resp, user){
    resp.cookie('user-data', JSON.stringify(user))
}

/**
 * 
 * @param {http request object} req 
 */
function getUserFromCookie(req){
    return JSON.parse(req.cookies['user-data'])
}

/**
 * Receives user credentionals, async calls cb with user object on success
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {function} cb 
 */
function authenticateUser (username, password, cb) {

    function validateUser(error, user){
        if(error){
            cb(error, null)
            return
        }

        if(!user.validatePassword(password)){
            cb(new Error('Invalid password'), null)
            return 
        }
        cb(null, user)
    }

    couchdb.searchbyusername(username, validateUser)
}

function logUser(req, resp, user){
    req.logIn(user, function(error){
        if (error) { 
            logger(`Fail to login ${user.name}`)
            next(error); 
            return
        }
        logger(`${user.name} logged`)
        putUserOnCookie(resp, user)
        resp.redirect('/users/' + user.name)            
    })
}

/**
 * Passport serializer/deserializer
 */
passport.serializeUser((user, done) => {
    done(null, user.name)
})

passport.deserializeUser((req, username, done) => {
    done(null,getUserFromCookie(req))
})

/**
 * Set routes for /login
 */
router.get('/', (req, resp, next)=>{
    if(req.isAuthenticated())
        resp.redirect('/users/' + req.user.name) 
    else  
        resp.render('login',{'title':'Title'})
})

router.post('/', bodyparser.urlencoded({ extended: false }), (req, resp, next)=>{    
    let pass =  req.body.password
    let username = req.body.username

    if(req.body.newuser){
        let newuser = usermod.createUser(username)
        newuser.changePassword(pass)       
        logUser(req, resp, newuser)
        coutch.insertUser(newuser, (u)=>{
            logger(`User \"${u.name}\" created`)
        })
        return
    }
    
    authenticateUser(username, pass, (error, user, info)=>{
        if(error){
            next(error)
            return
        }
        //success on autentication, add user to session     
        logUser(req, resp, user)
    })
})

module.exports = router
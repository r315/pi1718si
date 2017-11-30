'use strict'

const router = require('express').Router()
const bodyparser = require('body-parser')
const passport = require('passport')

const logger = (msg) => {console.log('Login: ' + msg); return msg;}

/**
 * TODO add this functionality to cache
 * request user login to couchdb
 * on success add user to cache
 */
let users = []
function createUser(name){
    let user = {
        'name': name,
        'email': 'aluno@cc.isel.ipl.pt'
    }
    users.push(user)
    return user
}

/**
 * Receives user credentionals, async calls cb with user object on success
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {function} cb 
 */
function authenticateUser (username, password, cb) {
    if (username != password) {
        cb(new Error('Invalid credentials'), null)
        return
    }    
    cb(null, createUser(username))
}

function logUser(req, resp, user){
    req.logIn(user, function(error){
        if (error) { 
            logger(`Fail to login ${user.name}`)
            next(error); 
            return
        }
        logger(`${user.name} logged`)
        resp.redirect('/users/' + user.name)            
    })
}

passport.serializeUser((user, done) => {
    done(null, user.name)
})

passport.deserializeUser((username, done) => {  
    function findUser(userName, cb){
        let user = users.find(u=> u.name == userName)
        if(!user){
            cb(new Error('User does not exist'), null)
            return
        }
        cb(null,user)    
    }
    findUser(username, done)
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

    if(req.body.newuser){        
       logUser(req, resp, createUser(req.body.username))
        return
    }
    
    authenticateUser(req.body.username, req.body.password, (error, user, info)=>{
        if(error){
            next(error)
            return
        }
        //success on autentication, add user to session     
        logUser(req, resp, user)
    })
})
module.exports = router
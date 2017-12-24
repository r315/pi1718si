'use strict'

const router = require('express').Router()

const passport = require('passport')
const usermodule = require('./user')
const couchdb = require('./CouchDb')

const logger = (msg) => {console.log('Login: ' + msg); return msg;}

/**
 * Receives user credentionals, async calls cb with user object on success
 * TODO: some day remove user password from cookie
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {function} cb 
 */
function authenticateUser (username, password, cb) {

    function validateUser(error, user){
        if(error || user.error){
            logger(`Error ${error? error.error : user.error}`)
            cb(new Error('User not found'), null)
            return
        }
        
        usermodule.addProperties(user)

        if(!user.validatePassword(password)){
            cb(new Error('Invalid password'), null)
            return 
        }
        cb(null, user)
    }

    couchdb.getUser(username, validateUser)
}

function logUser(req, resp, user){
    req.logIn(user, function(error){
        if (error) { 
            logger(`Fail to login ${user.name} ${error}`)
            resp.send(error)
            return
        }
        logger(`${user.name} logged`)
        resp.cookie('user-data', JSON.stringify(user))
        resp.redirect(`/users/${user.name}`)            
    })
}

/**
 * Passport serializer/deserializer
 */
passport.serializeUser((user, done) => {
    done(null, user.name)
})

passport.deserializeUser((req, username, done) => {
    let user = JSON.parse(req.cookies['user-data'])
    user.updateCookieData = function(resp){
        resp.cookie('user-data', JSON.stringify(this))
    }
    done(null, user)
})

/**
 * Set routes for /login
 */

 /**
  *  endpoint for user login page
  */
router.get('/', (req, resp, next)=>{
    if(req.isAuthenticated()){    
        if(req.baseUrl === '/logout'){            
            logger(`${req.user.name} logout`)
            req.logOut()
            resp.cookie('user-data').clearCookie()
            resp.redirect('/login')
            return
        }
        resp.redirect('/users/' + req.user.name) 
     }else  
        resp.render('login',{'title':'Title'})
})

 /**
  *  post endpoint for user logon
  */
router.post('/', (req, resp, next)=>{    
    let pass =  req.body.password
    let username = req.body.username

    if(req.body.newuser){
        let newuser = usermodule.createUser(username)
        newuser.changePassword(pass)       
        couchdb.insertUser(newuser, (error, user)=>{
            if(error || user.error){
                error = error ? error.error : user.reason
                logger(`Error ${error}`)
                resp.send(error)
                return    
            }
            logger(`User \"${username}\" created`)
            logUser(req, resp, newuser)
        })
        return
    }
    
    authenticateUser(username, pass, (error, user)=>{
        if(error){
            next(error)
            return
        }
        //success on autentication, add user to session     
        logUser(req, resp, user)
    })
})

module.exports = router
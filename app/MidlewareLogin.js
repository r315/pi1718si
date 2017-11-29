'use strict'

let router = require('express').Router()
let bodyparser = require('body-parser')
let cookieParser = require('cookie-parser')
let passport = require('passport')

const COOKIE_NAME = 'login-info' //TODO avoid duplication

function authenticateUser (username, password, cb) {
    if (username !== 'teste' || password !== '123') {
        cb(new Error('Invalid credentials'), null)
        return
    }

    cb(null, {
        name: username,
        email: 'aluno@cc.isel.ipl.pt'
    })
}

router.use(cookieParser())

router.get('/', (req, resp, next)=>{
    resp.render('login',{'title':'Title'})
})
router.post('/', bodyparser.urlencoded({ extended: false }), (req, resp, next)=>{    
    let cookie = req.cookies[COOKIE_NAME]   

    authenticateUser(req.body.username, req.body.password, (err, user) => {
        if (err) { next(err); return }

        req.logIn(user, (error) => {
            if (error) {
                if(error.reason == 'invalid' && req.body.newuser){
                                       
                }else{
                    next(error); 
                    return
                }
            }

            resp.cookie(COOKIE_NAME,{
                    'username' : user.name,
                    'status' : 'logged',
                    'redirect' : '/users/' + user.name
                })

            if(cookie.status){
                if(cookie.status == 'redirect')
                    resp.redirect(cookie.redirect)
            }
            else
                resp.redirect('/users/' + user.name)            
        })
    })
})

passport.serializeUser((user, done) => {
    done(null, user.name)
})

passport.deserializeUser((username, done) => {

    function findUser (userName, callback) {
        if (userName === 'palbp') {
            callback(null, {
                username: 'palbp',
                email: 'palbp@cc.isel.ipl.pt'
            })
            return
        }
        callback(new Error('User does not exist'), null)
    }

    findUser(username, done)
})


module.exports = router
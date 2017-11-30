'use strict'

const router = require('express').Router()
const bodyparser = require('body-parser')

const logger = (msg) => {console.log('User: ' + msg); return msg;}

/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function userProfile(req, resp, next){

    if(!req.isAuthenticated()){
        resp.redirect('/login')
        return
    }

    if(req.user && req.user.name == req.params.id){        
        resp.render('userHome',{'username': req.user.name})
        return  
    }
    next()
}
router.get('/', (req,resp,next) => { next() })
router.use('/:id', userProfile)

module.exports = router
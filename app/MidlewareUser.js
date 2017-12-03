'use strict'

const router = require('express').Router()
const bodyparser = require('body-parser')
const lists = require('./MidlewareLists')

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
        if(req.url != "/"){
            next()
            return
        }      
        resp.render('userHome',{
            'username': req.params.id,
            'lists' : `${req.baseUrl}/lists`
        })
        return  
    }
    next()
}
router.get('/', (req,resp,next) => { next() })
router.use('/:id', userProfile)
router.use('/:id/lists',lists)

module.exports = router
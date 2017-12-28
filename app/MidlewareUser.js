'use strict'

const router = require('express').Router()
const lists = require('./MidlewareLists')
const comments = require('./MidlewareComments')

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
            'lists' : `${req.baseUrl}/lists`,
            'comments' : `${req.baseUrl}/comments`
        })
        return  
    }
    next()
}

router.get('/', (req,resp,next) => { next() })
router.use('/:id', userProfile)
router.use('/:id/lists/', lists)
router.use('/:id/comments/', comments)

module.exports = router
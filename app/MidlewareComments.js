'use strict'

const router = require('express').Router()
const couchdb = require('./CouchDb')
const bodyparser = require('body-parser')

const logger = (msg) => {console.log('Midleware Comments: ' + msg); return msg;}

function postComment(comment, cb){
    couchdb.postComment(comment, cb)
}


router.get('/', (req, resp) => { 
    logger(req.baseUrl)
    couchdb.getComments(req.movieid, 0, 5, (error, cmnts)=>{       
        resp.send(error ? error : cmnts)
    })   
})

/**
 * comments are received as string representing an object
 * so body parser must apply the correct encoding
 */
router.post('/', bodyparser.json(), (req, resp) => {
    couchdb.postComment(req.body, (error, comment) => {
        resp.send(error ? error : comment)  // return comment with id
        couchdb.getMovie(req.movieid, (error, cmovie) =>{
            
        })
    })    
})


module.exports = router
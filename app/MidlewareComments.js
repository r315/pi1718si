'use strict'

const router = require('express').Router()
const couchdb = require('./CouchDb')


function postComment(comment, cb){
    couchdb.postComment(comment, cb)
}

const logger = (msg) => {console.log('Comments: ' + msg); return msg;}
let id = 1


router.get('/', (req,resp) => { 
    logger(req.baseUrl)
    resp.send(JSON.stringify([
            {
                "id" : id,
                "username" : "user " + id,
                "text" : "The quick brown fox jumps over the lazy dog"
            }
        ])   
    )
    id++    
})

router.put('/', (req, resp) => {
    couchdb.postComment(req.body, (error, comment) => {
        resp.send(error ? error : comment)
    })    
})


module.exports = router
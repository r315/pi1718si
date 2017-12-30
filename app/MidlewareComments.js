'use strict'

const router = require('express').Router()
const couchdb = require('./CouchDb')
const bodyparser = require('body-parser')
const Movie = require('./movie').movie

const logger = (msg) => {console.log('Midleware Comments: ' + msg); return msg;}

router.get('/', (req, resp) => { 
    let movieid = req.baseUrl.split('/')[2]  //  /movies/{id}/comments    
    let comments = []

    logger(`getting comments for id ${movieid}`)

    function collectComments(comment, requiredsize){
        comments.push(comment)
        if(comments.length == requiredsize){
            resp.send(comments)
        }
    }

    couchdb.getMovie(movieid, (error, cmovie) =>{
        if(error){      
            resp.send("[]")     // no comments    
            return
        }
        cmovie.comments.forEach( cmntid => {
            couchdb.getComments(cmntid, 0, 5, (error, cmnt)=>{       
                    if(error){
                        logger(`Error ${error.error}`)
                    }
                    collectComments(cmnt, cmovie.comments.length)
            })            
        })
    })      
})

/**
 * comments are received as string representing an object
 * so body parser must apply the correct encoding
 */
router.post('/', bodyparser.json(), (req, resp) => {
    logger(`Posting comment for movie ${req.movieid}`)
    let movie = new Movie()
    movie.id = req.body.movie_id
    movie.title = req.body.movie_title 

    couchdb.postComment(req.body.movie_comment, (error, comment) => {
        if(error){
            resp.send(error)
            return
        }
        couchdb.createOnGetMovie(movie,(error, cmovie) =>{
            if(error){
                resp.send(error)
                return
            }
            cmovie.comments.push(comment.id)
            couchdb.updateMovie(cmovie, (error, cmovie)=>{                
                resp.send(error ? error.reason : comment)  // return comment with id
            })            
        })
    })    
})


module.exports = router
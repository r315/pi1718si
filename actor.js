'use strict'

const fs = require('fs')
let movie = require('./movie')
let myMovie = movie.movie

function actor() {
    this.name = null,
    this.id = null,
    this.biography = null,
    this.mov = []
    
}

function createActor(actorInfo, actorMovieCredit) {
    
        let obj = JSON.parse(actorInfo)
        let ac = new actor()
        ac.name = obj.name
        ac.id = obj.id
        ac.biography = obj.biography
        JSON.parse(actorMovieCredit).cast.forEach( function(elem) { 
            let mv = new myMovie()
            mv.id = elem.id
            mv.title = elem.original_title
            mv.releaseDate = elem.release_date
            mv.voteAverage = elem.vote_average
            ac.mov.push(mv)
         })
        return ac
        
}

//Run Code//
/*
fs.readFile('GetActorExample.txt',function (err,actorInfo) {
    if(err) throw err
    fs.readFile('GetActorCreditsExample.txt',function (err,actorCredits) {
    if(err) throw err
    createActor(actorInfo,actorCredits)
    })     
})

*/
module.exports = {
    'createActor' : createActor
}
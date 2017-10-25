'use strict'

const fs = require('fs')
let castCrew= require('./castCrew')

function movieDetails() {
    this.title = null,
    this.id = null,
    this.releasedate = null,
    this.voteaverage = null,
    this.tagline = null,
    this.originaltitle= null,
    this.castitemdto = []
}

function createMovieDetails (movieInfo, movieCredits) {

    let obj = JSON.parse(movieInfo)
    let md = new movieDetails()
    md.id = obj.id
    md.title = obj.title
    md.releasedate = obj.release_date
    md.voteaverage = obj.vote_average
    md.tagline = obj.tagline
    md.originaltitle = obj.original_title
    //mvd.castItemDto = JSON.parse(movieCredits)
    JSON.parse(movieCredits).crew.forEach( function(elem) { 
        if(elem.job=='Director') { 
            let ac = new castCrew()
            ac.name = elem.name
            ac.id = elem.id
            ac.job = elem.job
            md.castitemdto.push(ac) 
        }
     })
    JSON.parse(movieCredits).cast.forEach( function(elem) { 
        let ac = new castCrew()
        ac.name = elem.name
        ac.id = elem.id
        ac.character = elem.character
        md.castitemdto.push(ac)
     })
    return md
    
}


module.exports = {
    'createMovieDetails' : createMovieDetails
}

//Run Code//
/*
fs.readFile('GetMovieExample.txt',function (err,movieInfo) {
    if(err) throw err
    fs.readFile('GetMovieCreditsExample.txt',function (err,movieCredits) {
    if(err) throw err
    createMovieDetails(movieInfo,movieCredits)
    })     
})


*/
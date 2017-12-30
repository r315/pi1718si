'use strict'

function movie() {
    this.title = null
    this.id = null
    this.releaseDate = null 
    this.voteAverage = null
    this.poster_path = null
    this.totalpage = null 
    this.comments = []
    return this   
}

function createMovie(tocreateMovie){
    let arrmov = []
     JSON.parse(tocreateMovie).results.forEach( function(elem) { 
           let mv =  new movie()
            mv.id = elem.id
            mv.title = elem.original_title
            mv.releaseDate = elem.release_date
            mv.voteAverage = elem.vote_average
            arrmov.push(mv)
        })
    return arrmov
}


module.exports = {
    'movie':movie,
    'createMovie':createMovie
}

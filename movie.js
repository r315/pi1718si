'use strict'
const fs =  require('fs')

function movie() {
    this.title = null,
    this.id = null,
    this.releaseDate = null, 
    this.voteAverage = null,
    this.poster_path = null
    this.totalpage =null
    
}

function createMovie(tocreateMovie){
    let arrmov = []
     JSON.parse(tocreateMovie).results.forEach( function(elem) { 
           let mv =  new movie()
            mv.id = elem.id
            mv.title = elem.original_title
            mv.releaseDate = elem.release_date
            mv.voteAverage = elem.vote_average
            mv.totalpage = elem.total_pages   //TODO killing a mosquito with a bazuca
            arrmov.push(mv)
        })
    return arrmov
    
}

/*
fs.readFile('teste_jason_moviesearch.txt',function (err,data) {
    if(err) throw err
    createMovie(data)
         
})
*/

module.exports = {
    'movie':movie,
    'createMovie':createMovie
}

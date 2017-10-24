'use strict'
const fs =  require('fs')

 function movie() {
    this.title = null,
    this.id = null,
    this.releaseDate = null, 
    this.voteAverage = null 
    
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

/*
fs.readFile('teste_jason_moviesearch.txt',function (err,data) {
    if(err) throw err
    createMovie(data)
         
})
*/




/*
function searchMoviebyId(searchId){
    let innerMovie =null
    if(isNaN(searchId)) {
           innerMovie= movieCache.map(searchId)[0]
           if(innerMovie == null ){
                // chamada a camada que vai fazer os pedidos a movie database
           }
            return innerMovie
    }
        throw("Not a movie ID") //confirmar esta sintax 

}
*/
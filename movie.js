'use strict'

 function movie() {
    this.title = null,
    this.id = null,
    this.releaseDate = null, 
    this.voteAverage = null 
    
}




function createMovie(tocreateMovie){
    tempobj = JSON.parse(tocreateMovie)
     mv =  new movie()
     mv.id = tempobj.id
     mv.title = tempobj.original_title
     mv.releaseDate = tempobj.release_date
     mv.voteAverage = tempobj.vote_average
    return mv
}

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
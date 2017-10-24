'use strict'

let actor= require('./actor')

 let movieDetails = {
    title : null,
    id : null,
    releaseDate : null,
    voteAverage : null,
    tagline : null,
    originalTitle: null,
    castItemDto: []
}

let movieCache  = []


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
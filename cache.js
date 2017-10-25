'use strict'

const req = require('./server_md')
const innerMovie = require('./movie')
let movieCache 
let actorCache 



//let MovieDetails 



function getMovieDetails(movieId){
    let innerMovie
    if(movieCache==undefined){
        movieCache = [] 
        innerMovie = movieCache
        .filter((elem) = elem.id == movieId)[0]
        if(innerMovie == null){ // validar se é null ou undfiend
            reqparm = {'path':'movie','id':movieId}

                req.makeRequest(reqParm)

            movieCache.pusd(innerMovie)
        }
    return innerMovie
      
    }


}


function searchByMovie(searchTerm){

    let reqparm={'path':'search','query':searchTerm,'response':(data)=>reqSearchMovie(data)}
    req.request(reqparm)

}


function reqSearchMovie(data){
        innerMovie.createMovie(data).forEach((elem) => 
            console.log(elem))
        
}

/*
function reqMovie(Data){

}



function getActor(actorId){

}
*/

searchByMovie("pirates")
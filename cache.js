'use strict'

const req = require('./requester')
const Movie = require('./movie')
const movieDetails = require('./movieDetails')
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
            let reqparm = {'path':'movie','id':movieId}

                req.makeRequest(reqParm)

            movieCache.pusd(innerMovie)
        }
    return innerMovie
      
    }


}
/** needs test */
function searchMovieById(id){
 
    req.searchByMovieId(id,reqSearchMovieById)

}

/* needs test */
function reqSearchMovieById(datamvid){
        movieDetails.createMovieDetails(datamvid[movie],datamvid[cast])
}


function searchByMovie(searchTerm){

    req.searchByMovie(searchTerm,reqSearchMovie)
    //let reqparm={'path':'search','query':searchTerm,'response':(data)=>reqSearchMovie(data)}
    //req.request(reqparm)

}



function reqSearchMovie(data){
        Movie.createMovie(data).forEach((elem) => 
            console.log(elem))
        
}



/*
function reqMovie(Data){

}



function getActor(actorId){

}
*/

searchByMovie("Blade Runner")
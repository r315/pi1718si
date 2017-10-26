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

function searchByActor(id){

}

/**
 * 
 * @param {*} searchTerm 
 * 
funtion that receives a string 
term to be searched  and calls the requester , passing the function reqSearchMovie

 */

function searchByMovie(searchTerm){

    req.searchByMovie(searchTerm,reqSearchMovie)

}



/**
 * 
 * @param {*} data 
 * function that creates an array of movies and returns back to 
 */
function reqSearchMovie(data){
        return Movie.createMovie(data)
                //.forEach((elem) =>console.log(elem)) 
        
}

// missing get actorbyid

//searchByMovie("Blade Runner")


module.exports = {
        'searchByMovie' : searchByMovie,
        'searchByMovieId': searchByMovieId,
        'searchByActor' : searchByActor

}


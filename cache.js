'use strict'

const req = require('./requester')
const Movie = require('./movie')
const movieDetails = require('./movieDetails')
const Actor = require('./actor')
let moviecache 
let actorcache 



/**
 * Function that searchs for a movie in the cache, and if 
 * the movie it's not in the cache it will make a request to Api
 * used externally by the dispatcher
 * @param {*} id id of the movie to be searched
 */

function searchMovieById(id){
    let innermovie
        
    if ( moviecache == undefined)
            moviecache = []
      
        innermovie = moviecache.filter((mv) => mv.id ==id)[0]
    if ( innermovie == undefined) {
         req.searchByMovieId(id,(data)=>reqSearchMovieById(data))     
    }else{
        
    /* chamada ao dispatcher para devolver */
    console.log("Movie cache hit for movie:\n"+innermovie.id+"\n"+innermovie.title ) //TEST
    }
}


/**
 * auxiliary function that adds a movie to the movie cache before
 * calling the return function 
 * @param {*} mv receives a Internal movie object to be added to the cache
 */
function addMovietoCache(mv){
    if(!moviecache.contains(mv))
         moviecache.push(mv)

     /* chamada ao dispatcher para devolver */
     console.log(mv)
    // searchMovieById(603) //TEST CODE
 }
 
 /**
  * function used to create a movie object
  its used externally by the requester 
  * @param {*} datamvid object with 2 propreties Movie - contains the information about the movie
  *                                             cast -  contins information about the cast movie
  */
 function reqSearchMovieById(datamvid){
     addMovietoCache(movieDetails.createMovieDetails(datamvid["movie"],datamvid["cast"]))
     

 }
 


/**
 * 
 * @param {*} id 
 */
function searchByActor(id){
    let inneractor 
    if(moviecache == undefined)
        actorcache = []
        inneractor == actorcache.filter((act) => act.id == id)[0]
    if(inneractor == undefined){
        req.getActorById(id,reqSearchActorByid)
    }


}


function addActortoCache(act){
    actorcache.push(act)
    console.log(act)

}

/** o request de actor precisa de mais um pedido  
 * http://api.themoviedb.org/3/person/224513?api_key=0dc44732a6c4d50f7ffdcccdbc734dd8 para ser passado
 * no parametro Actor
*/

function  reqSearchActorByid(dataaid){
    Actor.createActor(dataaid["actors"],dataaid["cast"])

}

/**
 * 
 * @param {*} searchTerm Search term to be used in the Api search of movies
 * 
funtion that receives a string 
term to be searched  and calls the requester , passing the function reqSearchMovie

 */
/**
 * 
 * fucntion used to search by a moviename in the Api 
 * direct passthrough no cache 
 */
function searchByMovie(searchTerm){

    req.searchByMovie(searchTerm,reqSearchMovie)

}



/**
 * 
 * @param {*} data Jason string with the output of the Api search
 * function that creates an array of movies and returns
 * NOT FINISHED  
 */
function reqSearchMovie(data){
        return Movie.createMovie(data)
          .forEach((elem) =>console.log(elem)) 
        
}

// missing get actorbyid
//searchByActor(224513)
//searchByMovie("Matrix")
//earchMovieById(603)
//searchMovieById(604)




module.exports = {
        'searchByMovie' : searchByMovie,
        'searchByMovieId': searchMovieById,
        'searchByActor' : searchByActor

}


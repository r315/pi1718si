'use strict'
const logger = (msg) => {console.log('App: ' + msg); return msg;}
const req = require('./requester')
const Movie = require('./movie')
const movieDetails = require('./movieDetails')
const Actor = require('./actor')
let moviecache 
let actorcache  
let moviereq_queue = []
let actorreq_queue =[]
let searchmovie_queue = []


/**
 * Function that searchs for a movie in the cache, and if 
 * the movie it's not in the cache it will make a request to Api
 * used externally by the dispatcher
 * @param {*} id id of the movie to be searched
 */

function searchMovieById(ctx){
    let innermovie
        
    if ( moviecache == undefined)
            moviecache = []
      
        innermovie = moviecache.filter((mv) => mv.id ==ctx.id)[0]
    if ( innermovie == undefined) {
         moviereq_queue.push(ctx)
         
         req.searchByMovieId(ctx.id,(data)=>reqSearchMovieById(data))     
    }else{
        logger("Movie cache hit:"+innermovie.id)
        ctx.response(ctx,innermovie)
    
    }
}


/**
 * auxiliary function that adds a movie to the movie cache before
 * calling the return function 
 * used locally
 * @param {*} mv receives a Internal movie object to be added to the cache
 */
function addMovietoCache(mv){
    mv.posterurl = req.getPosterUrl(mv.poster_path)
    //if(moviecache.includes(mv)) // need to see if the cpu tradeoff vs space treadeoff is worth it
         moviecache.push(mv)
         logger("Added to movie cache id:"+mv.id)
    let todispatch = moviereq_queue
                .filter((elem) => elem.id == mv.id)
    moviereq_queue = moviereq_queue.filter((elem) => elem.id != mv.id)
    todispatch.forEach((elem) => 
            elem.response(elem,mv)) // ao inves de console log chamar função de retorno com objecto

 }
 
 /**
  * function used to create a movie object
  
  * @param {*} datamvid object with 2 propreties
  *movie:contains the information about the movie
  *cast:contains information about the cast movie
  *used externally by the requester
  */
 function reqSearchMovieById(datamvid){
     addMovietoCache(movieDetails.createMovieDetails(datamvid["movie"],datamvid["cast"]))
     

 }
 


/**
 * exported function to create an actor 
 * used externally by the dispatcher
 * @param {*} id id do actor pretendido
 */
function searchByActorID(ctx){
    let inneractor 
    if(actorcache == undefined)
        actorcache = []

        inneractor = actorcache.filter((act) => act.id == ctx.id)[0]
    if(inneractor == undefined){
        actorreq_queue.push(entry)
        req.getActorById(ctx.id,(data) =>reqSearchActorByid(data))
    }else{
        /** return function on requester */
        logger ("cache hit on actor id:"+inneractor.id)
       entry.response(ctx,inneractor)
    }
}

/**
 * auxiliar function used to add actor object to the cache before returning back
 * used locally
 * @param {*} act 
 */
function addActortoCache(act){
    
    actorcache.push(act)
    logger("Added to actor cache id:"+act.id)
    let todispatch = actorreq_queue
                    .filter((elem) => elem.id == act.id)
    actorreq_queue = actorreq_queue.filter((elem) => elem.id != act.id)    
    todispatch.forEach((elem) => 
            elem.response(elem,act))
    

}

/**
 * function used to create a actor object receiving a object with 2 propreties 
 * actorinfo : brings information relative to the actor 
 * roles:  information relative to the roles that actor played 
 * used externally by the requester 
 * @param {*} dataaid 
 */
function  reqSearchActorByid(dataaid){
    addActortoCache(Actor.createActor(dataaid["actorinfo"],dataaid["roles"]))

}

/**
 * 
 * @param {*} searchTerm Search term to be used in the Api search of movies
 * 
function that receives a string 
term to be searched  and calls the requester , passing the function reqSearchMovie

 */
/**
 * 
 * fucntion used to search by a moviename in the Api 
 * direct passthrough no cache 
 */
function searchByMovie(ctx){
    searchmovie_queue.push(ctx)
    req.searchByMovie(ctx.query,(search,rquery)=> reqSearchMovie(search,rquery))

}



/**
 * 
 * @param {*} data Jason string with the output of the Api search
 * function that creates an array of movies and returns
 * 
 */
function reqSearchMovie(data,rquery){
    let innermoviearr = Movie.createMovie(data)
    let todispatch = searchmovie_queue.filter((selem) => selem.query = rquery)
    searchmovie_queue = searchmovie_queue.filter((selem)=> selem.query != rquery)
    todispatch.forEach((elem) => elem.response(elem,innermoviearr))
        
}

let mokMovie = {} 
mokMovie.id =603

let mokSearch = {}
mokSearch.query ="Matrix"
//searchByActor(224513)
searchByMovie(mokSearch)
//searchMovieById(mokMovie)
//searchMovieById(604)
//searchMovieById(603)
//searchMovieById(606)




module.exports = {
        'searchByMovie' : searchByMovie,
        'searchByMovieId': searchMovieById,
        'searchByActorID' : searchByActorID

}


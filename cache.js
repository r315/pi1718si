'use strict'
const logger = (msg) => {console.log('Cache: ' + msg); return msg;}
const req = require('./requester')
const Movie = require('./movie')
const movieDetails = require('./movieDetails')
const Actor = require('./actor')
let moviecache 
let actorcache  
let moviereq_queue = []
let actorreq_queue =[]
let searchmovie_queue = []
let cachelimit =1000
let to_return_ctx =null
let to_return_call=null
let coimares

/**
 * function to empty the object taht it's in the oldest object in the cache 
 * @param {*} cacheobj 
 */
function cacheEviction(cacheobj){
    let oldest = Number.MIN_SAFE_INTEGER
    let current_timestamp = Math.floor(+new Date() / 1000)
    let toremoveidx =-5
    let idx=0
    cacheobj.forEach(function (elem){

        if(current_timestamp-elem.timestamp > oldest) {
            oldest = current_timestamp-elem.timestamp
            toremoveidx = idx
        }
         idx++
    })
    cacheobj.splice(toremoveidx,1)

}

function cacheRouter (req, res, next) {
    coimares = res
    switch (req.coimarouter) {
        case '/search' :
        searchByMovie(req)
    }
}


function getObjectFromCache(req,res,next){
    
}

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
      
        innermovie = moviecache.filter((mv) => mv.obj.id ==ctx.id)[0]
    if ( innermovie == undefined) {
         moviereq_queue.push(ctx) //TODO check context on request ../movie/
      //to_return_ctx =ctx
        //to_return_call = ctx.response
         req.searchByMovieId(ctx.id,(data)=>reqSearchMovieById(data)   )  //TODO:a função reqsearchmovie deveria receber o callback para voltar ao dispatcher
    }else{
        logger("Movie cache hit:"+innermovie.obj.id)
            innermovie.timestamp = Math.floor(+new Date() / 1000)
        ctx.response(ctx,innermovie.obj)
    
    }
}


/**
 * auxiliary function that adds a movie to the movie cache before
 * calling the return function 
 * used locally
 * @param {*} mv receives a Internal movie object to be added to the cache
 */
function addMovietoCache(mv ){

    let cache_obj = { 
        'obj' : null,
        'timestamp' :null
    }
    mv.posterurl = req.getPosterUrl(mv.poster_path)

    if(moviecache.filter((dt) => dt.obj.id == mv.id).length <1){
        if(moviecache.length >= cachelimit){
            cacheEviction(moviecache)
        }
        cache_obj.obj =mv
        cache_obj.timestamp = Math.floor(+new Date() / 1000)
         moviecache.push(cache_obj)
         logger("Added to movie cache id:"+mv.id)
    }
    
    let todispatch = moviereq_queue
                .filter((elem) => elem.id == mv.id)
    moviereq_queue = moviereq_queue.filter((elem) => elem.id != mv.id)
    
    todispatch.forEach((elem) => 
            elem.response(elem,mv)) 

   // to_return_call(to_return_ctx,mv)   
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

        inneractor = actorcache.filter((act) => act.obj.id == ctx.id)[0]
    if(inneractor == undefined){
        actorreq_queue.push(ctx)
        req.getActorById(ctx.id,(data) =>reqSearchActorByid(data))
    }else{
        /** return function on requester */
        logger ("cache hit on actor id:"+inneractor.obj.id)
        inneractor.timestamp = Math.floor(+new Date() / 1000)
       ctx.response(ctx,inneractor.obj)
    }
}

/**
 * auxiliar function used to add actor object to the cache before returning back
 * used locally
 * @param {*} act 
 */
function addActortoCache(act){
    
    let cache_obj = {
        'obj':null,
        'timestamp' : null
    }

    act.profileurl = req.getPosterUrl(act.profile_path)

    if(actorcache.filter((dt) => dt.obj.id == act.id).length <1){
        if(actorcache.length >= cachelimit){
            cacheEviction(actorcache)
        }
        cache_obj.obj = act
        cache_obj.timestamp = Math.floor(+new Date() / 1000)
        actorcache.push(cache_obj)
    logger("Added to actor cache id:"+act.id)
    }
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
function searchByMovie(req){
    //searchmovie_queue.push(ctx)
    //req.searchByMovie(ctx.query,ctx.page,(search,rquery)=> reqSearchMovie(search,rquery))
    req.searchByMovie(req.coimaterm,req.coimapage,(search,rquery)=> reqSearchMovie(search,rquery))
}



/**
 * 
 * @param {*} data Jason string with the output of the Api search
 * function that creates an array of movies and returns
 * 
 */
function reqSearchMovie(data,rquery){
    let innermoviearr = Movie.createMovie(data)
    coimares.coimatotalpages = JSON.parse(data).total_pages
    //let todispatch = searchmovie_queue.filter((selem) => selem.query = rquery)
    //searchmovie_queue = searchmovie_queue.filter((selem)=> selem.query != rquery)
    //todispatch.forEach((elem) => {elem.totalpages = totalpages; elem.response(elem,innermoviearr)})
    coimares.send(innermoviearr)
}

module.exports = cacheRouter

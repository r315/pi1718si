'use strict'
const logger = (msg) => {console.log('Cache: ' + msg); return msg;}
const req_ = require('./requester')
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

function cacheRouter (req, res, next) {

    switch (req.coimarouter) {
        case '/search' : searchByMovie(req,res)
        break;
        case '/movies' : searchMovieById(req,res)
        break;
        case '/actors' : searchByActorID(req,res)
        break;
        default : 
            res.status(404)
            res.render('notfound')
    }

}

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

function getObjectFromCache(req,res,next){
    
}

/**
 * 
 * @param {*} searchTerm Search term to be used in the Api search of movies
 * 
 * function that receives a string 
 * term to be searched  and calls the requester , passing the function reqSearchMovie
 * fucntion used to search by a moviename in the Api 
 * direct passthrough no cache 
 */
function searchByMovie(req, res){

    req_.searchByMovie(req.coimaterm,req.coimapage,(search,rquery)=> reqSearchMovie(search,rquery,res))

}

/**
 * 
 * @param {*} data Jason string with the output of the Api search
 * function that creates an array of movies and returns
 * 
 */
function reqSearchMovie(data,rquery,res){

    let innermoviearr = Movie.createMovie(data)
    res.coimatotalpages = JSON.parse(data).total_pages
    res.send(innermoviearr)

}

/**
 * Function that searchs for a movie in the cache, and if 
 * the movie it's not in the cache it will make a request to Api
 * used externally by the dispatcher
 * @param {*} id id of the movie to be searched
 */
function searchMovieById(ctx, res){

    let innermovie        
    if (moviecache == undefined) moviecache = []
    innermovie = moviecache.filter((mv) => mv.obj.id ==ctx.coimaterm)[0]
    if (innermovie == undefined) {
        req_.searchByMovieId(ctx.coimaterm,(data)=>reqSearchMovieById(data, res)   )  //TODO:a função reqsearchmovie deveria receber o callback para voltar ao dispatcher
    }else{
        logger("Movie cache hit:"+innermovie.obj.id)
        innermovie.timestamp = Math.floor(+new Date() / 1000)  
        res.send(innermovie.obj)
    }

}

 /**
  * function used to create a movie object
  * @param {*} datamvid object with 2 propreties
  *movie:contains the information about the movie
  *cast:contains information about the cast movie
  *used externally by the requester
  */
  function reqSearchMovieById(datamvid, res){
    
       addMovietoCache(movieDetails.createMovieDetails(datamvid["movie"],datamvid["cast"]),res)    
        
}

/**
 * auxiliary function that adds a movie to the movie cache before
 * calling the return function 
 * used locally
 * @param {*} mv receives a Internal movie object to be added to the cache
 */
function addMovietoCache(mv, res){

    let cache_obj = { 
        'obj' : null,
        'timestamp' :null
    }
    mv.posterurl = req_.getPosterUrl(mv.poster_path)

    if(moviecache.filter((dt) => dt.obj.id == mv.id).length <1){
        if(moviecache.length >= cachelimit){
            cacheEviction(moviecache)
        }
        cache_obj.obj =mv
        cache_obj.timestamp = Math.floor(+new Date() / 1000)
        moviecache.push(cache_obj)
        logger("Added to movie cache id:"+mv.id)
    }
    
    res.send(mv)

 }

/**
 * exported function to create an actor 
 * used externally by the dispatcher
 * @param {*} id id do actor pretendido
 */
function searchByActorID(ctx, res){
    let inneractor 
    if(actorcache == undefined)
        actorcache = []

    inneractor = actorcache.filter((act) => act.obj.id == ctx.coimaterm)[0]
    if(inneractor == undefined){
        actorreq_queue.push(ctx)
        req_.getActorById(ctx.coimaterm,(data) =>reqSearchActorByid(data, res))
    }else{
        /** return function on requester */
        logger ("cache hit on actor id:"+inneractor.obj.id)
        inneractor.timestamp = Math.floor(+new Date() / 1000)
       res.send(inneractor.obj)
    }

}

/**
 * function used to create a actor object receiving a object with 2 propreties 
 * actorinfo : brings information relative to the actor 
 * roles:  information relative to the roles that actor played 
 * used externally by the requester 
 * @param {*} dataaid 
 */
function  reqSearchActorByid(dataaid, res){
    addActortoCache(Actor.createActor(dataaid["actorinfo"],dataaid["roles"]),res)

}

/**
 * auxiliar function used to add actor object to the cache before returning back
 * used locally
 * @param {*} act 
 */
function addActortoCache(act, res){
    
    let cache_obj = {
        'obj':null,
        'timestamp' : null
    }

    act.profileurl = req_.getPosterUrl(act.profile_path)

    if(actorcache.filter((dt) => dt.obj.id == act.id).length <1){
        if(actorcache.length >= cachelimit){
            cacheEviction(actorcache)
        }
        cache_obj.obj = act
        cache_obj.timestamp = Math.floor(+new Date() / 1000)
        actorcache.push(cache_obj)
    logger("Added to actor cache id:"+act.id)
    }
    res.send(act)

}

module.exports = cacheRouter

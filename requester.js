'use strict'

let server = require('./server_md')
const logger = (msg) => {console.log('Requester: ' + msg); return msg;}
const MOVIE_DETAILS_SIZE = 2 
const ACTOR_DETAILS_SIZE = 2

//server.init(8080)

function searchByMovie(searchTerm,callbackfunc){
    
        let reqparm={'path':'search','query':searchTerm,'response':(data) => callbackfunc(data)}
        server.request(reqparm)
    
    }


function requestsCollector(rspdata, cb){
    if(--rspdata.count == 0)
        cb(rspdata)
}


function searchByMovieId(searchId, cb){
    let respdata = {
        'movie' : '', 
        'cast' : '',
        'count' : MOVIE_DETAILS_SIZE
    }
    
    let reqmovie = {
        'path':'movies',
        'id' : searchId,
        'response' : function(data){ 
            respdata.movie = data;            
            requestsCollector(respdata, cb);          
        }
    }

    let reqcast = {
        'path':'movies',
        'id' : `${searchId}/credits`,
        'response' : function(data) { 
            respdata.cast = data;            
            requestsCollector(respdata, cb);           
        }
    }

    server.request(reqmovie)
    server.request(reqcast)
}

/*
    TODO: Test this function
*/
function getActorById(id, cb){
    let respdata = {
        'actorinfo' : '', 
        'roles' : '',
        'count' : ACTOR_DETAILS_SIZE
    }  
    
    let reqactor = {
        'path':'actors',
        'id' : id,
        'response' : function(actordetails) { 
            respdata.actorinfo = actordetails
            requestsCollector(respdata, cb)           
        }
        // 'response' : function(data) { 
        //     respdata.actorinfo = data
        //     cb(respdata)           
        // }
    }
    
    let reqactorcredits = {
        'path':'actors',
        'id' : `${id}/movie_credits`,
        'response' : function(castdata) { 
            respdata.roles = castdata
            requestsCollector(respdata, cb)           
        }
    }

    

    server.request(reqactor)
    server.request(reqactorcredits)
}

/*
*/
function imageUrl(path, size, cb){
    
    let req = {
        'path' : 'posterurl',
        'poster_path' : path,
        'poster_size' : size,
        'response' : function(url) { cb(url) }
    }

    server.request(req)
}

module.exports = { 
    'searchByMovie' : searchByMovie,
    'searchByMovieId' : searchByMovieId,
    'getActorById' : getActorById,
    'imageUrl' : imageUrl 
}

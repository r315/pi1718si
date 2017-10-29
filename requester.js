'use strict'

const server = require('./server_md')
const logger = (msg) => {console.log('Requester: ' + msg); return msg;}
const MOVIE_DETAILS_SIZE = 2 
const ACTOR_DETAILS_SIZE = 2

server.init()

function searchByMovie(searchTerm,callbackfunc){
    
        let reqparm={'path':'search','query':searchTerm,'response':(data) => callbackfunc(data)}
        server.request(reqparm)
    
    }


function requestsCollector(rspdata, cb){
    if(--rspdata.count == 0)
        cb(rspdata)
}

/*
GET /movie/{movie_id}
GET /movie/{movie_id}/credits
*/
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
Request actor deails and casted movies
GET /person/{person_id}/movie_credits
GET /person/{person_id}
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
The url for images is composed of 3 pieces of data,
base_url, a poster_size and a poster_path.

base_url and poster_size can be obtained from /configuration
{base_url}/{poster_size}/{poster_path}
ex: https://image.tmdb.org/t/p/ w500/ kqjL17yufvn9OVLyXYpvtyrFfak.jpg

caller must supply the poster_path and optionaly the size[0..n (n can be obtained)], as all data required
is availabe locally there is no need for callBack
*/
function imageUrl(path, size){
    
    let req = {
        'path' : 'posterurl',
        'poster_path' : path,
        'poster_size' : size,
        'response' : function(url) {}
    }

    server.request(req)
    return req.data
}

module.exports = { 
    'searchByMovie' : searchByMovie,
    'searchByMovieId' : searchByMovieId,
    'getActorById' : getActorById,
    'imageUrl' : imageUrl 
}

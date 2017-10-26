'use strict'

let server = require('./server_md')
const logger = (msg) => {console.log('Requester: ' + msg); return msg;}
const MOVIE_DETAILS_SIZE = 2 

server.init(8080)

function searchByMovie(searchTerm,callbackfunc){
    
        let reqparm={'path':'search','query':searchTerm,'response':(data) => callbackfunc(data)}
        server.request(reqparm)
    
    }


function searchByMovieId_colector(rspdata, cb){
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
            searchByMovieId_colector(respdata, cb);          
        }
    }

    let reqcast = {
        'path':'movies',
        'id' : searchId + '/credits',
        'response' : function(data) { 
            respdata.cast = data;            
            searchByMovieId_colector(respdata, cb);           
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
        'actors' : '', 
        'cast' : '',
        'count' : MOVIE_DETAILS_SIZE
    }  
    
    let reqactor = {
        'path':'actors',
        'id' : id,
        'response' : function(data) { 
            respdata.cast = data
            cb(respdata)           
        }
    }

    server.request(reqactor)
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

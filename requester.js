'use strict'

const MOVIE_DETAILS_SIZE = 2 

const server = require('./server_md')



function searchByMovie(searchTerm,callbackfunc){
    
        let reqparm={'path':'search','query':searchTerm,'response':(data)=> callbackfunc(data)}
        server.request(reqparm)
    
    }


function searchByMovieId_joinner(rspdata, cb){
    if(rspdata.count == MOVIE_DETAILS_SIZE)
        cp(rspdata)
}


function searchByMovieId(searchId, cb){
    let respdata = {
        'movie' : '', 
        'cast' : '',
        'count' : 0
    }

    let reqmovie = {
        'path':'movies',
        'id' : searchId,
        'response' : (data) => { respdata.movie = data; rspdata.count++; searchByMovieId_joinner(respdata, cb);}
    }

    let reqcast = {
        'path':'movies',
        'id' : searchId + '/credits',
        'response' : (data) => { respdata.cast = data; rspdata.count++; searchByMovieId_joinner(respdata, cb);}
    }
}


module.exports = { 
    'searchByMovie' : searchByMovie,
    'searchByMovieId' : searchByMovieId 
}

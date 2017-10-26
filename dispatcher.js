'use strict'

const CACHE = require('./cache')

let entry = []

/* Dispatche Assumes a two position array on entry */
//:TODO Check with Hugo R.

/* dispatcher receives one object as parameter composed on the following manner

entry{
    'resp' :     // response parameter from http server for sending data to client
    'req' :      // requeste parameter from hrrp server containig client request
    'endpoint':  // endpoint entered by client
    'path':      // path can be [search | movies | actors]
    'data' :     // data to return to client <html>
    'response' : // call back when data is available to send to client
}


for routing, an object with functions assigned to all path's as properties can be used, this way we can simply 
index the propertie and call the function

router{
    'search': function(){....},
    'movies': function(){....},
    'actors': function(){....},
}

then on dispatcher we can call
router[entry.path](entry)

as we must use async model the call to dispatcher returns immediatly and has no return value  
*/

function dispatcher(entry){

    switch (entry[0]) {
        case '/search?q=':
            return CACHE.searchByMovie(entry[1])
        break
        
        case '/movies':
            return CACHE.searchMovieById(entry[1])
        break

        case '/actors':
            return CACHE.searchByActor(entry[1])
        break
    }

}
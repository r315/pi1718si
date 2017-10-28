'use strict'

let fs = require('fs')
let search_route = require('./search_view_test')
let movie_route = require('./movie_view_test')
const CACHE = require('./cache')

let routes = {
    'search': function(placeholder){ search_route(placeholder)},
    'movies': function(placeholder){ movie_route(placeholder)},
    'actors': function(){},
}

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
module.exports = function(entry){
    /* if no path entered show home page */
    if(entry.path == '') {
        fs.readFile('templateviews/index.html',function(error,readdata){
            if(error){
                entry.data = error.toString()
                entry.error = 500 // server error
            }
            else{
                entry.data = readdata
            }
            entry.response(entry)
        })
        return
    }

    let route = routes[entry.path[0]]
    if(route == undefined){
        entry.data = `Invalid path \"${entry.path[0]}\"`
        entry.error = 400  //Invalid request
        entry.response(entry)
        return
    }

    route(entry)
}
'use strict'

let fs = require('fs')
let cache = require('./cache')
let hb = require('handlebars')

const RESULT_SIZE = 10
const TEMPLATE_PATH = 'templateviews/search.html'
const CACHE = require('./cache')

let routes = {
    'search': searchRoute,
    'movies': function(){},
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






/**
 * Get the html template for search results page and
 * fill it with the results
 * 
 * this function is called when cach make requested data available
 * @param {data, cb} data
 */
function createSearchView(wapper, searchresults){
    fs.readFile(TEMPLATE_PATH, function(error,data){
        let source = data.toString()
        let template = hb.compile(source)
        let dataobj = { 
            'search_term' : 'Query: ...',
            'search_results': []
        }
        
        for(let i = 0; i < RESULT_SIZE; i++){
            dataobj.search_results.push(
                {'result_index' : i+1, 'result_title': `Result ${i+1}`}
            )
        }
        param.data = template(dataobj)
        //fs.writeFile('templateviews/out.html',template(data));    
        param.response(param)
    })    
}

/**
 * Get an array of object containing search results from cache, 
 * for cache returns an object the necessary data 
 * must be supplied, this data is obtained from entry object
 * 
 * a wrapper object is created with the necessary data and callback
 * at on data ready cache calls this callback and search results
 * 
 * @param {*} entry {path:[endpoint, query]}
 */
function searchRoute(entry){
    let wrapper = {}
    wrapper.query = entry.path[1].split('=')[1] // get search term
    wrapper.entry = entry
    wrapper.response = createSearchView
    cache.searchByMovie(wrapper)
}
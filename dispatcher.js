'use strict'

let fs = require('fs')
let cache = require('./cache')
//let cache = require('./dispatcher_test')
let hb = require('handlebars')

const RESULT_SIZE = 10
const TEMPLATE_SEARCH_PATH = 'templateviews/search.hbs'
const TEMPLATE_MOVIE_PATH  = 'templateviews/movie.hbs'
const TEMPLATE_ACTOR_PATH = 'templateviews/actor.hbs'
const TEMPLATE_INDEX_PATH = 'templateviews/index.hbs'


let routes = {
    'search': {'go' : searchRoute, 'template': TEMPLATE_SEARCH_PATH, 'cb':createSearchView, 'supplier': cache.searchByMovie},
    'movies': {'go' : commonRoute, 'template': TEMPLATE_MOVIE_PATH, 'cb':createMovieView, 'supplier': cache.searchByMovieId},
    'actors': {'go' : commonRoute, 'template': TEMPLATE_ACTOR_PATH, 'cb':createActorView, 'supplier': cache.searchByActorID}
}

function extractValue(source, pattern, key){
    let t = source
        .filter((p) => p.split(pattern)[0] == key)
        .map( p => p.split(pattern)[1])[0]
        return t
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
        fs.readFile(TEMPLATE_INDEX_PATH, function(error,readdata){
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

    route.go(entry,route)
}

/**
 * 
 * @param {*} entry 
 * @param {*} route 
 */
function commonRoute(entry, route){
    let wrapper = {}
    
    wrapper.id = entry.path[1]

    if(wrapper.id == ''){
        entry.error = 404 // not found
        entry.data = `No Valid ID for /${entry.path[0]}/{id}`
        entry.response(entry)        
        return
    }

    if(isNaN(wrapper.id)){
        entry.error = 404 // not found
        entry.data = `"${wrapper.id}" is not valid as id`
        entry.response(entry)        
        return
    }

    wrapper.entry = entry
    wrapper.template = route.template
    wrapper.response = route.cb
    route.supplier(wrapper)
    //setTimeout( ()=>wrapper.response(wrapper,null),50)
}

/**
 * Get an array of object containing search results from cache, 
 * for cache returns an object the necessary data 
 * must be supplied, this data is obtained from entry object
 * 
 * a wrapper object is created with the necessary data and callback
 * at on data ready cache calls this callback and search results
 * 
 * @param {*} 
 */
function searchRoute(entry, route){
    let wrapper = {}    
    //wrapper.page = entry.page     
    if(entry.path[1] == '' || entry.path[1] == undefined){
        entry.error = 404 // not found
        entry.data = `No keyword entered`
        entry.response(entry)        
        return
    }

    let parameters =  entry.path[1].split('&')

    wrapper.query = extractValue(parameters, '=', 'name')
    let page = extractValue(parameters, '=', 'page')

    if(page == undefined || page <= 0 || isNaN(page)    )
        page = '1'

    wrapper.page = page    
    wrapper.entry = entry
    wrapper.template = route.template
    wrapper.response = route.cb
    route.supplier(wrapper)
    //setTimeout(()=>wrapper.response(wrapper, genMockResults()),50)
}

/**
 * Get the html template for search results page and
 * fill it with the results
 * 
 * this function is called when cache make requested data available
 * @param {data, cb} data
 */
function createSearchView(wrapper, searchresults){
    fs.readFile(wrapper.template, function(error,data){
        let source = data.toString()
        let template = hb.compile(source)
        let total_pages = wrapper.totalpages
        let dataobj = { 
            'search_term' : wrapper.query,
            'search_results': [],
            'search_previous_page' : `/search?name=${wrapper.query}&page=${(wrapper.page > 1)? parseInt(wrapper.page) - 1: wrapper.page}` ,
            'search_next_page' :  `/search?name=${wrapper.query}&page=${(wrapper.page < total_pages)? parseInt(wrapper.page) + 1: wrapper.page}`,
            'search_page' :  wrapper.page
        }      

        searchresults.forEach( (mv, i) => {
            dataobj.search_results.push({
                'result_index' : i+1, 
                'result_title': mv.title,
                'result_link' : `/movies/${mv.id}`
            })

        })

        wrapper.entry.data = template(dataobj)
        wrapper.entry.response(wrapper.entry)
    })    
}

/**
 * 
 * @param {*} wrapper 
 * @param {*} movie 
 */
function createMovieView(wrapper, movie){
    fs.readFile(wrapper.template, function(error,data){
        let source = data.toString()
        let template = hb.compile(source)
        let dataobj = {
            'movie_title' : movie.title,
            'movie_director' : movie.directordto.map((elem) => elem.name).join(', '),
            'poster_url' : movie.posterurl,             
            'movie_cast': []           
        }
        
        movie.castitemdto.forEach((elem, i)=>{
            dataobj.movie_cast.push(
                {
                    'cast_index' : i+1, 
                    'cast_name': elem.name,
                    'cast_link' : `/actors/${elem.id}`
                })
        })

        wrapper.entry.data = template(dataobj)
        wrapper.entry.response(wrapper.entry)
    })    
}

/**
 * 
 * @param {*} wrapper 
 * @param {*} movie 
 */
function createActorView(wrapper, actor){
    fs.readFile(wrapper.template, function(error,data){
        let source = data.toString()
        let template = hb.compile(source)        
        let dataobj = { 
            'name' : actor.name,
            'biography': actor.biography,
            'profile_url' : actor.profileurl, 
            'casted_movies' : []           
        }
        
        actor.mov.forEach((elem, i)=>{
            dataobj.casted_movies.push(
                {
                    'casted_index' : i+1, 
                    'casted_movie': elem.title,
                    'casted_link' : `/movies/${elem.id}`
                })
        })

        wrapper.entry.data = template(dataobj)
        wrapper.entry.response(wrapper.entry)
    })  
}
'use strict'

let fs = require('fs')
let cache = require('./cache')
//let cache = require('./dispatcher_test')
let hb = require('handlebars')


const TEMPLATE_SEARCH_PATH = 'templateviews/search.hbs'
const TEMPLATE_MOVIE_PATH  = 'templateviews/movie.hbs'
const TEMPLATE_ACTOR_PATH = 'templateviews/actor.hbs'
const TEMPLATE_INDEX_PATH = 'templateviews/index.hbs'

const logger = (msg) => {console.log('Dispatcher: ' + msg); return msg;}

function extractValue(source, pattern, key){
    let t = source
        .filter((p) => p.split(pattern)[0] == key)
        .map( p => p.split(pattern)[1])[0]
        return t
}

/**
 * /movies/{id}
 * /actors/{id}
 * @param {*} entry 
 * @param {*} route 
 */
function commonRoute(req, resp, next){
    
    let path = req.url.split('/')

    req.coimarouter = req.baseUrl
    req.coimaterm = path[1]

    if(req.coimaterm == ''){        
        resp.status(404).send(`No Valid ID for ${req.baseUrl}/{id}`)     
        return
    }

    if(isNaN(req.coimaterm)){        
        resp.status(404).send(`"${wrapper.id}" is not valid as id`)         
        return
    }

    //using decorator pattern for calling view
    const ori_send = resp.send
    resp.send = (...args) => {
        resp.send = ori_send

        if('req.coimarouter' == '/movies'){
            resp.template = TEMPLATE_SEARCH_PATH
            createMovieView(req, resp, ...args)
        }

        if('req.coimarouter' == '/actors'){
            resp.template = TEMPLATE_ACTORS_PATH
            createActorView(req, resp, ...args)
        }        
    }
    next()
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
function searchRoute(req, resp, next){

    let wrapper = {}   

    let parameters =  req.url.split('?')[1].split('&')
    let query = extractValue(parameters, '=', 'name')
    let page = extractValue(parameters, '=', 'page')

    if(page == undefined || page <= 0 || isNaN(page))
        page = '1'
   
    req.coimapage = page
    req.coimarouter = req.baseUrl
    req.coimaterm = query

   

     //using decorator pattern for calling view
     const ori_send = resp.send
     resp.send = (...args) => {
         resp.send = ori_send
         resp.template = TEMPLATE_SEARCH_PATH
         createSearchView(req, resp, ...args)
     }
    next()
}

/**
 * 
 * Get the html template for search results page and
 * fill it with the results
 * 
 * this function is called when cache make requested data available
 * @param {*} req 
 * @param {*} resp 
 * @param {*} searchresults 
 */
function createSearchView(req, resp, searchresults){
    fs.readFile(resp.template, function(error,data){
        let source = data.toString()
        let template = hb.compile(source)
        let dataobj = { 
            'search_term' : req.coimaterm,
            'search_results': [],
            'search_previous_page' : `/search?name=${req.coimaterm}&page=${(req.coimapage > 1)? parseInt(req.coimapage) - 1: req.coimapage}` ,
            'search_next_page' :  `/search?name=${req.coimaterm}&page=${(req.coimapage < resp.coimatotalpages)? parseInt(req.coimapage) + 1: req.comimapage}`,
            'search_page' :  req.coimapage
        }      

        searchresults.forEach( (mv, i) => {
            dataobj.search_results.push({
                'result_index' : i+1, 
                'result_title': mv.title,
                'result_link' : `/movies/${mv.id}`
            })

        })
        resp.send(template(dataobj))
    })    
}

/**
 * 
 * @param {*} wrapper 
 * @param {*} movie 
 */
function createMovieView(req, resp, movie){
    fs.readFile(resp.template, function(error,data){
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
        resp.send(template(dataobj))        
    })    
}

/**
 * 
 * @param {*} wrapper 
 * @param {*} movie 
 */
function createActorView(req, resp, actor){
    fs.readFile(resp.template, function(error,data){
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
        resp.send(template(dataobj))
    })  
}

/**
 * 
 * @param {*} req 
 * @param {*} resp 
 */
function createHomeView(req, resp){
    fs.readFile(TEMPLATE_INDEX_PATH, function(error,readdata){
        if(error){
            resp.status(500).send(error.toString())           
            logger(error.toString())
        }
        else{
            let data = readdata.toString()
            resp.status(200).send(data)
            }            
        })
}


module.exports = {
    'createHomeView' : createHomeView,
    'searchRoute' : searchRoute,
    'commonRoute' : commonRoute,
    'test' : (req, resp, next) => {
        setTimeout(() => resp.send("Response Data"),3000)
    }
}
'use strict'

let fs = require('fs')
let hb = require('handlebars')

const logger = (msg) => {console.log('Dispatcher: ' + msg); return msg;}

const TEMPLATE_FILE_SEARCH = 'templateviews/search.hbs'
const TEMPLATE_FILE_MOVIE  = 'templateviews/movie.hbs'
const TEMPLATE_FILE_ACTOR = 'templateviews/actor.hbs'
const TEMPLATE_FILE_INDEX = 'templateviews/index.hbs'

//costum data for diferent endpoints
const routes = {
    '/movies' : { 'template' : TEMPLATE_FILE_MOVIE, 'view' : createMovieView },
    '/actors' : { 'template' : TEMPLATE_FILE_ACTOR, 'view' : createActorView }
}

/**
 * midleware for endpoints with identical format
 * /movies/{id}
 * /actors/{id}
 * @param {obj} req         represents a http request
 * @param {obj} resp        represents a http response
 * @param {function} next   
 */
function commonRoute(req, resp, next){

    req.coimarouter = req.baseUrl;          //required, on calling next() this is trimmed to "".
    [,req.coimaterm] = req.url.split('/')

    if(req.coimaterm == ''){        
        resp.status(404).send(`No Valid ID for ${req.baseUrl}/{id}`)     
        return
    }

    if(isNaN(req.coimaterm)){        
        resp.status(404).send(`"${req.coimaterm}" is not valid as id`)         
        return
    }

    //using decorator pattern for calling view
    const ori_send = resp.send
    resp.send = (...args) => {
        resp.send = ori_send
        resp.template = routes[req.coimarouter].template
        routes[req.coimarouter].view(req, resp, ...args)        
    }
    next()    
}

/**
 * Midleware for search endpoint
 * /search?name={query}
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function searchRoute(req, resp, next){    
    let query = req.param('name')
    let page = req.param('page') 

    if(page == undefined || page <= 0 || isNaN(page))
        page = '1'
   
    req.coimapage = page
    req.coimarouter = req.baseUrl
    req.coimaterm = query   

     //using decorator pattern for calling view
     const ori_send = resp.send
     resp.send = (...args) => {
         resp.send = ori_send
         resp.template = TEMPLATE_FILE_SEARCH
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
    fs.readFile(TEMPLATE_FILE_INDEX, function(error,readdata){
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
}
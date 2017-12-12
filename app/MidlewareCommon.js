'use strict'

let fs = require('fs')
let hb = require('handlebars')

const logger = (msg) => {console.log('Midleware Common: ' + msg); return msg;}

const TEMPLATE_FILE_MOVIE  = 'templateviews/movie.hbs'
const TEMPLATE_FILE_ACTOR = 'templateviews/actor.hbs'


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
    [,req.coimaterm] = req.url.split('/')   // can be improved using path variables from express

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
            'movie_cast': [],    
            'user_home' : "/login"                   
        }
        
        movie.castitemdto.forEach((elem, i)=>{
            dataobj.movie_cast.push(
                {
                    'cast_index' : i+1, 
                    'cast_name': elem.name,
                    'cast_link' : `/actors/${elem.id}`
                })
        })

        if(req.isAuthenticated()){
            current_movie_id = 0
            dataobj.user_home = `/users/${req.user.name}`  
        }
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



module.exports = commonRoute
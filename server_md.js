'use strict'

let http = require('http')
const endpoints = ['search', 'movies', 'actors']
const TAG = 'Server'

const logger = (msg) => {console.log(TAG + ': ' + msg)}

function TmdbCreator(){
    return {
        'api' : 'http://api.themoviedb.org/3',
        'key' : 'a05eacfb6a397de0be6aed1a2c4ca73c',
        'search' : function () {return `${this.api}/search/movie?api_key=${this.key}&query=${this.query}`},
        'movies' : function () {return `${this.api}/movie/${this.id}?api_key=${this.key}`},
        'actors' : function () {return `${this.api}/person/${this.id}/movie_credits/?api_key=${this.key}`}
    }
}

let tmdb = new TmdbCreator()

function requestFail(resp, msg){
    resp.writeHead(404,{'Content-Type': 'text/html'})
    resp.write(msg)
    resp.end()
}

function requestSuccess(req, resp){
    resp.writeHead(200, {'Content-Type': 'text/html'})
    // Call dispacher here ??
    resp.end()
}

/*
Handler for client requests
*/
function requestResponse(req, resp){
    if(req.method == 'GET'){
        let endpoint = req.url.split('/').splice(1)
        if(!endpoints.includes(endpoint[0])){
            let msg = `Endpoint not found \"/${endpoint[0]}\"`
            logger(msg)
            requestFail(resp,msg)
            return
        }
        logger(endpoint)
        requestSuccess(req, resp)
    }
}


/*
Request Function, returns data for the given id and path
if successufull calls the callback with the received data as
parameter
on error return error data 
*/
function requestFunction(reqParam){
    tmdb.id = reqParam.id
    tmdb.query = reqParam.query
    let url = tmdb[reqParam.path]()
    
    if(url == undefined){
        let error = 'Request: Invalid Path' + reqParam.path
        logger(error)
        reqParam.response(error)
        return
    }    
    
    http.get(url, (resp) => {
        let buffer = ''
        resp.on('data', (data) => buffer += data)
        resp.on('end', () => reqParam.response(buffer))
        resp.on('error', (erro) => { logger(error); reqParam.response(error) })
        logger('Requesting data from ' + url)
    })
}  

/*
    Initialize server to process client requests and do requests
*/
module.exports = {    
    'init' : function (port){http.createServer( requestResponse).listen(port); logger(`Started on ${port}`)},
    'get' : function(url, callback){
        http.get(url, (resp) => {
            let buffer = ""
            resp.on('data', (data) => buffer += data)  //TODO: improve this ?
            resp.on('end', () => callback(buffer))
            resp.on('error', (erro) => logger(error))
            logger('Requesting data from ' + url)
        })
    },
    'request' : requestFunction
}
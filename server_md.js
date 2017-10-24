'use strict'

let http = require('http')
const endpoints = ['search', 'movies', 'actors']
const TAG = 'Server'

const logger = (msg) => {console.log(TAG + ': ' + msg)}

function TmdbCreator(){
    return {
        'api' : 'http://api.themoviedb.org/3',
        'key' : 'a05eacfb6a397de0be6aed1a2c4ca73c',
        'search' : function () {return `${this.api}/search/movie?api_key=${this.key}&${this.query}`},
        'movies' : function () {return `${this.api}/movie/${this.id}?api_key=${this.key}`}
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


module.exports = {    
    'init' : function (port){http.createServer( requestResponse).listen(port); logger(`Started on ${port}`)},
    'get' : function(url, callback){
        http.get(url, (resp) => {
            let buffer = ""
            resp.on('data', (data) => buffer += data)  //TODO: improve this ?
            resp.on('end', () => callback(buffer))
            resp.on('error', (erro) => logger(error))
        })
    }
}
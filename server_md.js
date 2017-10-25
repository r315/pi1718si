'use strict'

let http = require('http')
const endpoints = ['search', 'movies', 'actors']
const TAG = 'Server'

const logger = (msg) => {console.log(TAG + ': ' + msg); return msg;}

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

/*
client request responses
*/
function dispatcherMock(endpointReq, endpointReq_cb){
    endpointReq.data = 'Recieved Data'    
    endpointReq_cb(endpointReq)   
}


function requestFail(resp, msg){
    resp.writeHead(404,{'Content-Type': 'text/html'})
    resp.write(msg)
    resp.end()
}

/*
on success the server has to request data to the dispatcher ans this data could not 
be available emidiatly, so as solution an object and a callback is used as parametes
when calling the dispatcher
*/
function requestSuccess(req, resp, endpoint){
    resp.writeHead(200, {'Content-Type': 'text/html'})
    dispatcherMock({
        'resp' : resp,
        'req' : req,
        'endpoint': endpoint,
        'data' : ''
    }, 
    function(epReq){ 
        epReq.resp.write(epReq.data); 
        epReq.resp.end();
        //logger(epReq.data)
    })
}

/*
Handler for client requests
*/
function requestResponse(req, resp){
    if(req.method == 'GET'){
        let endpoint = {}
        endpoint.url = req.url;
        endpoint.path = endpoint.url.split('/').splice(1)

        if(endpoint.path == ''){
            let msg = 'No endpoint selected'
            logger(msg)
            requestFail(resp, msg)
            return
        }
         
        // TODO: This MUST Be Fixed
        if(endpoint.path[0].includes('search')){
            endpoint.query = endpoint.url.split('=').splice(1)
            if(endpoint.query == ''){
                requestFail(resp, logger('Error missing query for search'))
                return
            }
        }else{
            endpoint.id = endpoint.path[1]
            if(endpoint.id == undefined || endpoint.id == '' ){
                requestFail(resp, logger('Error missing id for movie'))
                return
            }
        }
        logger(endpoint.url)
        requestSuccess(req, resp, endpoint)
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
    'init' : function (port){http.createServer( requestResponse ).listen(port); logger(`Started on ${port}`)},
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
'use strict'

let http = require('http')
let fs = require('fs')

const endpoints = ['search', 'movies', 'actors']
const CONFIG_FILE = 'server.json'

const logger = (msg) => {console.log('Server: ' + msg); return msg;}

let tmdb 
let initialyzed = false

/*
Create an object that contains links and key for the api
*/
function TmdbCreator(apikey){
    return {
        'api' : 'http://api.themoviedb.org/3',
        'key' : apikey,
        'search' : function () {return `${this.api}/search/movie?api_key=${this.key}&query=${this.query}`},
        'movies' : function () {return `${this.api}/movie/${this.id}?api_key=${this.key}`},
        'actors' : function () {return `${this.api}/person/${this.id}/movie_credits?api_key=${this.key}`},
        'configuration' : function () {return `${this.api}/configuration?api_key=${this.key}`},
        'posterurl' : function () {return `${this.base_url}${this.logo_sizes[this.poster_size]}/${this.poster_path}`}
    }
}

/*
on success the server has to request data to the dispatcher ans this data could not 
be available emidiatly, so as solution an object and a callback is used as parametes
when calling the dispatcher
*/

function requestFail(resp, msg){
    resp.writeHead(404,{'Content-Type': 'text/html'})
    resp.write(msg)
    resp.end()
}

/*
Handler for client requests
*/
function requestResponse(req, resp){    
    if(req.method == 'GET'){
        let wrapper= {}
        wrapper.url = req.url;
        wrapper.path = wrapper.url.split('/').splice(1)

        if(wrapper.path == ''){
            let msg = 'No endpoint selected'
            logger(msg)
            requestFail(resp, msg)
            return
        }
         
        // TODO: This MUST Be Fixed
        if(wrapper.path[0].includes('search')){
            wrapper.query = wrapper.url.split('=').splice(1)
            if(wrapper.query == ''){
                requestFail(resp, logger('Error missing query for search'))
                return
            }
        }else{
            wrapper.id = wrapper.path[1]
            if(wrapper.id == undefined || wrapper.id == '' ){
                requestFail(resp, logger('Error missing id for movie'))
                return
            }
        }
        wrapper.req = req
        wrapper.resp = resp
        wrapper.response = function(epReq){ 
            epReq.resp.writeHead(200, {'Content-Type': 'text/html'})
            epReq.resp.write(epReq.url); 
            epReq.resp.end();
            //logger(epReq.data)
        }

        logger(wrapper.url)
        //dispatcher(wrapper)
        setTimeout(() => wrapper.response(wrapper),2000)
    }
}


/*
Request Function, returns data for the given id and path
if successufull calls the callback with the received data as
parameter
on error return error data 
*/
function requestFunction(reqParam){
    checkInitialyzed()
    Object.keys(reqParam)
        .forEach((prop) => tmdb[prop] = reqParam[prop])

    let url = tmdb[reqParam.path]()
    
    if(url == undefined){
        let error = 'Request: Invalid Path' + reqParam.path
        logger(error)
        reqParam.response(error)
        return
    }
    
    /* for maintain async model set mock callback */
    if(reqParam.path == 'posterurl'){
        setTimeout(() => reqParam.response(url),10)
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

function checkInitialyzed(){
    if(initialyzed == false) 
        throw new Error("Server Not initialyzed")   
}


/*
Initialize server to process client requests and do requests
Create tmdb api object with configurations
*/
function init(port){    
    try{
        let data = JSON.parse(fs.readFileSync(CONFIG_FILE,'utf8'))
        if (data.key == undefined || data.key == '') {
           throw new Error()
        }        
        tmdb = new TmdbCreator(data.key)
        initialyzed = true
        /* if no configuration for images get it from api */
        if (data.base_url == undefined || data.base_url == '') {
            requestFunction({
                'path':'configuration', 
                'response' : function(conf){
                    let data = JSON.parse(conf).images
                    tmdb.base_url = data.base_url
                    tmdb.logo_sizes = data.logo_sizes
                    fs.writeFile(CONFIG_FILE,JSON.stringify(tmdb))
                }
            })
        }
        else{
            tmdb.base_url = data.base_url
            tmdb.logo_sizes = data.logo_sizes
        }

        http.createServer( requestResponse ).listen(port)    
        logger(`Started on ${port}`)    
    }catch(err){
        logger(`Unable to read key from file \"${CONFIG_FILE}\"`)
        logger(`Please add key file, exiting...`)            
        process.exit()
    }   
}

/*
Server Exports
*/
module.exports = {    
    'init' : init,
    'get' : function(url, callback){
        checkInitialyzed()
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
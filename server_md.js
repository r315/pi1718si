'use strict'

let http = require('http')
let fs = require('fs')
let dispatcher = require('./dispatcher')

const CONFIG_FILE = 'server.json'

const logger = (msg) => {console.log('Server: ' + msg); return msg;}

let tmdb 
let initialyzed = false

/*
Create an object that contains links and key for the api
*/
function TmdbCreator(){
    return {
        'api' : '',
        'key' : '',
        'page' : 1,
        'search' : function () {return `${this.api}/search/movie?api_key=${this.key}&query=${this.query}&page=${this.page}`},
        'movies' : function () {return `${this.api}/movie/${this.id}?api_key=${this.key}`},
        'actors' : function () {return `${this.api}/person/${this.id}?api_key=${this.key}`},
        'roles' : function () {return `${this.api}/person/${this.id}/movie_credits?api_key=${this.key}`},
        'configuration' : function () {return `${this.api}/configuration?api_key=${this.key}`},
        'posterurl' : function () {return `${this.base_url}${this.logo_sizes[this.poster_size]}/${this.poster_path}`}
    }
}

/*
Request Function, returns confdata for the given id and path
if successufull calls the callback with the received confdata as
parameter
on error return error confdata 
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
    
    /* confData required is available locally, so return confdata immediatly */
    if(reqParam.path == 'posterurl'){
        reqParam.data = url
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
function init(){    
    try{

        let confdata = JSON.parse(fs.readFileSync(CONFIG_FILE,'utf8'))
        if (confdata.key == undefined || confdata.key == '' ||
            confdata.api == undefined || confdata.api == '') {
           throw new Error()
        } 

        tmdb = new TmdbCreator()
        tmdb.api = confdata.api
        tmdb.key = confdata.key

        initialyzed = true
        /* if no configuration for images get it from api */
        if (confdata.base_url == undefined || confdata.base_url == '') {
            requestFunction({
                'path':'configuration', 
                'response' : function(conf){
                    let data = JSON.parse(conf).images
                    tmdb.base_url = data.base_url
                    tmdb.logo_sizes = data.logo_sizes
                    fs.writeFile(CONFIG_FILE,JSON.stringify(tmdb),()=> logger(`Configuration Saved to \"${CONFIG_FILE}\"`))                    
                }
            })
        }
        else{
            tmdb.base_url = confdata.base_url
            tmdb.logo_sizes = confdata.logo_sizes
        }
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
            resp.on('data', (data) => buffer += data)
            resp.on('end', () => callback(buffer))
            resp.on('error', (erro) => logger(error))
            logger('Requesting data from ' + url)
        })
    },
    'request' : requestFunction
}
'use strict'
const request = require('request')
const fs = require('fs')

const logger = (msg) => {console.log('DBACCESS: ' + msg); return msg;}

const CONFIG_FILE = 'server.json'
let serveraddress = ''
const usersdb = 'users'
const moviesdb = 'movies'
const commendsdb = 'comments'

let options = {
        headers: {
            'Content-Type' : 'application/json'   // only set if json is sent as string on body         
        },
        'setUri' : function(path){this.uri =`${serveraddress}/${path}`}
    }

function createDocument(doc, cb){
    options.setUri(doc.id)
    request.put(options, function(error, resp, body){        
        logger(`Status on put: ${resp.statusCode}-${resp.statusMessage}`)
        cb(error,JSON.parse(body))
      }).form(JSON.stringify(doc.form))
}

function getDocument(docid, cb){
    options.setUri(docid)
    request.get(options, function(error, resp, body){        
        logger(`Status on get: ${resp.statusCode}-${resp.statusMessage}`)
        cb(error,JSON.parse(body))
      })
}

function deleteDocument(doc, cb){
    options.setUri(doc.id)
    options.headers['If-Match'] = doc.form['_rev']
    request.delete(options, function(error, resp, body){        
        logger(`Status on delete: ${resp.statusCode}-${resp.statusMessage}`)
        cb(error,JSON.parse(body))
      })
}

function createUser(user, cb){    
    createDocument({
        'id' : `${usersdb}/${user.name}`,
        'form' : user
    }, cb)
}

function removeUser(user, cb){
    deleteDocument({
        'id' : `${usersdb}/${user.name}`,
        'form' : user
    }, cb)
}

function createMovie(movie, cb){    
    createDocument({
        'id' : `${moviesdb}/${movie.id}`,
        'form' : movie
    }, cb)
}

function removeMovie(movie, cb){
    deleteDocument({
        'id' : `${moviesdb}/${movie.id}`,
        'form' : movie
    }, cb)
}        

function createDataBase(name){
    let doc = {
        'id':usersdb
    }
    createDocument(doc, (error, doc) => {
        if(error || doc.error){
            logger( `Error ${error ? error : doc.reason}`)    
            return
        }
        logger( `${name} created!`)    
    })
}

function createDb(){
    createDataBase(usersdb)
    createDataBase(moviesdb)
    createDataBase(commentsdb)
}

/**
 * This function uses POST method to insert a comment to database
 * so that an id can be obtained insted of give one
 * 
 * @param {object} comment 
 * @param {function} cb 
 */
function postComment(comment, cb){
        options.setUri(commendsdb)
        options.body = JSON.stringify(comment)
        options.method = 'POST'
        request(options, function(error, resp, body){        
            logger(` Status on post comment: ${resp.statusCode}-${resp.statusMessage}`)
            let cmnt = JSON.parse(body)
            if(error || cmnt.error)
                cb(error, cmnt)
            else{
                comment.id = cmnt.id
                cb(error, comment) 
            }
      })
}

(function init(){    
    try{

        let confdata = JSON.parse(fs.readFileSync(CONFIG_FILE,'utf8'))
        serveraddress = confdata.couchdb

        if (serveraddress == undefined){
            logger(`Error no server adddress found on ${CONFIG_FILE}`)
            throw new Error('Fail to get couch server address')
        }
    }catch(err){
        logger(`Unable to read configuration from \"${CONFIG_FILE}\"`)  
        process.exit()
    }   
})()

module.exports = {
    'initdb' : createDb,
    'createUser' : createUser,    
    'getUser' : function (username, cb){getDocument(`${usersdb}/${username}`, cb)},
    'updateUser' : createUser,
    'deleteUser' : removeUser,

    'createMovie' : createMovie,
    'getMovie' : function getMovie(movieid, cb){ getDocument(`${moviesdb}/${movieid}`, cb)},
    'updateMovie' : createMovie,
    'deleteMovie' : removeMovie,
    
    'insertUser' : createUser,

    'postComment' : postComment
}

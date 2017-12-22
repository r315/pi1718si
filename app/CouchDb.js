'use strict'
const request = require('request')

const logger = (msg) => {console.log('DBACCESS: ' + msg); return msg;}

const serveraddress = 'http://localhost:5984'
const usersdb = 'users'
const moviesdb = 'movies'

let options = {
        headers: {
            'Content-Type' : 'application/json'            
        },
        'setUri' : function(path){this.uri =`${serveraddress}/${path}`}
    }

function createDocument(doc, cb){
    options.setUri(doc.id)
    request.put(options, function(error, resp, body){        
        console.log('DBACCESS: Status on put:',`${resp.statusCode}-${resp.statusMessage}`)
        cb(error,JSON.parse(body))
      }).form(JSON.stringify(doc.form))
}

function getDocument(docid, cb){
    options.setUri(docid)
    request.get(options, function(error, resp, body){        
        console.log('DBACCESS: Status on get:',`${resp.statusCode}-${resp.statusMessage}`)
        cb(error,JSON.parse(body))
      })
}

function deleteDocument(doc, cb){
    options.setUri(doc.id)
    options.headers['If-Match'] = doc.form['_rev']
    request.delete(options, function(error, resp, body){        
        console.log('DBACCESS: Status on delete:',`${resp.statusCode}-${resp.statusMessage}`)
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
}

module.exports = {
    'createDb' : createDb,
    'createUser' : createUser,    
    'getUser' : function (username, cb){getDocument(`${usersdb}/${username}`, cb)},
    'updateUser' : createUser,
    'deleteUser' : removeUser,

    'createMovie' : createMovie,
    'getMovie' : function getMovie(movieid, cb){ getDocument(`${moviesdb}/${movieid}`, cb)},
    'updateMovie' : createMovie,
    'deleteMovie' : removeMovie,
    
    'insertUser' : createUser
}

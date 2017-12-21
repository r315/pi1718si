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

function createUser(user, cb){    
    createDocument({
        'id' : `${usersdb}/${user.name}`,
        'form' : user
    }, cb)
}

function getUser(username, cb){    
    getDocument(`${usersdb}/${username}`, cb)
}

function createMovie(movie, cb){    
    createDocument({
        'id' : `${moviesdb}/${movie.id}`,
        'form' : movie
    }, cb)
}

function getMovie(movieid, cb){    
    getDocument(`${moviesdb}/${movieid}`, cb)
}

function createDb(){
    createDocument({'id':usersdb}, (error, doc) => logger(error ? error : `${doc.id} created!`))
    createDocument({'id':moviesdb}, (error, doc) => logger(error ? error : `${doc.id} created!`))
}

module.exports = {
    'createDb' : createDb,
    'createUser' : createUser,    
    'getUser' : getUser,    
    'updateUser' : createUser,

    'createMovie' : createMovie,
    'getMovie' : getMovie,
    'updateMovie' : createMovie,

    'searchByUser' : getUser,
    'insertUser' : createUser
}

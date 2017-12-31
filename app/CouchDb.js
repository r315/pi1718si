'use strict'
const request = require('request')
const fs = require('fs')

const logger = (msg) => {console.log('DBACCESS: ' + msg); return msg;}

const CONFIG_FILE = 'server.json'
let serveraddress = ''
const usersdb = 'users'
const moviesdb = 'movies'
const commentsdb = 'comments'

const couchdbview = {
    'id' : `${commentsdb}/_design/filters`,
    'form' : {
                "language": "javascript",
                "views": { 
                            "paging": { "map": "function(doc) {\n  emit(null, doc);\n}" },
                            "user": { "map": "function(doc) {\n  emit(doc.username, doc);\n}" }
                        }
            }
}

let options = {
        headers: {
            'Content-Type' : 'application/json'   // only set if json is sent as string on body         
        },
        'setUri' : function(path){this.uri =`${serveraddress}/${path}`}
    }

const respFinish = function(error, body, cb){
    if(error){
        cb(error,null)
        return
    }
    let doc = JSON.parse(body)
    if(doc.error){
        cb(doc,null)
        return
    }
    cb(null,doc)
}

function createDocument(doc, cb){
    options.setUri(doc.id)
    options.body = JSON.stringify(doc.form)
    request.put(options, function(error, resp, body){        
        logger(`PUT ${doc.id} ${resp.statusCode}-${resp.statusMessage}`)
        respFinish(error,body,cb)
    })
}

function getDocument(docid, cb){
    options.setUri(docid)
    request.get(options, function(error, resp, body){        
        logger(`GET ${docid} ${resp.statusCode}-${resp.statusMessage}`)
        respFinish(error,body,cb)
      })
}

function deleteDocument(doc, cb){
    options.setUri(doc.id)
    options.headers['If-Match'] = doc.form['_rev']
    request.delete(options, function(error, resp, body){        
        logger(`DELETE ${doc.id} ${resp.statusCode}-${resp.statusMessage}`)
        respFinish(error,body,cb)
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

function getMovie(movieid, cb){ 
    getDocument(`${moviesdb}/${movieid}`, cb)
}

function removeMovie(movie, cb){
    deleteDocument({
        'id' : `${moviesdb}/${movie.id}`,
        'form' : movie
    }, cb)
} 
/**
 * Trys to get a movie from db, if unsuccessful
 * creates one
 * @param {object} movie 
 * @param {function} cb 
 */
function createOnGetMovie(movie, cb){
     // create movie
     function createMov(mv){
        createMovie(mv, (error, cmovie) => {
            if(error){              // if error something is wrong...
                cb(error, null)
                return
            }
            movie._rev = cmovie.rev    // fix for allow update            
            cb(null,movie)
        })
    }

    getMovie(movie.id, (error, existingmovie)=>{
        if(error){              //on error try to create
            createMov(movie)
            return
        }
        cb(null,existingmovie)
    })
}

function createDataBase(name){
    let doc = {
        'id':name
    }
    createDocument(doc, (error, doc) => {
        if(error){
            logger( `Error: ${error.error}, Reason: ${error.reason}`)    
            return
        }
        logger( `database \"${name}\" created!`)
    })
}

function createDb(){
    createDataBase(usersdb)
    createDataBase(moviesdb)
    createDataBase(commentsdb)
    createDocument(couchdbview, (error, view) => {
        logger(error ? `Error: ${error.error}, Reason: ${error.reason}` : `{ok:\"${view.ok}\",id:\"${view.id}\", rev: \"${view.rev}}\"` )})
}

/**
 * This function uses POST method to insert a comment to database
 * so that an id can be obtained insted of give one
 * 
 * @param {object} comment 
 * @param {function} cb 
 */
function postComment(comment, cb){
        options.setUri(commentsdb)
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

/**
 * TODO: paging, fix post order
 * @param {*} stat 
 * @param {*} end 
 * @param {*} cb 
 */
function getComments(cmntid, stat, end, cb){   
    getDocument(`${commentsdb}/${cmntid}`, (error, cmnt) => {
        if(error){
            cb(error, null)
            return
        }
        cmnt.id = cmnt._id
        delete cmnt._id     // remove duplicated propertie
        cb(null, cmnt)
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
    'getMovie' : getMovie,
    'updateMovie' : createMovie,
    'deleteMovie' : removeMovie,
    'createOnGetMovie' : createOnGetMovie,
    
    'insertUser' : createUser,

    'postComment' : postComment,
    'getComments' : getComments
}

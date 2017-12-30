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
    request.put(options, function(error, resp, body){        
        logger(`PUT ${doc.id} ${resp.statusCode}-${resp.statusMessage}`)
        respFinish(error,body,cb)
      }).form(JSON.stringify(doc.form))
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
           cb(null,cmovie)
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
function postComment(movieid, comment, cb){
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

/**
 * TODO: paging, fix post order
 * @param {*} stat 
 * @param {*} end 
 * @param {*} cb 
 */
function getComments(movieid, stat, end, cb){
    function extractComments(error, data){
        if(error){
            cb(error, null)
            return
        }
        if(data.error){
            cb(data.reason, null)
            return
        }

        let comments = []        
        data.rows.forEach(r =>{
         r.value.id = r.value._id   // use id instead of _id
         delete r.value._id         //bah remove duplicated id
         comments.push(r.value)
        })   
        cb(null, comments)
    }
    getDocument(`${commendsdb}/_design/filters/_view/paging`, extractComments)
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

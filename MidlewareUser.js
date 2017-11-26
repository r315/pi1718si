'use strict'

let fs = require('fs')
let hb = require('handlebars')
let uuid = require('uuid/v1');

const logger = (msg) => {console.log('Midleware User: ' + msg); return msg;}
const TEMPLATE_FILE_USER = 'templateviews/user.hbs'
const TEMPLATE_FILE_LOGIN = 'templateviews/login.hbs'
const LOGIN_PATH = '/users/login'

let loggedusers = []

function isLogged(id){
    
    // check in current logged users array
    return false
}

function loginView(req, resp, next){
    fs.readFile(TEMPLATE_FILE_LOGIN, function(error, data){
        let source = data.toString()
        let template = hb.compile(source) 

        let dataobj = {
            'login_link' : LOGIN_PATH
        }
        
        // check credentials with database
        // add session id to logged collection
        loggedusers.push(req.cookie)
        // set cookie with login info 
        // redirect to user page
        resp.send(template(dataobj))        
    })    
}


/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function userRoute(req, resp, next){

    let id = req.params.id

    if(isNaN(id)){
        loginView(req, resp, next) //TODO discuss response to invalid paths
        return
    }

    if(isLogged(id)){
        console.log(`Profile acessed ${id}`)
        resp.end()
        return
    }

    // fix for login direct access
    resp.cookie('login-info',{
        'status':-1,
        'sessionId' : uuid(6,'0'),
        'userid' : id
    })
        
    resp.redirect('/users/login')
}


module.exports = userRoute
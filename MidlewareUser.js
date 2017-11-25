'use strict'

let fs = require('fs')
let hb = require('handlebars')

const logger = (msg) => {console.log('Midleware User: ' + msg); return msg;}
const TEMPLATE_FILE_USER = 'templateviews/user.hbs'
const TEMPLATE_FILE_LOGIN = 'templateviews/login.hbs'


function isLogged(id){
    return false
}

function loginView(req, resp, next){
    fs.readFile(TEMPLATE_FILE_LOGIN, function(error, data){
        let source = data.toString()
        let template = hb.compile(source) 

        let dataobj = {
            'prop' : ''             
        }
        
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
   
    resp.cookie('logInfo' , 'Not Logged')
    resp.redirect('/users/login')
}


module.exports = userRoute
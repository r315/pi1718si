'use strict'

let fs = require('fs')
let hb = require('handlebars')

const logger = (msg) => {console.log('Midleware User: ' + msg); return msg;}
const TEMPLATE_FILE_INDEX = 'templateviews/user.hbs'


/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function userRoute(req, resp, next){
    logger('hello')
    resp.end()
}


module.exports = userRoute
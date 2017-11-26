'use strict'

let fs = require('fs')
let hb = require('handlebars')

const TEMPLATE_FILE_INDEX = 'templateviews/index.hbs'

/**
 * Return view for home page
 * @param {*} req 
 * @param {*} resp 
 */
function homeRoute(req, resp){
    fs.readFile(TEMPLATE_FILE_INDEX, function(error,readdata){
        if(error){
            resp.status(500).send(error.toString())           
            logger(error.toString())
        }
        else{
            let data = readdata.toString()
            resp.status(200).send(data)
            }            
        })
}

module.exports = homeRoute
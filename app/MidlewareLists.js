'use strict'

let fs = require('fs')
let hb = require('handlebars')
let us = require('user')

const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}

const TEMPLATE_FILE_LISTS = 'templateviews/lists.hbs'

/**
* Midleware for List Displaying and Handeling
* /search?name={query}
* @param {*} req 
* @param {*} resp 
* @param {*} next 
*/
function getLists(req, resp, next){    
    let cookie = req.cookies[COOKIE_NAME]
    let user = createuser(req.params.username)
    let userInfo = ''//Function to Query User object from Couch 
    user = createUserFromCB(user, userInfo)

    let Lists = user.favLists

    rep.user= user
    /* Checar o que FAZ*/
    req.coimapage = page
    req.coimarouter = req.baseUrl
    req.coimaterm = query   

    //using decorator pattern for calling view
    const ori_send = resp.send
    resp.send = (...args) => {
        resp.send = ori_send
        resp.template = TEMPLATE_FILE_LISTS
        createListView(req, resp, ...args)
    }
    next()
}

/**
 * 
 * Get the html template for search results page and
 * fill it with the results
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} searchresults 
 */
function createListView(req, resp, searchresults){
    /*
    fs.readFile(resp.template, function(error,data){
        let source = data.toString()
        let template = hb.compile(source)
        let dataobj = { 
            'user_name' : req.user.name,
            'search_results': [],
            'search_previous_page' : `/search?name=${req.coimaterm}&page=${(req.coimapage > 1)? parseInt(req.coimapage) - 1: req.coimapage}` ,
            'search_next_page' :  `/search?name=${req.coimaterm}&page=${(req.coimapage < resp.coimatotalpages)? parseInt(req.coimapage) + 1: req.comimapage}`,
            'search_page' :  req.coimapage
        }      

        searchresults.forEach(user.favList.favorit.movie, i) => {
            dataobj.search_results.push({
                'result_index' : i+1, 
                'result_listName': user.favList.favorit.name,
                'result_link' : `/lists/${user.favList.favorit.id}`
            })

        })
        resp.send(template(dataobj))
    })
    */    
}


module.exports = getLists
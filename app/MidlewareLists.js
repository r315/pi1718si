'use strict'

const us = require('./user')

const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}

/**
* Midleware for List Displaying and Handeling
* /search?name={query}
* @param {obj} req 
* @param {obj} resp 
* @param {func} next 
*/
function getLists(req, resp, next){    
  
    let user = us.createUser(req.params.id)
    //TODO: let userInfo = ''//Function to Query User object from Couch
    
    //Test Code:
    let userInfo = '{"name":"hbarroca", "_id":"1", "favLists":[{"id":"1","name":"Test"}, {"id":"2","name":"Test"}, {"id":"3","name":"Test" } ],"docVersion":"2","type":"user"}'
    user = us.createUserFromCB(user, userInfo)
    //
    
    resp.render('lists',{
        'user_name' : user.name,
        'list_results' : user.favLists
    })
    return
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
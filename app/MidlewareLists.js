'use strict'

let router = require('express').Router()
const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}


/**
* Midleware for List Displaying and Handeling
* /search?name={query}
* @param {obj} req 
* @param {obj} resp 
* @param {func} next 
*/
function getLists(req, resp, next){ 
    resp.render('lists',{
        'user_name' : req.user.name,
        'list_results' : req.user.favLists
    })
    return
}


function addList(req, resp, next){
   req.user.favLists.push(
        {
            'list_id' : '#',
            'list_name' : req.body.listname
        })
    resp.cookie('user-data', JSON.stringify(req.user))
    resp.redirect(req.originalUrl)
}

router.get('/', getLists)
router.get('/:id', getLists)
router.use('/:id/', (req, resp, next) => {next()})

router.post('/',addList)

module.exports = router
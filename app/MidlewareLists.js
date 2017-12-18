'use strict'

let router = require('express').Router()
let userstorage = require('./CouchDb')

const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}


/**
* Midleware for List Displaying and Handeling
* /search?name={query}
* @param {obj} req 
* @param {obj} resp 
* @param {func} next 
*/
function getLists(req, resp, next){ 
    req.user.favLists.forEach( (l) =>{
        l.list_path = `users/${req.user.name}/lists/${l.list_id}` 
    })

    resp.render('lists',{
        'user_name' : req.user.name,
        'list_results' : req.user.favLists
    })
    return
}
/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function newFavList(req, resp, next){
    let newlist = {
        'list_id' : '#',
        'list_name' : req.body.listname,        
    }

    userstorage.insertfavlist(newlist,(data)=>{
        newlist.list_id = data.id        
        req.user.favLists.push(newlist)
        resp.cookie('user-data', JSON.stringify(req.user))
        userstorage.updateUser(req.user, 
            ()=> resp.redirect(req.originalUrl) )              // redirect to user lists page displaying the new created list
    })
}

function removeList(req, resp, next){
    logger("Deleting list: " + req.params.id)
    req.user.favLists = req.user.favLists.filter( (elem) => { return elem.list_id !== req.params.id})
    resp.cookie('user-data', JSON.stringify(req.user))
    resp.status(200)
    resp.method = "GET"
    resp.redirect(req.baseUrl)
}

router.get('/', getLists)
router.get('/:id', getLists)
router.use('/:id/', (req, resp, next) => {next()})

router.post('/',newFavList)
router.delete('/:id', removeList)

module.exports = router
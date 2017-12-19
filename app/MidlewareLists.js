'use strict'

const router = require('express').Router()
//const userstorage = require('./CouchDb')

const userstorage = require('./CouchDB_Mock')

const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}

/**
* @param {obj} req 
* @param {obj} resp 
* @param {func} next 
*/
function getLists(req, resp){ 
    req.user.favLists.forEach( (l) =>{
        l.list_path = `${req.baseUrl}/${l.list_id}` 
    })

    resp.render('userLists',{
        'user_name' : req.user.name,
        'list_results' : req.user.favLists
    }) 
}
/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function postList(req, resp){
    logger("Creating list: " + req.body.listname)
    let newlist = {
        'list_id' : '#',
        'list_name' : req.body.listname,        
    }

    userstorage.insertfavlist(newlist,(error, data)=>{
        newlist.list_id = data.id        
        req.user.favLists.push(newlist)
        resp.cookie('user-data', JSON.stringify(req.user))
        userstorage.updateUser(req.user, 
            ()=> resp.redirect(req.originalUrl) )  // redirect to user lists page displaying the new created list
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function deleteList(req, resp){
    logger(`Deleting list: ${req.params.listId}`)
    req.user.favLists = req.user.favLists.filter( (elem) => { return elem.list_id !== req.params.listId})
    resp.cookie('user-data', JSON.stringify(req.user))    
    resp.end()
}

/**
 * Helper function that returns a list object 
 * for a given id
 */
function getListObjFromId(lists, id){
    return lists.filter((elem) => { return elem.list_id === id})[0]
}

function getListItems(req, resp, next){
    let list = getListObjFromId(req.user.favLists, req.params.listId)
    
    if(list == undefined){
        logger(`getListItems: no list found!`)
        next()
        return
    }

    userstorage.searchbylistid(list.list_id, (error, items) =>{
        items.forEach( (item) =>{
            item.item_path = `/movies/${item.item_id}` 
        })
        resp.render('list',{
            'list_id' : list.list_id,
            'list_name' : list.list_name,
            'list_items' : items
        }) 
    })    
}

function putListItem(req, resp){
    logger(`Adding to list:  ${req.params.listId}`)
    userstorage.searchbylistid(req.params.listId,(error, items) =>{
        items.push({
            'item_name' : req.body.movie_title,
            'item_id' : req.params.movieId
        })            
        userstorage.updatefavlist(req.params.listId, items, (error, list) => resp.end())
    })    
}

function deleteListItem(req, resp){
    logger(`Deleting item: ${req.params.movieId} from list: ${req.params.listId}`)
    userstorage.searchbylistid(req.params.listId,(error, items) =>{
        let newitems = items.filter( (elem) => { return elem.item_id !== req.params.movieId})
        userstorage.updatefavlist(req.params.listId, newitems, (error, list) => resp.end())
    })
}

router.get('/', getLists)
router.get('/:listId/', getListItems)

router.post('/',postList)
router.put('/:listId/:movieId',putListItem)
router.delete('/:listId', deleteList)
router.delete('/:listId/:movieId', deleteListItem)

module.exports = router
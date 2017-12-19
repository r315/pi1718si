'use strict'

const favlist = require('./favlist')
const router = require('express').Router()
const userstorage = require('./CouchDb')
//const userstorage = require('./CouchDB_Mock')

const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}

/**
* @param {obj} req 
* @param {obj} resp 
* @param {func} next 
*/
function getLists(req, resp){
    req.user.favLists.forEach( (elem) =>{
        elem.list_path = `${req.baseUrl}/${elem.list_id}`
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
    let newlist = favlist.create(req.body.listname)

    userstorage.insertfavlist(newlist,(error, data)=>{
        if(error) {
            resp.send(error)
            return
        }        
        newlist.id = data.id        
        req.user.favLists.push({
            'list_name' : newlist.name,
            'list_id' : newlist.id
        })
        resp.cookie('user-data', JSON.stringify(req.user))
        userstorage.updateUser(req.user, 
            ()=> resp.redirect(req.originalUrl) )  // redirect to user lists page displaying the new created list
        logger("Creating list: ERROR User Update not implemented on DB")
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
 * Helper function that returns one item from a list 
 * having the given id
 */
function getListObjFromId(lists, id){
    return lists.filter((elem) => { return elem.list_id === id})[0]
}

function getListItems(req, resp, next){
    let favlist = getListObjFromId(req.user.favLists, req.params.listId)
    
    if(favlist == undefined){
        logger(`getListItems: no list found!`)
        next()
        return
    }

    userstorage.searchbylistid(favlist.id, (error, favmovielist) =>{

        favmovielist.favorits.forEach( (item) =>{
            item.item_path = `/movies/${item.item_id}` 
        })
        resp.render('list',{
            'list_id' : favlist.id,
            'list_name' : favlist.name,
            'list_items' : favmovielist.favList
        }) 
    })    
}

function putListItem(req, resp){
    logger(`Adding to list:  ${req.params.listId}`)   
    
    function putMovieOnList(movie, listId){
        userstorage.searchbylistid(listId,(error, items) =>{
            items.favorits.push(movie.id)
            userstorage.updatefavlist(items, (error, list) => resp.end())
        })  
    }


    userstorage.searchMovieById(req.params.movieId, (error, movie) =>{
        if(error){
            movie = {
                'name' : req.body.movie_title,
                'id' : req.params.movieId
            }           
            userstorage.putMovie(movie, (error, nmovie) => {
                if(error){
                    resp.send(error)
                    return
                }
                putMovieOnList(movie, req.params.listId)
            })
            return
        }
        putMovieOnList(movie, req.params.listId)       
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
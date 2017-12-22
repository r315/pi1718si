'use strict'

const router = require('express').Router()
const favlist = require('./favlist')
const userstorage = require('./CouchDb')

const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}

/**
* @param {obj} req 
* @param {obj} resp 
* @param {func} next 
*/
function getLists(req, resp){
    let dataobj =   {
        'user_name' : req.user.name,
        'list_results' : []
    }

    req.user.favLists.forEach( (elem) =>{
        dataobj.list_results.push({            
            'list_name' : elem.name,
            'list_path' : `${req.baseUrl}/${elem.id}`
        })        
    })

    resp.render('userLists', dataobj) 
}
/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function postList(req, resp){
    let user = req.user
    logger(`Creating list: \"${req.body.listname} for user ${user.name}`)
    
    let newlist = favlist.create(req.body.listname)
    newlist.id = `${user.favLists.length}`

    user.favLists.push(newlist)
    user.updateCookieData(resp, user)

    userstorage.getUser(user.name, (error, cuser) => {
        cuser.favLists = user.favLists
        userstorage.updateUser(cuser, (error, cuser)=>{
            if(error) {
                resp.send(error)
                return
            }        
            resp.cookie('user-data', JSON.stringify(user))        
            resp.redirect(req.originalUrl) // redirect to user lists page displaying the new created list        
        })
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
    userstorage.getUser(req.user.name, (error, cuser)=>{
        if(error) {
            resp.send(error)
            return
        }      
        cuser.favLists = req.user.favLists.filter( (elem) => { return elem.id !== req.params.listId})
        req.user.favLists = cuser.favLists
        userstorage.updateUser(cuser, (error, cuser)=>{
            if(error) {
                resp.send(error)
                return
            }      
            req.user.updateCookieData(resp, req.user)
            resp.end()
        })
    })
}

/**
 * Helper function that returns one item from a list 
 * having the given id
 */
function getListObjFromId(lists, id){
    return lists.filter((elem) => { return elem.id === id})[0]
}


/**
 * Make a async request for each movie id
 * 
 * @param {array} moviesid array containing only movie id's 
 * @param {function} endcb  callback for when all movies are received from database 
 */
function getAllItems(moviesid, endcb){
let counter = moviesid.length
let movies = []
    if(counter == 0){
        endcb([])
        return
    }
    moviesid.forEach( (id) => {
        userstorage.getMovie(id, (error, cmovie) => {
            if(error){
                logger(error)
                endcb([])
                return
            }
            movies.push(cmovie)
            counter-- 
            if(counter == 0){
                endcb(movies)
            }
        })
    })
}
/**
 * 
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
function getListItems(req, resp, next){
    let favlist = getListObjFromId(req.user.favLists, req.params.listId)
    
    if(favlist == undefined){
        logger(`getListItems: no list found!`)
        next()
        return
    }

    getAllItems(favlist.movies,(movies) => {
            let dataobj = {
                'list_id' : favlist.id,
                'list_name' : favlist.name,
                'list_items' : []
            }
            movies.forEach( (movie) => {
                dataobj.list_items.push({
                    'item_name' : movie.name,
                    'item_path' : `/movies/${movie.id}`
                })
            }) 
            resp.render('list',dataobj) 
    })
}
/**
 * Adds a movie to user favorit list
 * duplicates are allowed
 * @param {*} req 
 * @param {*} resp 
 */
function putListItem(req, resp){
    let user = req.user
    let listid = req.params.listId
    let movie = {
        'id' : req.params.movieId,
        'name' : req.body.movie_title
    }

    let dataobj = {}

    logger(`Adding ${movie.id} to list ${listid}`)
    
    function dataCollect(){
        if(dataobj.cuser && dataobj.cmovie){
            user.updateCookieData(resp, user)
            resp.end()
            return
        }          
    }

    userstorage.createMovie(movie, (error, cmovie) => {
        if(error){
            resp.send(error)
            return
        }
        dataobj.cmovie = cmovie
        dataCollect()
    })
        
    userstorage.getUser(user.name, (error, dbuser) =>{
        if(error){
            resp.send(error)
            return
        }
        user.favLists[listid].movies.push(movie.id)
        dbuser.favLists = user.favLists
        userstorage.updateUser(dbuser,(error, cuser) => {
            dataobj.cuser = cuser
            dataCollect()
        })
    })
}
/**
 * 
 * @param {*} req 
 * @param {*} resp 
 */
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
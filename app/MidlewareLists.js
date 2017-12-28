'use strict'

const router = require('express').Router()
const favlist = require('./favlist')
const userstorage = require('./CouchDb')

const logger = (msg) => {console.log('Midleware Lists: ' + msg); return msg;}
const PAGE_LIMIT = 5

/**
* @param {obj} req 
* @param {obj} resp 
* @param {func} next 
*/
function getLists(req, resp){

    let page = req.params.pageIndex ? parseInt(req.params.pageIndex) : 0
    page = page < 0 ? 1 : page

    let dataobj = {
        'user_name' : req.user.name,
        'list_results' : [],
        'current_page' : page,
        'next_page' : `/users/${req.user.name}/lists/page/${page + 1}`,
        'previous_page' : `/users/${req.user.name}/lists/page/${page == 0 ? page : page - 1}`
    }

    let lists = req.user.favLists.slice(page * PAGE_LIMIT, (page * PAGE_LIMIT) + PAGE_LIMIT)

    lists.forEach( (elem) =>{
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
    user.updateCookieData(resp)

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
            req.user.updateCookieData(resp)
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
                    'item_id' : movie.id,
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
            user.updateCookieData(resp)
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
    logger(`Deleting item: ${req.originalUrl}`)
    let user = req.user
    let movieId = req.params.movieId
    let movieslist = user.favLists[req.params.listId].movies
    // if movie is duplicated all will be removed
    movieslist = movieslist.filter((elem) => { return elem !== movieId})
    userstorage.getUser(user.name, (error, dbuser) => {
        dbuser.favLists[req.params.listId].movies = movieslist
        userstorage.updateUser(dbuser,(error, u) =>{
            logger(error ? u.reason : 'User Updated!')
            user.favLists[req.params.listId].movies = movieslist
            user.updateCookieData(resp)
            resp.end()
        })
    })

    
}

router.get('/', getLists)
router.get('/page/:pageIndex', getLists)
router.get('/:listId/', getListItems)

router.post('/',postList)
router.put('/:listId/:movieId',putListItem)
router.delete('/:listId/:movieId', deleteListItem)
router.delete('/:listId', deleteList)

module.exports = router
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
    newlist.id = user.favLists.length

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
        cuser.favLists = req.user.favLists.filter( (elem) => { return elem.list_id !== req.params.listId})
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
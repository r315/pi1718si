'use strict'

const router = require('express').Router()
const comments = require('./MidlewareComments')

const logger = (msg) => {console.log('Midleware Movie: ' + msg); return msg;}


/**
 * midleware for endpoints with identical format
 * /movies/{id}
 * /actors/{id}
 * @param {obj} req         represents a http request
 * @param {obj} resp        represents a http response
 * @param {function} next   
 */
function endpointMovie(req, resp, next){

    req.coimarouter = req.baseUrl
    req.coimaterm = req.params.id

    if(req.coimaterm == ''){        
        resp.status(404).send(`No Valid ID for ${req.baseUrl}/{id}`)     
        return
    }

    if(isNaN(req.coimaterm)){        
        resp.status(404).send(`"${req.coimaterm}" is not valid as id`)         
        return
    }
    // callback function when data is received
    function cb(movie){
        resp.send = ori_send    // restore original send function    
                 
        let dataobj = {
            'movie_title' : movie.title,
            'movie_director' : movie.directordto.map((elem) => elem.name).join(', '),
            'poster_url' : movie.posterurl,             
            'movie_cast': [],    
            'user_home' : "/login", 
            'show_lists' : 'false',
            'user_lists' : [],
            'enable_lists' : 'disabled'              
        }
    
        movie.castitemdto.forEach((elem, i)=>{
            dataobj.movie_cast.push(
                {
                    'cast_index' : i+1, 
                    'cast_name': elem.name,
                    'cast_link' : `/actors/${elem.id}`
                })
            })
    
            if(req.isAuthenticated()){            
                dataobj.user_home = `/users/${req.user.name}`
                dataobj.show_lists = 'true'
                if(req.user.favLists.length == 0){
                    dataobj.user_lists = [{
                        'list_id' : '#',
                        'list_name' : 'No lists'
                    }]
                }else{
                    req.user.favLists.forEach( list =>{
                        dataobj.user_lists.push({
                            'list_id' : list.id,
                            'list_name' : list.name
                        })
                    })
                }
                dataobj.enable_lists = ''
                dataobj.user_lists_path = `/users/${req.user.name}/lists`
                dataobj.movie_id = req.coimaterm
            }
    
            resp.render('movie',dataobj)
            return       
    }

    logger(`Requesting movie ${req.params.id}`)
    //using decorator pattern for calling view
    const ori_send = resp.send
    resp.send = cb
    next()    
}
router.use('/:id/comments/', comments)
router.get('/:id/', endpointMovie)
module.exports = router 
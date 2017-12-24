'use strict'

const logger = (msg) => {console.log('Midleware Actor: ' + msg); return msg;}


/**
 * midleware for endpoints with identical format
 * /movies/{id}
 * /actors/{id}
 * @param {obj} req         represents a http request
 * @param {obj} resp        represents a http response
 * @param {function} next   
 */
function endpointActor(req, resp, next){

    req.coimarouter = '/actors'
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
    function cb(actor){
        resp.send = ori_send 
          
        let dataobj = { 
            'name' : actor.name,
            'biography': actor.biography,
            'profile_url' : actor.profileurl, 
            'casted_movies' : []           
        }
            
        actor.mov.forEach((elem, i)=>{
            dataobj.casted_movies.push(
                {
                    'casted_index' : i+1, 
                    'casted_movie': elem.title,
                    'casted_link' : `/movies/${elem.id}`
                })
        })
        resp.render('actor',dataobj)          
    }

    logger(`Requesting actor ${req.params.id}`)
    //using decorator pattern for calling view
    const ori_send = resp.send
    resp.send = cb
    next()    
}

module.exports = endpointActor
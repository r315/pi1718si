'use strict'

const req = require('./requester.js')
let movieCache 
let actorCache 
let reqparm = {
    'Path' : '',
     'Id'  : ''
}


//let MovieDetails 

function getMovie(movieId){
    let innerMovie
    if(movieCache==undefined){
        movieCache = [] 
        innerMovie = movieCache
        .filter((elem) = elem.id == movieId)[0]
        if(innerMovie == null){ // validar se é null ou undfiend
            reqparm = {'movie':movieId}  
            innermovie = req.makeRequest(reqparm)
            movieCache.pusd(innerMovie)
        }
    return innerMovie
        /* request de um movie a web */
        /* recebe o movie e guarda na cache */
        /* crio um objecto to tipo moviedetails e crio  */
    }


}


function getActor(actorId){





}

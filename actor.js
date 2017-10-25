'use strict'

function actor() {
    this.name = null,
    this.id = null,
    this.biography = null,
    this.mov = []
    
}

function createActor (actorInfo, actorMovieCredit) {
    
        let obj = JSON.parse(actorInfo)
        let ac = new actor()
        ac.name = obj.name
        ac.id = obj.id
        ac.biography = obj.biography
        JSON.parse(actorMovieCredit).cast.forEach( function(elem) { 
            let mv =  new movie()
             mv.id = elem.id
             mv.title = elem.original_title
             mv.releaseDate = elem.release_date
             mv.voteAverage = elem.vote_average
             arrmov.push(this.mov)
         })
        return ac
        
}
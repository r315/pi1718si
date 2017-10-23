'use strict'

let actor = {
    name : null,
    id : null,
    character : null
}






function searchActorId(searchId){
    let innerActor =null
    if(isNaN(searchId)) {
           innerActor= actorCache.map(searchId)[0]
           if(innerActor == null ){
                // chamada a camada que vai fazer os pedidos a movie database
           }
            return innerActor
    }
        throw("Not a actor ID") //confirmar esta sintax 

}
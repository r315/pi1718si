'use strict'

module.exports=function castCrew() {
    this.name = null,
    this.id = null,
    this.character = null
    this.job = null
}

function createCast (castInfo) {
    
        let obj = JSON.parse(castInfo)
        let ac = new castCrew()
        ac.name = obj.name
        ac.id = obj.id
        ac.character = obj.character
        return ac
        
}

function createCrew (crewInfo) {
    
        let obj = JSON.parse(crewInfo)
        let ac = new castCrew()
        ac.name = obj.name
        ac.id = obj.id
        ac.job = obj.job
        return ac
        
}




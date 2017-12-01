'use strict'

//let favlist = require('./favlist')

function User() {
    this.name = null
    this.id = null
    this.docVersion = null
    this.favLists = []
    this.loggedIn = 0    
}

function createUser(name) {
    let user = new User()
    user.name = name
    return user
}

function createUserFromCB(username, userInfo) {
    
        let obj = JSON.parse(userInfo)
        let user = new User()
        user.name = obj.name
        user.id = obj._id
        user.docVersion = obj.docVersion
        user.status = false

       JSON.parse(obj.favLists).forEach(function(elem) { 
            let favlist = new favlist()
            favlist.id = elem.id
            favlist.name = elem.name
            user.favLists.push(favlist)
         })
       
        return user
        
}

module.exports = {
    'createUser' : createUser,
    'createUserFromCB' : createUserFromCB
}
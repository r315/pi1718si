'use strict'

const fs = require('fs')
let favlist = require('./favlist')

function user() {
    this.user = null,
    this.id = null,
    this.docVersion = null,
    this.favLists = []
    this.status = false
    
}

function createUser(name) {
    let user = new user()
    user.name = name
}

function createUserFromCB(userInfo) {
    
        let obj = JSON.parse(userInfo)
        let user = new user()
        user.name = obj.name
        user.id = obj.id
        user.docVersion = obj.docVersion
        user.status = false

       JSON.parse(FavLists[]).forEach(function(elem) { 
            let favlist = new favlist()
            favlist.id = elem.id
            favlist.name = elem.name
            user.favLists.push(favlist)
         })
       
        return user
        
}

module.exports = {
    'createUser' : createUser
}
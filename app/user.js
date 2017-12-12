'use strict'

let fl = require('./favlist')

function User() {
    this.name = null
    this.id = null
    this.docVersion = null
    this.favLists = []
    return this
}

User.prototype.password = ""
User.prototype.changePassword = changePassword
User.prototype.validatePassword = validatePassword

function changePassword(pass){
     this.password = pass
}

function validatePassword(secret){
    return secret == this.password
} 

function createUser(name) {
    let user = new User()
    user.name = name
    user.current_movie_id = ''
    return user
}

function createUserFromCB(username, userInfo) {
    
        let obj = JSON.parse(userInfo)
        let user = new User()
        user.name = obj.name
        user.id = obj._id
        user.docVersion = obj.docVersion
        user.status = false

       obj.favLists.forEach(function(elem) { 
            let favlist = fl.createfavList()
            favlist.id = elem.id
            favlist.name = elem.name
            user.favLists.push(favlist)
         })
       
        return user
        
}

module.exports = {
    'createUser' : createUser,
    'createUserFromCB' : createUserFromCB,
    'addProperties' : (user) => {
        user.changePassword = changePassword
        user.validatePassword = validatePassword
    }    
}
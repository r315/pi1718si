'use strict'

function User() {
    this.name = null
    this.id = null          
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
    return user
}

module.exports = {
    'createUser' : createUser,
    'addProperties' : (user) => {
        user.changePassword = changePassword
        user.validatePassword = validatePassword
    }    
}
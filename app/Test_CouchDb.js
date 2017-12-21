'use strict'

const couch = require('./CouchDb')


//createDocument({'id':'users'}, (error, doc) => { console.log(error ? error : doc)})
/*
let workinguser = {}
createUser(user, (error, cuser) => {
    workinguser = cuser
    console.log(error ? error : cuser)
    getUser(user.name,(error, cuser) => {    
        console.log(error ? error : cuser)
    })
})
*/
couch.createDb()

let user = {
    'name' : 'testuser', // no spaces are allowed
    'password' : '1234',
    'favLists' : []
}
couch.getUser(user.name,(error, cuser) => {
    cuser.favLists.push('meh')
    console.log(error ? error : cuser)
    couch.updateUser(cuser,(error, cuser) => 
    console.log(error ? error : cuser))
})



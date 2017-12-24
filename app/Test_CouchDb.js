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

let user = {
    'name' : 'testuser', // no spaces are allowed
    'password' : '1234',
    'favLists' : []
}

let list = {
    'id' : 0,
    'name' : 'The list'
}

let movie = {
    'id' : '12312',
    'name' : 'movie name'
}



function doTests(){
    /*
    couch.getUser(user.name,(error, cuser) => {
        console.log(error ? error : cuser)
        cuser.favLists.push(list)
        couch.updateUser(cuser,(error, cuser) => console.log(error ? error : cuser))
    })
    
    setTimeout(()=> { 
        couch.getMovie(movie.name,(error, cmovie) => {
            console.log(error ? error : cmovie)
        })
    }, 3)*/
    endTests()
}

function endTests(){
    couch.deleteUser(user, (error, cuser) => console.log(error ? error : cuser))
}

couch.createDb()


/*
couch.createUser(user, (error, cuser) =>{
    console.log(error ? error : cuser)    
    if(cuser.error){
        couch.getUser(user.name, (error, cuser) => {user = cuser; doTests()})
        return
    }    
    doTests()
})
*/


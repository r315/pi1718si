const usermodel = require('./user')


function searchByUser(username, cb){
    let user = usermodel.createUser(username)
    for ( let i = 0; i< 10; i++){
        user.favLists.push({
            'list_name' : 'Name ' + i,
            'list_id' : `${i}`
        })
    }    
    user.password = username
    cb(null,user)
}

function insertUser(user, cb){
    cb(null,null)
}

function insertfavlist(list, cb){
    let data = { 'id' : `${Math.floor(Math.random() * 100000) }` }
    cb(null,data)
}

function updatefavlist(listid, newitems, cb){
    movies = newitems
    cb(null,movies)
}

function searchbylistid(id, cb){    
    cb(null,movies)
}

let movies = []

const initM =  function(){
    for ( let i = 0; i< 10; i++){
        movies.push({
            'item_name' : 'Name ' + i,
            'item_id' : `${i}`
        })
    }
}

initM()

module.exports = {
    'searchByUser'  : searchByUser,
    'insertuser'    : insertUser,
    'updateUser'    : (obj, cb) => { cb({})/*Not implemented yet */}, //updateUser,
    'insertfavlist' : insertfavlist,
    'updatefavlist' : updatefavlist,
    'searchbylistid': searchbylistid
}
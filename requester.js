'use strict'

const server = require('./server_md')



function searchByMovie(searchTerm,callbackfunc){
    
        let reqparm={'path':'search','query':searchTerm,'response':(data)=> callbackfunc(data)}
        server.request(reqparm)
    
    }




module.exports = { 
    "searchByMovie" : searchByMovie
}

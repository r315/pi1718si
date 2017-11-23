'use strict'

let dbreq = require('http') 
const serveraddress = 'localhost'
const gport = 5984
const database ='coimadb'

const headerobj = {
    'Content-Type' : 'application/json',
    'Content-Length' : ''
}
let options = {
//    hostname : `http://${serveraddress}`,
    host : 'localhost',
    port : gport,
    path: `/${database}`,
    method:'',
    headers : ''

}



function reqFromDb(uri){
    let rawData =''
    
   dbreq.get(`http://${serveraddress}:${gport}/${uri}`,(res) => {
     
        res.setEncoding('utf8')
        console.log("Started")
       
        res.on('data',(chunk) => {rawData += chunk 
      
    })
        
        
       res.on('end',()  => {console.log(rawData)})
    })

    
    
    
}
    

function insertDocOnDb(indoc){
        
    
const headerobj = {
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(JSON.stringify(indoc))
}

        options.headers =headerobj
        options.method = 'POST'
   let post_req= dbreq.request(options,function(res){
       res.setEncoding('utf8');
       res.on('data',function(chunk){
           console.log('Response:',+chunk)
       })
   })

   post_req.write(JSON.stringify(indoc))

   post_req.end()

}


//reqFromDb("_all_dbs")
var sampleDoc ={
    "movie": "matrix",
    "date":  "2001", 
    "type": "movie"
}


insertDocOnDb(sampleDoc)
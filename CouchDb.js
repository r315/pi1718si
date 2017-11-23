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
    host : serveraddress,
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
    

function setupReq(body,type){
    const headerobj = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(JSON.stringify(body))
    }
    
            options.headers =headerobj
            options.method = type
       let post_req= dbreq.request(options,function(res){
           res.setEncoding('utf8');
           res.on('data',function(chunk){
               console.log('Response:',chunk)
               console.log('Status',`${res.statusCode}-${res.statusMessage}`)
           })
       })
       return post_req
}

function insertDocOnDb(indoc){
        
    
// const headerobj = {
//     'Content-Type' : 'application/json',
//     'Content-Length' : Buffer.byteLength(JSON.stringify(indoc))
// }

//         options.headers =headerobj
//         options.method = 'POST'
//    let post_req= dbreq.request(options,function(res){
//        res.setEncoding('utf8');
//        res.on('data',function(chunk){
//            console.log('Response:',+chunk)
//        })
//    })
    let post_reqi = setupReq(indoc,'POST')

   post_reqi.write(JSON.stringify(indoc))
   
   post_reqi.on('error', err =>{
    console.log("error on post to database",err.message)
})

    //post_reqi.on('close',console.log('Done'))
   post_reqi.end()
    
}


//reqFromDb("_all_dbs")
var sampleDoc ={
    "movie": "matrix",
    "date":  "2001", 
    "type": "movie"
}


insertDocOnDb(sampleDoc)
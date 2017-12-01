
'use strict'

let dbreq = require('http') 
const serveraddress = 'localhost'
const gport = 5984
const database ='coimadb'


    

function setupReq(reqparams){
   let respdata =""
    let options = {
        host : serveraddress,
        port : gport,
        path: `/${database}`,
        method:'',
        headers : ''
    
    }

    const headerobj = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(JSON.stringify(reqparams.body))
    }
    options.path = (reqparams.path ===undefined)?options.path : options.path+reqparams.path
    options.headers = headerobj
    options.method  = reqparams.type
    let post_req= dbreq.request(options
        ,function(res){
           res.setEncoding('utf8');
           res.on('data',function(chunk){
              // console.log('Response:',chunk)
              respdata +=chunk
               console.log('Status',`${res.statusCode}-${res.statusMessage}`)
           })
    
       })
       return post_req
}


function insertDocOnDb(indoc,cbf){
     let respdata =''
     let reqparams = {
         body : indoc,
         type : "POST"
     }
     
     let options = {
        host : serveraddress,
        port : gport,
        path: `/${database}`,
        method:'',
        headers : ''
    
    }

    const headerobj = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(JSON.stringify(reqparams.body))
    }
    options.path = (reqparams.path ===undefined)?options.path : options.path+reqparams.path
    options.headers = headerobj
    options.method  = reqparams.type
   let inner_req = dbreq.request(options
        ,function(res){
           res.setEncoding('utf8');
          res.on('data',function(chunk){
              respdata +=chunk
               console.log('Status',`${res.statusCode}-${res.statusMessage}`)
           })
         
           res.on('end',()=> cbf(JSON.parse(respdata).id))

        })
        inner_req.write(JSON.stringify(indoc))
        inner_req.end()
    
}


/*
function insertDocOnDb(indoc,cbf){
   // let respdata =''
    let reqparams = {
        body : indoc,
        type : "POST"
    }
    
    
    let post_reqi = setupReq(reqparams)
    post_reqi.write(JSON.stringify(indoc))
    post_reqi.on('error', err =>{
    console.log("error on post to database",err.message)
        })

   
    post_reqi.on('end',() => console.log(post_reqi.my_respdata))
    post_reqi.end()
   
}
 */
function getDocbyid(id){
    let rawData=''
    let reqparams = {
        body : "",
        type : "GET",
        path :`/_design/login/_view/byid?key="${id}"`
    }
     let options = {
        host : serveraddress,
        port : gport,
        path: `/${database}`,
        method:'',
        headers : ''
    }
    const headerobj = {
        'Content-Type' : 'application/json',
    }
    options.path = (reqparams.path ===undefined)?options.path : options.path+reqparams.path
    options.headers = headerobj
    dbreq.get(options,(res) => {
        res.setEncoding('utf8')
        console.log("Started")
        res.on('data',(chunk) => {rawData += chunk 
    })
       res.on('end',()  => {
           console.log(JSON.parse(rawData).rows[0].value)  
   
        })
    })
}

/**
 * Main function to search for items in teh database , internal module use in the database
 * @param {*} searchparam Parameter to be searched
 * @param {*} path Search path on the database
 * @param {*} cbf Callback function to be used when request is fully received from the database
 */
function getDoc(searchparam,path,cbf){
    let rawData=''
    let reqparams = {
        body : "",
        type : "GET",
        path :`${path}?key="${searchparam}"`
    }
     let options = {
        host : serveraddress,
        port : gport,
        path : `/${database}`,
        method :'',
        headers : ''
    }
    const headerobj = {
        'Content-Type' : 'application/json',
    }
    options.path = (reqparams.path ===undefined)?options.path : options.path+reqparams.path
    options.headers = headerobj
    dbreq.get(options,(res) => {
        res.setEncoding('utf8')
        console.log("Started")
        res.on('data',(chunk) => {rawData += chunk 
    })
       res.on('end',()  => {
         //  console.log(JSON.parse(rawData).rows[0].value)  
        cbf(rawData)
           
        })
    })
}


/**
 * Fuction used to search fro a user by name
 * @param {*} tocheckusername username to be searched
 * @param {*} cbf Callback function to be used when returning the data back
 * @param {*} obj option obj to be passed when necessary
 */
function searchbyusername(tocheckusername,cbf){

 getDoc(tocheckusername,"/_design/login/_view/byusername",cbf)

}


function inner_searchbyusername(user,cbf){
    if(JSON.parse(user).rows.length  == 0){
       console.log("no user")
    }else{
       cbf(JSON.parse(user).rows[0].value)
    }
}


/**
 * Internal function to validate internal data , before inserting the user
 * @param {*} user username to search
 * @param {*} cbf callback function to return back
 */
function inner_insertUser(data,user,cbf){
    if(JSON.parse(data).rows.length  == 1){
       console.log("user exists ") // devolvido erro 
    }else{
         insertDocOnDb(user,cbf)
    }
}


/**
 * external function to be used  when inserting a user
 * @param {*} userobj 
 * @param {*} cbf 
 */
function insertUser(userobj,cbf){
    searchbyusername(userobj.name,(data)=>inner_insertUser(data,userobj,cbf))

}



function outfunctest(sample){ 
    console.log(sample) 
} 

//preciso de saber o que procurar 
// se id ?  e nome 
//Sugestão de obj 
//{searchfield: "",searchvalue:"",[CBFN]}
function updateDocOnDB(id){
    console.log(getDocbyid(id))
}


var sampleDoc ={
    name: "rigoncal",
    passwd : "isel", 
    lists : "",
    type: "user"
}



//searchbyusername("rigoncal",outfunctest)
//insertDocOnDb(sampleDoc)
//getDocbyid("69314fa07586f554110474cfd300c1f9")
//updateDocOnDB("69314fa07586f554110474cfd300c1f9")
insertUser(sampleDoc,outfunctest)
module.exports = {
    'searchbyuser' : searchbyusername,
    'insertuser': insertUser
}
'use strict'

let dbreq = require('http') 
const serveraddress = 'localhost'
const gport = 5984
const database ='coimadb'


    

function setupReq(reqparams){

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
   let reqparams = {
        body : indoc,
        type : "POST"
    }
    
    
    let post_reqi = setupReq(reqparams)
    post_reqi.write(JSON.stringify(indoc))
    post_reqi.on('error', err =>{
    console.log("error on post to database",err.message)
        })

    
   post_reqi.end()
    
}


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
         cb(JSON.parse(rawData).rows[0].value)
   
        })
    })
}



function searchbyusername(tocheckusername,cbf){
    getDoc(tocheckusername,"/_design/login/_view/byusername",cbf)
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
    username: "hbarroca",
    passwd : "isel", 
    lists : "",
    type: "user"
}



checkusername("rigoncal",outfunctest)
//insertDocOnDb(sampleDoc)
//getDocbyid("69314fa07586f554110474cfd300c1f9")
//updateDocOnDB("69314fa07586f554110474cfd300c1f9")

module.exports = {
    'searchbyuser' : searchbyusername
}
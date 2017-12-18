

'use strict'
const logger = (msg) => {console.log('DBACCESS: ' + msg); return msg;}
let dbreq = require('http') 
const serveraddress = 'localhost'
const gport = 5984
const database ='coimadb'




 /**
  * internal function to the module to insert a document into the database 
  * @param {*} indoc document to be inserted 
  * @param {*} cbf callback function to be called when insertion is done 
  */
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
               console.log('DBACCESS: Status on insert:',`${res.statusCode}-${res.statusMessage}`)
           })
         
           res.on('end',()=> cbf(JSON.parse(respdata)))

        })
        inner_req.write(JSON.stringify(indoc))
        inner_req.end()
    
}

/**
 * Function to update documents on database internal use only
 * @param {*} indoc document to be updated
 * @param {*} cbf callback function to be called when update is concluded 
 */
function updateDoconDB(indoc,key,cbf){
    let parsedresponse =''
    //TODO:  correct this remove reqparams structure
    /*
    let reqparams = {
        body : indoc,
        type : "PUT"
    }
    */
    let respdata =''
    let options = {
       host : serveraddress,
       port : gport,
       path: `/${database}`,
       method:'',
       headers : ''
   
   }
   const headerobj = {
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(JSON.stringify(indoc))
    }

   // if indoc tem campo id , se n~ºao tiver não pode fazer o update
   options.path = options.path+`/${key}`
   options.headers = headerobj
   options.method = 'PUT'
   let inner_req = dbreq.request(options,
            function(res) {
                res.setEncoding('utf8')
                res.on('data',function(chunk){
                    respdata += chunk 
                   console.log('DBACCESS: Status on update',`${res.statusCode}-${res.statusMessage}`)
                })
                res.on('end', ()=> {
                    parsedresponse = JSON.parse(respdata)
                    if(parsedresponse.id == undefined){
                        cbf(parsedresponse,null)
                    }else{
                        cbf(null,parsedresponse)
                    }
                })
            })
     inner_req.write(JSON.stringify(indoc))
     inner_req.end()
        
}


function deleteDocOnDb(indoc,cbf){
    let respdata =''
    let reqparams = {
        body : indoc,
        type : 'DELETE'
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
   options.path = options.path+`/${indoc._id}?rev=${indoc._rev}`
   options.headers = headerobj
   options.method  = reqparams.type
  let inner_req = dbreq.request(options
       ,function(res){
          res.setEncoding('utf8');
         res.on('data',function(chunk){
             respdata +=chunk
              console.log('DBACCESS: Status on delete:',`${res.statusCode}-${res.statusMessage}`)
          })
        
          res.on('end',()=> cbf(JSON.parse(respdata)))

       })
       //inner_req.write(JSON.stringify(indoc))
       inner_req.end()
   
}

/**
 * Main function to search for items in teh database , internal module use in the database
 * @param {*} searchparam Parameter to be searched
 * @param {*} path Search path on the database
 * @param {*} cbf Callback function to be used when request is fully received from the database
 */
//function getDoc(searchparam,path,cbf){
function getDoc(searchparam,cbf){    
    let rawData=''
  /*
    let reqparams = {
        body : "",
        type : "GET",
        path :`${path}?key="${searchparam}"`
    }
    
    let reqparams = {
        body : "",
        type : "GET",
        path :`/${path}`
    }
    */
    let parsedresponse =''
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
    //options.path = (reqparams.path ===undefined)?options.path : options.path+reqparams.path
    options.path = `${options.path}/${searchparam}`
    options.headers = headerobj
    dbreq.get(options,(res) => {
        res.setEncoding('utf8')
        logger(" Request of get Started")
        res.on('data',(chunk) => {rawData += chunk 
        })
        res.on('end',()  => {
            parsedresponse = JSON.parse(rawData)
            if(parsedresponse._id == undefined){
                cbf(parsedresponse,null)
        }else{
                cbf(null,parsedresponse)
        }
        })
        
    })
}


/**
 * Fuction used to search for a user by name
 * @param {*} tocheckusername username to be searched
 * @param {*} cbf Callback function to be used when returning the data back
 * @param {*} obj option obj to be passed when necessary
 */
function searchbyusername(tocheckusername,cbf){

 getDoc(tocheckusername,cbf)

}



/**
 * Internal Function to module, to be used to validate if user exists on database 
 * @param {*} user object comming from database query 
 * @param {*} cbf callback function to be called after query terminated 
 */
function inner_searchbyusername(user,cbf){
    if(JSON.parse(user).rows.length  == 0){
       Logger('insert on database no user')
    }else{
       cbf(JSON.parse(user).rows[0].value)
    }
}


/**
 * fucntion used to search by user id instead of login 
 * @param {*} tocheckid id of the user to be searched 
 * @param {*} cbf call back fucntion to return 
 */
/*
function searchbyuserid(tocheckid,cbf){

    getDoc(tocheckid,'/_design/login/_view/byid',cbf)

}
**/
/**
 * internal funcntion to the module  searchbyuserid , cvalidates teh user and returns 
 * @param {*} userid userid that was being searched 
 * @param {*} cbf callback fucntion to return after finding the user
 */
function inner_searchbyuserid(userid,cbf){
    if(JSON.parse(user).rows.length  == 0){
       logger('searching by user :no user')
     }else{
        cbf(JSON.parse(user).rows[0].value)
     }
}

/**
 * Internal function to validate internal data , before inserting the user
 * @param {*} user username to search
 * @param {*} cbf callback function to return back
 */
/*
function inner_insertUser(data,user,cbf){
    if(JSON.parse(data).rows.length  == 1){
       logger('insert of user user exists') // devolvido erro 
    }else{
         user.type = "user"
         insertDocOnDb(user,cbf)
    }
}
*/

/**
 * internal function to the module update user to be used to validate after searching the user to update 
 * @param {*} data reveived data after query 
 * @param {*} user userobject to update 
 * @param {*} cbf callback function to return after the update is done 
 */
function inner_updateUser(error,data,user,cbf){
    if(data==null){
        logger ("ERROR on user update: user does not exist")
        cbf(error,null)
    }else{
        user._rev=data._rev
        user.type = "user"
        updateDoconDB(user,user.name,cbf)
    }
}


/**
 * external function to be used  when inserting a user
 * @param {*} userobj 
 * @param {*} cbf 
 */
function insertUser(userobj,cbf){
   // searchbyusername(userobj.name,(data)=>inner_insertUser(data,userobj,cbf))
   userobj.type = 'user'
    updateDoconDB(userobj,userobj.name,cbf)

}

/**
 * review
 * eternal function to be used when updating a user
 * @param {*} userobj user object to update  
 * @param {*} cbf callback function to be used 
 */
function updateUser(userobj,cbf){
    getDoc(userobj.name,(error,data)=>inner_updateUser(error,data,userobj,cbf))

}

/**
 * function to be used whe inserting a list of favorits to be associated to a user 
 * @param {*} listobj object that will be insert 
 * @param {*} cbf callback function that will be called after processing 
 */
function insertfavlist(listobj,cbf){
    listobj.type = "favlist"
    insertDocOnDb(listobj,cbf)
}

/**
 * Function to be used when searching by a list id 
 * @param {*} listid id of the list to be searched 
 * @param {*} cbf callback function
 */
function searchbylistid(listid,cbf){
    //getDoc(listid,'/_design/favlist/_view/byid',cbf)
    getDoc(listid,cbf)
}


/**
 * function to update a favorite list   
 * @param {*} listobj object to be updated already modified
 * @param {*} cbf call back funtion 
 */
function updatefavlist(listobj,cbf){
    getDoc(listobj.id,(error,data)=>inner_updatelist(error,data,listobj,cbf))
}

/**
 * internal fucntion used when updating a list of movies 
 * @param {*} data received list after searching for it , to update 
 * @param {*} list list object that is updated 
 * @param {*} cbf callback function when finished
 */
function inner_updatelist(error,data,list,cbf){
    if(data == null){
         logger ("ERROR on list update: list does not exist")
         cbf(error,null)
    }else{
        list._rev =data._rev
        list.type="favlist"
        updateDoconDB(list,list.id,cbf)
    }
}


/**
 * function to delete an user from the Database 
 * @param {*} userobj object of user to be deleted 
 * @param {*} cbf callback function
 */
function deleteUser(userobj,cbf){
      searchbyuserid(userobj.id,(data) => inner_deleteUser(data,userobj,cbf))
    
}

/**
 * internal fucntion to be used by the module when deleting and user
 * @param {*} data retreived user form database for delete 
 * @param {*} user user received from request to delete
 * @param {*} cbf callback function
 */
function inner_deleteUser(data,user,cbf){
        if(JSON.parse(data).rows.length == 0){
            logger ( "ERROR On user delete , user does not exist")
        }
        else{
            deleteDocOnDb(JSON.parse(data).rows[0].value,cbf)
        }
}
/**
 * Fucntion to delete a list form database 
 * @param {*} listid id of list to be deleted
 * @param {*} cbf 
 */
function deleteList(listid,cbf){
    searchbylistid(listobjid,(data)=> inner_deletelist(data,listid,cbf))
}

/**
 * internal fucntion  to delete favorite lists 
 * @param {*} data data received from the request if list exists 
 * @param {*} list list to be deleted 
 * @param {*} cbf callback fucntion
 */
function inner_deletelist(data,list,cbf){
    if(JSON.parse(data).rows.length == 0){
        logger ( "ERROR On list delete , list does not exist")
    }
    else{
        deleteDocOnDb(JSON.parse(data).rows[0].value,cbf)
    }
}


/**
 *  teste function to remove 
 * @param {*} sample 
 */
function outfunctest(error,sample){ 
    //console.log(`going through test FUNCTION callback: ${sample}`) 
    console.log('message:'+JSON.stringify(sample)) 
    console.log('ERROR:'+JSON.stringify(error))
} 



var sampleDocuser ={
    
    name: "potatohead",
    passwd : "dummy3", 
    lists : []
}


var sampleList ={
   id:"69314fa07586f554110474cfd30347d1",
    name: "Sci-fi",
    movies : [],
}

var tmovie = {
    title: "star wars ",
    id: 1
}

var movie2 = {
    title : "Rambo",
    id:2
}
sampleList.movies.push(tmovie)
sampleList.movies.push(movie2)
//deleteList(sampleList,outfunctest)
//deleteUser(sampleDocuser,outfunctest)
//insertfavlist(sampleList,outfunctest) T
//searchbylistid("69314fa07586f554110474cfd303392d",outfunctest)
//updatefavlist(sampleList,outfunctest) T
//searchbyusername('potatohead',outfunctest) T
//insertDocOnDb(sampleDoc) t
//getDocbyid("69314fa07586f554110474cfd300c1f9") to delete
//updateUser(sampleDocuser,outfunctest) missing test
//insertUser(sampleDocuser,outfunctest) t
module.exports = {
    'searchByUser'  : searchbyusername,
    'insertuser'    : insertUser,
    'updateUser'    : (obj, cb) => { cb({})/*Not implemented yet */}, //updateUser,
    'insertfavlist' : insertfavlist,
    'updatefavlist' : updatefavlist,
    'searchbylistid': searchbylistid

}
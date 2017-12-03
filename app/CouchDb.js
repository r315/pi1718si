
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
function updateDoconDB(indoc,cbf){
    let respdata =''
    //TODO:  correct this remove reqparams structure

    let reqparams = {
        body : indoc,
        type : "PUT"
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

   // if indoc tem campo id , se n~ºao tiver não pode fazer o update
   options.path = options.path+`/${indoc.id}`
   options.headers = headerobj
   options.method = reqparams.type
   let inner_req = dbreq.request(options,
            function(res) {
                res.setEncoding('utf8')
                res.on('data',function(chunk){
                    respdata += chunk 
                   console.log('DBACCESS: Status on update',`${res.statusCode}-${res.statusMessage}`)
                })
                res.on('end',()=> cbf(JSON.parse(respdata)))

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
        logger(" Request of get Started")
        res.on('data',(chunk) => {rawData += chunk 
    })
       res.on('end',()  => {
         //  console.log(JSON.parse(rawData).rows[0].value)  
        cbf(rawData)
           
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

 getDoc(tocheckusername,'/_design/login/_view/byusername',cbf)

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
function searchbyuserid(tocheckid,cbf){

    getDoc(tocheckid,'/_design/login/_view/byid',cbf)

}

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
function inner_insertUser(data,user,cbf){
    if(JSON.parse(data).rows.length  == 1){
       logger('insert of user user exists') // devolvido erro 
    }else{
         user.type = "user"
         insertDocOnDb(user,cbf)
    }
}


/**
 * internal function to the module update user to be used to validate after searching the user to update 
 * @param {*} data reveived data after query 
 * @param {*} user userobject to update 
 * @param {*} cbf callback function to return after the update is done 
 */
function inner_updateUser(data,user,cbf){
    if(JSON.parse(data).rows.length == 0){
        logger ("ERROR on user update: user does not exist")
    }else{
        user._rev=JSON.parse(data).rows[0].value._rev
        user.type = "user"
        updateDoconDB(user,cbf)
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

/**
 * eternal function to be used when updating a user
 * @param {*} userobj user object to update  
 * @param {*} cbf callback function to be used 
 */
function updateUser(userobj,cbf){
    searchbyuserid(userobj.id,(data)=>inner_updateUser(data,userobj,cbf))
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
    getDoc(listid,'/_design/favlist/_view/byid',cbf)
}


/**
 * function to update a favorite list   
 * @param {*} listobj object to be updated already modified
 * @param {*} cbf call back funtion 
 */
function updatefavlist(listobj,cbf){
    searchbylistid(listobj.id,(data)=>inner_updatelist(data,listobj,cbf))
}

/**
 * internal fucntion used when updating a list of movies 
 * @param {*} data received list after searching for it , to update 
 * @param {*} list list object that is updated 
 * @param {*} cbf callback function when finished
 */
function inner_updatelist(data,list,cbf){
    if(JSON.parse(data).rows.length == 0){
         logger ("ERROR on list update: list does not exist")
    }else{
        list._rev =JSON.parse(data).rows[0].value._rev
        list.type="favlist"
        updateDoconDB(list,cbf)
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
function outfunctest(sample){ 
    //console.log(`going through test FUNCTION callback: ${sample}`) 
    console.log(sample) 
} 


/*
var sampleDocuser ={
    id: "69314fa07586f554110474cfd302d7d6",
    name: "jhondoe2",
    passwd : "updated_passwd9", 
    lists : []
}


var sampleList ={
   id : "69314fa07586f554110474cfd302715a",
    name: "Sci-fi",
    movies : [],
}

var tmovie = {
    title: "nightmare ",
    id: 1
}
*/
//sampleList.movies.push(tmovie)
//deleteList(sampleList,outfunctest)
//deleteUser(sampleDocuser,outfunctest)
//insertfavlist(sampleList,outfunctest)
//searchbylistid("69314fa07586f554110474cfd302715a",outfunctest)
//updateList(sampleList,outfunctest)
//searchbyusername("rigoncal",outfunctest)
//insertDocOnDb(sampleDoc)
//getDocbyid("69314fa07586f554110474cfd300c1f9")
//updateUser(sampleDoc,outfunctest)
//insertUser(sampleDocuser,outfunctest)
module.exports = {
    'searchbyuser'  : searchbyusername,
    'searchbyuserid': searchbyuserid,
    'insertuser'    : insertUser,
    'updateUser'    : updateUser,
    'insertfavlist' : insertfavlist,
    'updatefavlist' : updatefavlist,
    'searchbylistid': searchbylistid

}
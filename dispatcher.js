'use strict'

const CACHE = require('./cache')
/*
TODO: 
imports dos modulos de criação para os endpoints necessarions 
*/


// function dispatcher(entry,value){

//         if(entry==="movies")
//             // chamada ao objecto movies  
//             console.log("not implemented")
//         if(entry === "search")
//             //chamada a funcção de movie .. com parametros de pesquisa == 
//             console.log("not implemented")
//         if(entry === "actors")

//          //chamada a funcção actor
//          console.log("not implemented")

// }

function dispatcher(entry){

    switch (entry[0]) {
        case '/search?q=':
            return CACHE.searchByMovie(entry[1])
        break
        
        case '/movies':

        break

        case '/actors':
        
        break
    }

}
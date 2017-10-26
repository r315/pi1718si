'use strict'

const CACHE = require('./cache')

let entry = []

/* Dispatche Assumes a two position array on entry */
//:TODO Check with Hugo R.

function dispatcher(entry){

    switch (entry[0]) {
        case '/search?q=':
            return CACHE.searchByMovie(entry[1])
        break
        
        case '/movies':
            return CACHE.searchMovieById(entry[1])
        break

        case '/actors':
            return CACHE.searchByActor(entry[1])
        break
    }

}
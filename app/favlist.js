'use strict'

const fs = require('fs')

function FavList() {    
    this.id = null,     // id is the index of the list inside user favList
    this.name = null
    this.movies = []    
}

function createFavList(name) {    
    let favList = new FavList()
    favList.name = name
    return favList
}

module.exports = {
    'create' : createFavList
}
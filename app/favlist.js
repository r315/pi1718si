'use strict'

const fs = require('fs')

function FavList() {
    
    this.id = null,
    this.name = null
    this.favorits = []
    
}

function createFavListFromDB(favList) {
    
    let obj = JSON.parse(favList)
    let fL = new FavList()
    fL.name = obj.name
    fL.id = obj.id
    
    return favList

}

function createFavList() {
    
    let favList = new FavList()
    return favList

}

module.exports = {
    'createfavList' : createFavList,
    'createfavListFromDB' : createFavList
}
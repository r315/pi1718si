'use strict'

const fs = require('fs')

function favList() {
    
    this.id = null,
    this.name = null
    
}

function createFavList(favList) {
    
    let obj = JSON.parse(favList)
    let favList = new favList()
    favList.name = obj.name
    favList.id = obj.id
    
    return favList

}

module.exports = {
    'createfavList' : createFavList
}
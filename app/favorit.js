'use strict'

const fs = require('fs')
let movie = require('./movie')

function favorit() {
    this.id = null,
    this.name = null,
    this.movies = []
    
}

function createFavorit(favoritInfo) {
    
        let obj = JSON.parse(favoritInfo)
        let favorit = new favorit()
        favorit.name = obj.name
        favvorit.id = obj.id
        
        JSON.parse(obj.movies[]).forEach(function(elem) { 
        let movie = new movie()
        movie.id = elem.id
        movie.name = elem.name
        favorit.movies.push(movie)
        })

        return favorit
        
}

module.exports = {
    'createFavorit' : createFavorit
}
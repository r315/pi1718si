let requester = require('./requester')

requester.searchByMovieId(550,
    function(movie){
        console.log(movie)
})

requester.searchByMovie('Movie Title', (result) => console.log(result))
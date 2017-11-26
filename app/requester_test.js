let requester = require('./requester')

//requester.searchByMovieId(550, function(movie){ console.log(movie) })

//requester.searchByMovie('Movie Title', (result) => console.log(result))


let url = requester.imageUrl('9nI9GsV1HZS3YKvMqrGuuEYWr8v.jpg')
console.log(url)


url = requester.imageUrl('9nI9GsV1HZS3YKvMqrGuuEYWr8v.jpg',0)
console.log(url)

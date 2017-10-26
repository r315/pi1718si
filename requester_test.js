let requester = require('./requester')

//requester.searchByMovieId(550, function(movie){ console.log(movie) })

//requester.searchByMovie('Movie Title', (result) => console.log(result))

requester.imageUrl('kqjL17yufvn9OVLyXYpvtyrFfak.jpg',3, (url) => console.log(url))
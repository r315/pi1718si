let server = require('./server_md')

server.init(8080)

//server.get('http://www.google.com', (data) => console.log(data))
//server.get(tmdb_movie_detail, (data) => console.log(data))

server.request({
    'path': 'movies',
    'id': 550,
    'response': (data) => console.log(data)
})

server.request({
    'path': 'actors',
    'id': 550,
    'response': (data) => console.log(data)
})

server.request({
    'path': 'search',
    'id': 550,
    'response': (data) => console.log(data),
    'query' : 'bolt'
})



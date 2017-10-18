

let server = require('./server_md')


server.init(8080)


server.get('http://www.google.com', (data) => console.log(data))
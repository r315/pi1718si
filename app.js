var server = require('./server_md')

const logger = (msg) => {console.log('App: ' + msg); return msg;}


logger('Application started!')
server.init(8080)
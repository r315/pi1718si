let server = require('./serverClient')

const logger = (msg) => {console.log('App: ' + msg); return msg;}


logger('Application started!')
server.init()
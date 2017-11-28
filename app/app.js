'use strict'

/**
 * Modules declaration, add new midlewares modules here
 */
let app = require('express')()
let home = require('./MidlewareHome')
let search = require('./MidlewareSearch')
let common = require('./MidlewareCommon')
let user = require('./MidlewareUser')
let login = require('./MidlewareLogin')
let cache = require('./cache')
const path = require('path')


const logger = (msg) => {console.log('App: ' + msg); return msg;}
const commandOut = (msg) => process.stdout.write(msg)
const prompt = 'COIMA > '

/**
 * Console commands
 */
const commands = {
    'quit' : function () {logger('Exiting...'); process.exit()},
    'help' : function() { console.log('\nhelp\tthis message\nquit\tquit application\n') }
}

/**
 * @param {stdin buffer} buffer 
 */
function commandInputHandler(buffer){    
    let cmd = commands[buffer.toString().split()[0].trim()]
    
    if(cmd == undefined){
        commandOut('Invalid command\n')        
    }else{
        cmd()
    }
    commandOut(prompt)
}

function startServer(port = 3000){
    logger('Application started!')  
    logger('Type \"help\" for available commands')  
    app.listen(port, () => logger(`Started on port ${port}`))
}

function setCookie(req, resp, next){
    
    res.cookie(cookie_name , 'cookie_value').send('Cookie is set');
    next()
}


/**
 * Add midlewares here
 */

// View engine setup
app.set('views', path.join(__dirname, '../templateviews'));
app.set('view engine', 'hbs');

app.use('/search', search)
app.use(['/movies', '/actors'], common)
app.use('/users', user)
app.get('/login', login)
app.get('/', home)
app.use(cache)

process.openStdin().addListener('data', commandInputHandler)
commandOut(prompt)
startServer(process.argv[2])



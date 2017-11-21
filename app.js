'use strict'

/**
 * Modules declaration, add new midlewares modules here
 */
let express = require('express')
let home = require('./MidlewareHome')
let search = require('./MidlewareSearch')
let common = require('./MidlewareCommon')
let user = require('./MidlewareUser')
//let dpt = require('./dispatcher_test')
let cache = require('./cache')

const logger = (msg) => {console.log('App: ' + msg); return msg;}
const commandOut = (msg) => process.stdout.write(msg)
const prompt = 'COIMA > '

/**
 * Console commands
 */
const commands = {
    'quit' : function () {server.close(); logger('Exiting...'); process.exit()},
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

/**
 * 
 */
function commandInputInit(){
    process.openStdin().addListener("data", commandInputHandler)
    commandOut(prompt)
}

let app = express()

/**
 * Add midlewares here
 */
app.get('/', home)
app.use('/search', search)
app.use(['/movies', '/actors'], common)
app.use('/user', user)
app.use(cache)


function start(port = 3000){
    logger('Application started!')    
    app.listen(3000, () => logger(`Started on port ${port}`))
}

commandInputInit()
start(process.argv[2])



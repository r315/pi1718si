'use strict'

let dispatcher = require('./dispatcher')
let express = require('express')
let cache = require('./cache')
let app = express()

const logger = (msg) => {console.log('App: ' + msg); return msg;}
const commandOut = (msg) => process.stdout.write(msg)
const prompt = 'COIMA > '

const commands = {
    'quit' : function () {server.close(); logger('Exiting...'); process.exit()},
    'help' : function(){ console.log('\nhelp\tthis message\nquit\tquit application\n') }
}

function commandInputHandler(buffer){    
    let cmd = commands[buffer.toString().split()[0].trim()]
    
    if(cmd == undefined){
        commandOut('Invalid command\n')        
    }else{
        cmd()
    }
    commandOut(prompt)
}

function commandInputInit(){
    process.openStdin().addListener("data", commandInputHandler)
    commandOut(prompt)
}


logger('Application started!')
app.get('/', (req, res) => dispatcher.createHomeView(req, res))
app.use('/search', (req, res, next) => dispatcher.searchRoute(req, res, next) )
app.use(['/movies','/actors'], (req, res, next) => dispatcher.commonRoute(req, res, next) )
//app.use((req, resp, next) => dispatcher.test(req, resp, next))
app.use((req, resp, next) => cache(req, resp, next))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
commandInputInit()



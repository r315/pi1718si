'use strict'

let dispatcher = require('./dispatcher')
let express = require('express')
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
    process.openStdin().addListener("data",commandInputHandler)
    commandOut(prompt)
}


logger('Application started!')
app.get('/', (req, resp) => dispatcher.createHomeView(req,resp))
//app.use('/cenas', (req, res, next) => {res.send('Hello from cenas'); next();} )
app.listen(3000, () => console.log('Example app listening on port 3000!'))
commandInputInit()
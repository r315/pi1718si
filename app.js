let server = require('./serverClient')

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
server.init(8080)
commandInputInit()
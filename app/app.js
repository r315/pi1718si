'use strict'

/**
 * Modules declaration, add new midlewares modules here
 */
const search = require('./MidlewareSearch')
const actor = require('./MidlewareActor')
const user = require('./MidlewareUser')
const login = require('./MidlewareLogin')
const movie = require('./MidlewareMovie')
const cache = require('./cache')
const app = require('express')()
const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')
const path = require('path')
const bodyparser = require('body-parser')
const couchdb = require('./CouchDb')

const logger = (msg) => {console.log('App: ' + msg); return msg;}
const commandOut = (msg) => process.stdout.write(msg)
const prompt = 'COIMA > '
const VIEWS_PATH = '../views'

/**
 * Console commands
 */
const commands = {
    'quit' : function () {logger('Exiting...'); process.exit()},
    'help' : function() { console.log(
                                        '\nhelp\tthis message',
                                        '\nquit\tquit application',
                                        '\ninitdb\t initialize couchdb'
                                    )},
    'initdb' : function() { console.log('Initialising database'); couchdb.initdb() }
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

function startServer(port){
    if(port === undefined){
        port = process.env.PORT
        if(port == undefined){
            port = 3000
        }
    }
    logger('Application started!')  
    logger('Type \"help\" for available commands')  
    app.listen(port, () => logger(`Started on port ${port}`))
}

/**
 * Initialyze view engine and midlewares
 */
app.set('views', path.join(__dirname, VIEWS_PATH))
app.set('view engine', 'hbs')
app.use(cookieParser())
app.use(session({
    secret: 'pi1718si',   
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyparser.urlencoded({ extended: false }))

/**
 * Add midlewares here
 */
app.use('/search', search)
app.use('/actors/:id', actor)
app.use('/movies/', movie)
app.use('/users', user)
app.use(['/login','/logout'], login)
app.get('/', (req, resp) => { 
    if(req.isAuthenticated()){
        resp.redirect(`/users/${req.user.name}`)
        return
    }
    resp.render('index') })
app.use(cache)

process.openStdin().addListener('data', commandInputHandler)
commandOut(prompt)
startServer(process.argv[2])
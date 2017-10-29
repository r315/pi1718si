let http = require('http')
let dispatcher = require('./dispatcher')

const logger = (msg) => {console.log('ServerClient: ' + msg); return msg;}


/*
on success the server has to request data to the dispatcher and this data could not 
be available immediatly, so as solution an object containing a callback is used as parameter
when calling the dispatcher

Handler for client requests
*/
function clientRequestsHandler(req, resp){    
    if(req.method == 'GET'){
        let wrapper= {}

        wrapper.url = req.url;
        wrapper.path = wrapper.url.split(/[/?]/).splice(1)       
        wrapper.req = req
        wrapper.resp = resp
        wrapper.response = function(respwrapper){
            if(respwrapper.error){
                //TODO: Set apropriated error
                respwrapper.resp.writeHead(respwrapper.error, {'Content-Type': 'text/html'})                
            }else{
                respwrapper.resp.writeHead(200, {'Content-Type': 'text/html'})
            } 
            respwrapper.resp.write(respwrapper.data); 
            respwrapper.resp.end();            
        }

        logger('Client Request ' + wrapper.url)
        dispatcher(wrapper)       
    }
}


function init(port = 8080){

    http.createServer( clientRequestsHandler ).listen(port)    
    logger(`Started on port ${port}`)    

}


module.exports = {
    'init' : init
}
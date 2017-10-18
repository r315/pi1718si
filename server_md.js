'use strict'

let http = require('http')


module.exports = {
    
    'init' : function (port){
        http.createServer(
            function (req, res) {
                res.write('Hello World!');  //write a response to the client
                res.end();                  //end the response
        }).listen(port);                    //the server object listens on port 8080 
    }
}
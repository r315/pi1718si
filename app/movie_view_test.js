let hb = require('handlebars')
let fs = require('fs')

const TEMPLATE_PATH = 'templateviews/movie.html'


module.exports = function(param){
    fs.readFile(TEMPLATE_PATH ,function(error,data){
        let source = data.toString()
        let template = hb.compile(source)
        let dataobj = { 
            'search_term' : 'Query: ...',
            'search_results': []
        }        
       
        param.data = template(dataobj)
        //fs.writeFile('templateviews/out.html',template(data));    
        param.response(param)
    })    
}

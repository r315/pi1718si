let hb = require('handlebars')
let fs = require('fs')

const RESULT_SIZE = 10
const TEMPLATE_PATH = 'templateviews/search.html'

module.exports = function(param){
    fs.readFile(TEMPLATE_PATH, function(error,data){
        let source = data.toString()
        let template = hb.compile(source)
        let dataobj = { 
            'search_term' : 'Query: ...',
            'search_results': []
        }
        
        for(let i = 0; i < RESULT_SIZE; i++){
            dataobj.search_results.push(
                {'result_index' : i+1, 'result_title': `Result ${i+1}`}
            )
        }
        param.data = template(dataobj)
        //fs.writeFile('templateviews/out.html',template(data));    
        param.response(param)
    })    
}

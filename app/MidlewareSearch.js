'use strict'

const logger = (msg) => {console.log('Midleware Search: ' + msg); return msg;}

/**
* Midleware for search endpoint
* /search?name={query}
* @param {*} req 
* @param {*} resp 
* @param {*} next 
*/
function searchRoute(req, resp, next){    
   let query = req.param('name')
   let page = req.param('page') 

   if(page == undefined || page <= 0 || isNaN(page))
       page = '1'
  
   req.coimapage = page
   req.coimarouter = req.baseUrl
   req.coimaterm = query   

    //using decorator pattern for calling view
    const ori_send = resp.send
    resp.send = function(searchresults){
        resp.send = ori_send
        let dataobj = { 
            'search_term' : req.coimaterm,
            'search_results': [],
            'search_previous_page' : `/search?name=${req.coimaterm}&page=${(req.coimapage > 1)? parseInt(req.coimapage) - 1: req.coimapage}` ,
            'search_next_page' :  `/search?name=${req.coimaterm}&page=${(req.coimapage < resp.coimatotalpages)? parseInt(req.coimapage) + 1: req.comimapage}`,
            'search_page' :  req.coimapage
        }

        searchresults.forEach( (mv, i) => {
            dataobj.search_results.push({
                'result_index' : i+1, 
                'result_title': mv.title,
                'result_link' : `/movies/${mv.id}`
            })
        })
        resp.render('search', dataobj)        
    }
   next()
}

module.exports = searchRoute
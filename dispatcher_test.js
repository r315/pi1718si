
let mock_search_results = []
function genMockResults(){
    for(let i = 0; i< 10 ; i++){
        mock_search_results.push(
            {
                'title': `Title ${i}`,
                'id' : `${i}`
            }
        )
    }
    return mock_search_results
}
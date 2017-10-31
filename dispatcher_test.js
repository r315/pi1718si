
module.exports = {
    'searchByMovie' : searchByMovie,
    'searchByMovieId': searchMovieById,
    'searchByActorID' : searchByActorID
}

function searchMovieById(wrapper){
    let mv =  {
        'title': `Title `,
        'id' : `23421`,
        'directordto' : [],
        'poster_url' : ' ',
        'castitemdto' : [
            {
                'name' : 'none',
                'id' : 321,
                'character': 'someone'
            }
        ]
    }       
    setTimeout(() => wrapper.response(wrapper, mv), 50)
}

function searchByMovie(wrapper){
    let mock_search_results = []
    for(let i = 0; i< 10 ; i++){
        mock_search_results.push(
            {
                'title': `Title ${i}`,
                'id' : `${i}`,
                'directordto' : [],
                'poster_url' : ' ',
                'castitemdto' : []
            }            
        )
    }
    wrapper.totalpage = 5
    setTimeout(() => wrapper.response(wrapper, mock_search_results), 50)
}

function searchByActorID(wrapper){
    let actor = {
        'name' : "Brad Pitt",
        'id' : 287,
        'biography' : "William Bradley \"Brad\" Pitt (born December 18, 1963) is an American actor and film producer. Pitt has received two Academy Award nominations and four Golden Globe Award nominations, winning one. He has been described as one of the world's most attractive men, a label for which he has received substantial media attention. Pitt began his acting career with television guest appearances, including a role on the CBS prime-time soap opera Dallas in 1987. He later gained recognition as the cowboy hitchhiker who seduces Geena Davis's character in the 1991 road movie Thelma &amp; Louise. Pitt's first leading roles in big-budget productions came with A River Runs Through It (1992) and Interview with the Vampire (1994). He was cast opposite Anthony Hopkins in the 1994 drama Legends of the Fall, which earned him his first Golden Globe nomination. In 1995 he gave critically acclaimed performances in the crime thriller Seven and the science fiction film 12 Monkeys, the latter securing him a Golden Globe Award for Best Supporting Actor and an Academy Award nomination.\n\nFour years later, in 1999, Pitt starred in the cult hit Fight Club. He then starred in the major international hit as Rusty Ryan in Ocean's Eleven (2001) and its sequels, Ocean's Twelve (2004) and Ocean's Thirteen (2007). His greatest commercial successes have been Troy (2004) and Mr. &amp; Mrs. Smith (2005).\n\nPitt received his second Academy Award nomination for his title role performance in the 2008 film The Curious Case of Benjamin Button. Following a high-profile relationship with actress Gwyneth Paltrow, Pitt was married to actress Jennifer Aniston for five years. Pitt lives with actress Angelina Jolie in a relationship that has generated wide publicity. He and Jolie have six children�Maddox, Pax, Zahara, Shiloh, Knox, and Vivienne.\n\nSince beginning his relationship with Jolie, he has become increasingly involved in social issues both in the United States and internationally. Pitt owns a production company named Plan B Entertainment, whose productions include the 2007 Academy Award winning Best Picture, The Departed.\n\nDescription above from the Wikipedia article Brad Pitt, licensed under CC-BY-SA, full list of contributors on Wikipedia.",
        'mov' : [            
                {
                  "character": "Tristan Ludlow",
                  "credit_id": "52fe43c4c3a36847f806e20d",
                  "release_date": "1994-12-16",
                  "vote_count": 568,
                  "video": false,
                  "adult": false,
                  "vote_average": 7.2,
                  "title": "Legends of the Fall",
                  "genre_ids": [
                    12,
                    18,
                    10749,
                    10752
                  ],
                  "original_language": "en",
                  "original_title": "Legends of the Fall",
                  "popularity": 2.356929,
                  "id": 4476,
                  "backdrop_path": "/jet7PQMY8aVzxBvkpG4P0eQI2n6.jpg",
                  "overview": "An epic tale of three brothers and their father living in the remote wilderness of 1900s USA and how their lives are affected by nature, history, war, and love.",
                  "poster_path": "/uh0sJcx3SLtclJSuKAXl6Tt6AV0.jpg"
                },
                {
                  "character": "Jesse James",
                  "credit_id": "52fe43c7c3a36847f806eed5",
                  "release_date": "2007-09-02",
                  "vote_count": 717,
                  "video": false,
                  "adult": false,
                  "vote_average": 7,
                  "title": "The Assassination of Jesse James by the Coward Robert Ford",
                  "genre_ids": [
                    28,
                    18,
                    37
                  ],
                  "original_language": "en",
                  "original_title": "The Assassination of Jesse James by the Coward Robert Ford",
                  "popularity": 3.294203,
                  "id": 4512,
                  "backdrop_path": "/zAh7HC8Tk2D0q3VdMOP6boqNG9N.jpg",
                  "overview": "Outlaw Jesse James is rumored be the 'fastest gun in the West'. An eager recruit into James' notorious gang, Robert Ford eventually grows jealous of the famed outlaw and, when Robert and his brother sense an opportunity to kill James, their murderous action elevates their target to near mythical status.",
                  "poster_path": "/lSFYLoaL4eW7Q5VQ7SZQP4EHRCt.jpg"
                }
        ]
    }
    setTimeout(() => wrapper.response(wrapper, actor), 50)
}
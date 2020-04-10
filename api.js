const got = require('got');
const queryString = require('query-string')


const API_KEY = '220eb6cc';
// const imdbID = 'tt0149460';


const getRatings = async (imdbID) => {
    try {

        const query = {
            apikey: API_KEY,
            i: imdbID,
            season: 1
        };

        let totalSeasons = 1;
        let mapSeasonEpiRating = {}

        if (totalSeasons == 1) {
            let response = await got('http://www.omdbapi.com/?' + queryString.stringify(query), {
                responseType: 'json',
                resolveBodyOnly: true
            });
            totalSeasons = response.totalSeasons
            mapSeasonEpiRating[1] = response.Episodes
            mapSeasonEpiRating.title = response.Title
        }

        console.log(totalSeasons)
        if(totalSeasons > 1) {
            let seasonNum = 2;
            while(seasonNum <= totalSeasons) {
                query.season = seasonNum;
                let url = 'http://www.omdbapi.com/?' + queryString.stringify(query);

                let response = await got(url, {
                    responseType: 'json',
                    resolveBodyOnly: true
                });
                mapSeasonEpiRating[seasonNum] = response.Episodes
                seasonNum++;
            }
        }

        console.log(mapSeasonEpiRating)

        return mapSeasonEpiRating
        //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
}

module.exports = {getRatings};
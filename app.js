const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const path = require('path')
const mongodb = require('./mongodb')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.post('/', async (req, res) => {
    let imdbID = req.body.imdbID
    console.log(imdbID)

        const show = await mongodb.getRatings(imdbID)
        
        if(show.error) {
            res.json(show)
        }

        let title = show.title;
        let series = [];
        let seasons = [];
        let maxEpisodeCount;

        // Group by Episode Num then sort by Season Num
        let episodeBuckets = _.groupBy(show.episodes, 'episodeNum');

        _.each(episodeBuckets, (episodeBucket, indx) => {
            let sortedEpisodeBucket = _.sortBy(episodeBucket, 'seasonNum')
            // console.log(JSON.stringify(sortedEpisodeBucket))
            maxEpisodeCount = sortedEpisodeBucket.length;

            let epiDispName = (indx < 10 ? 'E0' + indx : 'E' + indx)
            let seriesObj = {
                name: epiDispName,
                data: []
            }

            _.each(sortedEpisodeBucket, (epiObj) => {

                let seasonNum = epiObj.seasonNum;
                while (seriesObj.data.length < seasonNum - 1) {
                    seriesObj.data.push({
                        x: '',
                        y: null,
                        title: ''
                    })
                }

                seriesObj.data.push({
                    x: epiObj.seasonNum.toString(),
                    y: epiObj.rating,
                    title: epiObj.title
                })
            })

            series.unshift(seriesObj)

        })

        // console.log(JSON.stringify(series))

        _.each(show.episodes, (epi) => {
            let season = epi.seasonNum;
            seasons.push(season)
        })

        // Compute Season Labels for X axis
        let numSeason = Math.max(...seasons)
        let categories = [];
        while (numSeason > 0) {
            let prefix = (numSeason < 10 ? 'S0' : 'S')
            categories.unshift(prefix + numSeason)
            numSeason--
        }



        // Compute chart height and width
        let height = 750;
        let width = 500;
        let maxCategories = categories.length;
        if(maxCategories < 4){
            width = 120
        } else if (maxCategories >= 15 && maxCategories <= 20) {
            width = 600
        } else if (maxCategories > 20 && maxCategories <= 30) {
            width = 700;
        } else if (maxCategories > 30) {
            width = 900;
        }

        if (maxEpisodeCount >= 30) {
            height = 850
        }

        let payload = {
            title,
            categories,
            series,
            width,
            height
        }

        res.send(JSON.stringify(payload))

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
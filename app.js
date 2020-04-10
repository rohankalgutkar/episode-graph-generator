const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
// const futurama = require('./futurama')
const path = require('path')
const mongodb = require('./mongodb')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'))
})

// app.get('/', (req, res) => {

//     let title = futurama.title;
//     let series = [];
//     let seasons = [];

//     // Group by Episode Num then sort by Season Num
//     let episodeBuckets = _.groupBy(futurama.episodes, 'episodeNum');

//     _.each(episodeBuckets, (episodeBucket, indx) => {
//         let sortedEpisodeBucket = _.sortBy(episodeBucket, 'seasonNum')
//         //sortedEpisodeBuckets[indx] = sortedEpisodeBucket;

//         let epiDispName = (indx < 10 ? 'E0' + indx : 'E' + indx)
//         let seriesObj = {
//             name: epiDispName,
//             data: []
//         }
//         _.each(sortedEpisodeBucket, (epiObj) => {
//             seriesObj.data.push({
//                 x: epiObj.seasonNum.toString(),
//                 y: epiObj.rating,
//                 title: epiObj.title
//             })
//         })

//         series.unshift(seriesObj)

//     })





//     _.each(futurama.episodes, (epi) => {
//         let season = epi.seasonNum;
//         seasons.push(season)
//     })



//     // Compute Season Labels for X axis
//     let numSeason = Math.max(...seasons)
//     let catagories = [];
//     while (numSeason > 0) {
//         let prefix = (numSeason < 10 ? 'S0' : 'S')
//         catagories.unshift(prefix + numSeason)
//         numSeason--
//     }

//     let payload = {
//         catagories,
//         series
//     }

//     res.send(JSON.stringify(payload))

//     // res.sendFile(path.join(__dirname+'/index.html'))
// })

app.post('/', async (req, res) => {
    let imdbID = req.body.imdbID
    console.log(imdbID)

    const show = await mongodb.getRatings(imdbID)


    let title = show.title;
    let series = [];
    let seasons = [];

    // Group by Episode Num then sort by Season Num
    let episodeBuckets = _.groupBy(show.episodes, 'episodeNum');

    _.each(episodeBuckets, (episodeBucket, indx) => {
        let sortedEpisodeBucket = _.sortBy(episodeBucket, 'seasonNum')
        //sortedEpisodeBuckets[indx] = sortedEpisodeBucket;

        let epiDispName = (indx < 10 ? 'E0' + indx : 'E' + indx)
        let seriesObj = {
            name: epiDispName,
            data: []
        }
        _.each(sortedEpisodeBucket, (epiObj) => {
            seriesObj.data.push({
                x: epiObj.seasonNum.toString(),
                y: epiObj.rating,
                title: epiObj.title
            })
        })

        series.unshift(seriesObj)

    })





    _.each(show.episodes, (epi) => {
        let season = epi.seasonNum;
        seasons.push(season)
    })



    // Compute Season Labels for X axis
    let numSeason = Math.max(...seasons)
    let catagories = [];
    while (numSeason > 0) {
        let prefix = (numSeason < 10 ? 'S0' : 'S')
        catagories.unshift(prefix + numSeason)
        numSeason--
    }

    let payload = {
        title,
        catagories,
        series
    }

    res.send(JSON.stringify(payload))

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
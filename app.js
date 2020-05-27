const express = require('express')
const bodyParser = require('body-parser')

const path = require('path')
const wakeDyno = require("woke-dyno");

const mongodb = require('./mongodb')
const utils = require('./utils')

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
    try {
        let imdbID = req.body.imdbID
        console.log(imdbID)

        const show = await mongodb.getRatings(imdbID)

        if (show.error) {
            res.json(show)
            return 
        }

        let payload = utils.createChartConfig(show)        

        res.json(payload)
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => {
    // wakeDyno('https://episode-graph-generator.herokuapp.com/').start()
    console.log(`EGG is running on port ${port}`)
})
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'imdb';

const getRatings = async (showID) => {
    const client = await MongoClient.connect(connectionURL, {
            useUnifiedTopology: true
        })
        .catch(err => {
            console.log(err);
        });

    if (!client) {
        return;
    }

    try {
        const db = client.db(dbName)
        const show = await db.collection('show-master').findOne({
            showID
        })

        // console.log('Show: ' + JSON.stringify(show))

        // Get actual ratings

        const episodes = await db.collection('episode-master').find({
            showID
        }).toArray();
        // console.log(episodes)

        show.episodes = episodes;

        return show
    } catch (e) {
        console.log(e);
    } finally {
        client.close();
    }

}

module.exports = {
    getRatings
}
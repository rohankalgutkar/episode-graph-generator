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

    // Validation for DB connection
    if (!client) {
        return {
            error: true,
            msg: "There's an issue with the service, please try again later!"
        };
    }

    try {
        const db = client.db(dbName)

        // Get show title
        const show = await db.collection('show-master').findOne({showID});

        // Validation for show ID not found
        if(!show) {
            return {
                error: true,
                msg: "Please enter a valid Show ID!"
            };
        }

        const episodes = await db.collection('episode-master').find({
            showID: show.showID
        }).toArray();

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
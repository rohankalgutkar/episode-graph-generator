const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient


const connectionURL = process.env.MongoDB_URI || 'mongodb://127.0.0.1:27017/epi-grph-gen';
// console.log('connection URL ' + connectionURL)
const dbName = 'epi-grph-gen';

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
        // const db = client;

        // Get show title
        const show = await db.collection('show-master').findOne({
            showID
        });

        // Validation for show ID not found
        if (!show) {
            return {
                error: true,
                msg: "Please enter a valid IMDb URL!"
            };
        }

        const episodes = await db.collection('episode-master').find({
            showID: show.showID
        }).toArray();

        if(episodes.length == 0) {
            return {
                error: true,
                msg: "Episodes not found for " + show.title + "!"
            }
        }

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
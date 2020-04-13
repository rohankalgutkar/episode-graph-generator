const _ = require('lodash')

const createChartConfig = (show) => {

    // Compute chart series data
    let {
        series,
        maxEpisodeCount
    } = computeChartSeries(show.episodes)

    // Compute Season Labels for X axis
    let categories = computeCategoriesArr(show.episodes)

    // Compute chart height and width
    let {
        height,
        width
    } = computeChartDimentions(categories.length, maxEpisodeCount)

    return payload = {
        title: show.title,
        categories,
        series,
        width,
        height
    }
}

const computeChartSeries = (episodes) => {
    let series = [];
    let maxEpisodeCount;

    // Group by Episode Num then sort by Season Num
    let episodeBuckets = _.groupBy(episodes, 'episodeNum');

    _.each(episodeBuckets, (episodeBucket, indx) => {
        let sortedEpisodeBucket = _.sortBy(episodeBucket, 'seasonNum')
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

    return {
        series,
        maxEpisodeCount
    }
}

const computeCategoriesArr = (episodes) => {
    let seasons = [];

    _.each(episodes, (epi) => {
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

    return categories;
}

const computeChartDimentions = (maxCategories, maxEpisodeCount) => {
    let height = 750;
    let width = 500;
    if (maxCategories > 0 && maxCategories <= 2) {
        width = 150
    } else if (maxCategories >= 3 && maxCategories <= 4) {
        width = 400
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

    return {
        height,
        width
    }
}

module.exports = {
    createChartConfig
}
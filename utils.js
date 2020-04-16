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
        width,
        boolHideLegend
    } = computeChartDimentions(categories.length, maxEpisodeCount)

    return payload = {
        title: show.title,
        categories,
        series,
        width,
        height,
        boolHideLegend
    }
}

const computeChartSeries = (episodes) => {
    let series = [];

    //clean-up episodes without epiNum or seasNum
    let cleanedUpData = episodes.filter((ep) => {
        if(typeof ep.episodeNum == 'number' && typeof ep.seasonNum == 'number')
            return ep
    })

    // Group by Episode Num then sort by Season Num
    let episodeBuckets = _.groupBy(cleanedUpData, 'episodeNum');

    _.each(episodeBuckets, (episodeBucket, indx) => {

        let sortedEpisodeBucket = _.sortBy(episodeBucket, 'seasonNum')

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
        maxEpisodeCount: series.length
    }
}

const computeCategoriesArr = (episodes) => {

    let seasons = [];

    _.each(episodes, (epi) => {
        let season = epi.seasonNum;

        if (epi.seasonNum != '\\N' && epi.episodeNum != '\\N')
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
    let height = 150;
    let width = 100;
    let boolHideLegend = false;

    if (maxCategories <= 4) {
        boolHideLegend = true
    }
    width = (width + (maxCategories * 50))
    height = (height + (maxEpisodeCount * 50))

    width = (width > 900) ? 900 : width
    height = (height > 800) ? 800 : height

    return {
        height,
        width,
        boolHideLegend
    }
}

module.exports = {
    createChartConfig
}
const form = document.querySelector('form');
const homeBtn = document.getElementById('takeHome');
const errNoteDiv = document.getElementById('error-note')
const errNote = document.getElementById('err-note')
const loadingAnimation = document.getElementById('loadingAnimation')
const home = document.getElementById("home");
const chartContent = document.querySelector("#graph");

var chart;

const showComponent = (comp) => {
    comp.style.display = "block"
    comp.classList.add('fadeInDown')
}

const hideComponent = (comp) => {
    comp.classList.remove('fadeInDown')
    comp.style.display = "none"
}

const takeHome = homeBtn.addEventListener('click', (event) => {
    showComponent(home, 200)
    hideComponent(chartContent)
    chart.destroy()
})

const getTitleCodeFromURL = (imdbCode) => {

    if (imdbCode.length == 9){
        return imdbCode
    }
    let imdbID = imdbCode.substr(imdbCode.search(/title\/tt/i)+6, 9);
    return imdbID == -1 ? '' : imdbID
    
}

const formEvent = form.addEventListener('submit', async event => {
    event.preventDefault();
    
    const imdbCode = document.querySelector('#imdbID').value;
    // console.log('imdbCode: ' + imdbCode)
    if (imdbCode != '') {
        let imdbID = getTitleCodeFromURL(imdbCode);

        errNote.innerHTML = 'Loading...'
        errNoteDiv.classList.remove('hidden')
        loadingAnimation.classList.remove('hidden')

        // Clear the form
        document.querySelector('#imdbID').value = '';
        //Get form data
        const options = {
            imdbID
        };
        const showData = await axios.post('/', options);
        const showDataBody = showData.data;

        // Validate response
        if (showDataBody.error) {
            errNote.innerHTML = showDataBody.msg
            errNoteDiv.classList.remove('hidden')
            loadingAnimation.classList.add('hidden')
            setTimeout(() => {
                errNoteDiv.classList.add('hidden')
            }, 2500)
            return;
        }

        // Hide Home contents
        hideComponent(home, 300)

        // Show chart contents
        chartContent.style.display = "block";
        // chartContent.classList.remove('fadeOutUp')
        chartContent.classList.add('fadeInDown')

        // showComponent(chartContent, 0)

        let conf = Object.assign({}, chartConfig);

        conf.series = showDataBody.series;
        conf.title.text = showDataBody.title;
        conf.xaxis.categories = showDataBody.categories;
        conf.chart.height = showDataBody.height;
        conf.chart.width = showDataBody.width;

        // Create Chart
        chart = new ApexCharts(document.querySelector("#chart"), conf);
        errNote.innerHTML = 'Please enter a valid IMDb URL!';
        errNoteDiv.classList.add('hidden')
        loadingAnimation.classList.add('hidden')
        chart.render();
    } else {
        errNoteDiv.classList.remove('hidden')
        setTimeout(() => {
            errNoteDiv.classList.add('hidden')
        }, 2500)
    }

});

const chartConfig = {
    series: [],
    grid: {
        show: false
    },
    chart: {
        height: 700,
        width: 400,
        type: 'heatmap',
        toolbar: {
            show: true
        }
    },
    plotOptions: {
        heatmap: {
            radius: 0,
            useFillColorAsStroke: false,
            colorScale: {
                ranges: [{
                        from: 0.1,
                        to: 6,
                        name: 'Garbage',
                        color: '#EA9999'
                    }, {
                        from: 6.1,
                        to: 6.9,
                        name: 'Bad',
                        color: '#FCDF99'
                    },
                    {
                        from: 7,
                        to: 7.9,
                        name: 'Average',
                        color: '#ECDF93'
                    },
                    {
                        from: 8,
                        to: 8.9,
                        name: 'Good',
                        color: '#B5D37F'
                    },
                    {
                        from: 9,
                        to: 10,
                        name: 'Great',
                        color: '#60BD60'
                    }
                ]
            }
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: ["#808080"]
        }
    },
    stroke: {
        width: 1
    },
    title: {
        text: '',
        align: "center"
    },
    xaxis: {
        type: 'category',
        categories: [],
        position: "top"
    },
    legend: {
        show: true
    },
    tooltip: {
        y: {
            formatter: function (value, {
                series,
                seriesIndex,
                dataPointIndex,
                w
            }) {
                if (value == null) {
                    return 'NA'
                }
                let title = w.globals.initialSeries[seriesIndex].data[dataPointIndex].title;
                return title + " (" + value + ")"
            }
        }
    }
};
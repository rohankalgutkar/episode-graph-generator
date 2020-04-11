const form = document.querySelector('form');
const homeBtn = document.getElementById('takeHome');
const errNote = document.getElementById('error-note')
const home = document.getElementById("home");
const chartContent = document.querySelector("#graph");

var chart;

const showComponent = (comp, timeout) => {
    setTimeout(function () {
        comp.style.display = "inline-block"
    }, timeout);
    comp.classList.remove('fadeOutUp');
    comp.classList.add('fadeInDown')
}

const hideComponent = (comp, timeout) => {
    comp.classList.remove('fadeInDown')
    comp.classList.add('fadeOutUp')
    setTimeout(function () {
        comp.style.display = "none"
    }, timeout);
    
}

const takeHome = homeBtn.addEventListener('click', (event) => {
    // setTimeout(function () {
    //     home.style.display = "inline-block"
    // }, 200);
    // home.classList.remove('fadeOutUp');
    // home.classList.add('fadeInDown')

    // chartContent.classList.remove('fadeInDown')
    // chartContent.classList.add('fadeOutUp')
    // setTimeout(function () {
    //     chartContent.style.display = "none"
    // }, 300);
    showComponent(home, 200)
    hideComponent(chartContent, 300)
    chart.destroy()
})

const formEvent = form.addEventListener('submit', async event => {
    event.preventDefault();

    const imdbID = document.querySelector('#imdbID').value;
    console.log('imdbID: ' + imdbID)
    if (imdbID != '') {
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
            errNote.value = showDataBody.msg
            errNote.classList.remove('hidden')
            return;
        }

        // Hide Home contents
        // home.classList.remove('fadeInDown');
        // home.classList.add('fadeOutUp');
        // setTimeout(function () {
        //     home.style.display = "none"
        // }, 500);

        hideComponent(home, 300)

        // Show chart contents
        chartContent.style.display = "inline";
        chartContent.classList.remove('fadeOutUp')
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
        chart.render();
    } else {
        
        errNote.classList.remove('hidden')
        setTimeout(() => {
            errNote.classList.add('hidden')
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
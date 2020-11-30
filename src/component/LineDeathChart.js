import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';
import { Typography } from '@material-ui/core';
import numeral from 'numeral'
import axios from './../config/axios'
import apiEndPoints from './../config/apiEndPoints'

function LineDeathChart() {

    const [data, setData] = useState();

    const options = {
        legend: {
            display: false,
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        maintainAspectRatio: true,
        tooltips: {
            mode: "index",
            intersect: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    return numeral(tooltipItem.value).format("+0,0");
                },
            },
        },
        scales: {
            xAxes: [
                {
                    type: "time",
                    time: {
                        format: "MM/DD/YY",
                        tooltipFormat: "ll",
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return numeral(value).format("0a");
                        },
                    },
                },
            ],
        },
    };

    //common useEffect
    useEffect(() => {
        async function fetchData() {
            try {
                const resposnse = await axios.get(apiEndPoints.lastDaysUrl);
                if (resposnse.status === 200) {
                    const chartData = buildChartData(resposnse.data, 'deaths')
                    setData(chartData);
                } else {
                    console.log(resposnse);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);


    const buildChartData = (data, casesType = 'cases') => {
        let chartData = [];
        let lastDataPoint;
        console.log(data.cases)
        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint,
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };

    return (
        <div className="line__chart">
            <Typography className="linechart__header">Worldwide Daily Deaths</Typography>
            <Line
                height="200"
                data={
                    {
                        datasets: [
                            {
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data,
                            },
                        ],
                    }
                }
                options={options}
            />
        </div>
    )
}

export default LineDeathChart

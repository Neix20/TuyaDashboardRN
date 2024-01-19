option = {
    animation: false,
    legend: {
        data: [ "Temperature", "Humidity", "Carbon Dioxide" ],
        orient: 'horizontal',
        top: 'bottom'
    },
    xAxis: {
        type: "time",
        axisLabel: {
            formatter: '{HH}:{mm}',
            rotate: 45,
            showMinLabel: true,
            showMaxLabel: true
        },
        hideOverlap: true,
        animation: false,
        axisPointer: {
            snap: true,
            lineStyle: {
                color: '#7581BD',
                width: 2
            },
            label: {
                show: true,
                backgroundColor: '#7581BD'
            },
            handle: {
                show: true,
                color: '#7581BD',
                size: [48, 48]
            },
            zlevel: 0,
        },
        boundaryGap: false,
    },
    yAxis: {
        type: 'value',
        renderMode: "richText",
        min: (val) => {
            return Math.floor(val.min * 0.9);
        },
        max: (val) => {
            return Math.ceil(val.max * 1.1);
        }
    },
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0]
        }
    ],
    grid: {
        top: 10,
        bottom: 60,
        left: 5,
        right: 5,
        containLabel: true,
    },
    series: [
        
        { 
            name: "Temperature", 
            data:  [
                [ 1701255600000, 13 ],
                [ 1701257400000, 15 ],
                [ 1701259200000, 18 ],
                [ 1701261000000, 5 ],
                [ 1701262800000, 12 ]
            ],
            type: "line", symbol: "circle", symbolSize: 5,
            markArea: {
                itemStyle: {
                    color: 'rgba(255, 173, 177, 0.4)'
                },
                data: [
                    [
                        {
                            name: "Comfort Zone",
                            yAxis: 10
                        },
                        {
                            yAxis: 15
                        }
                    ],
                ]
            }
        },
        { 
            name: "Humidity", 
            data:  [
                [ 1701255600000, 9 ],
                [ 1701257400000, 6 ],
                [ 1701259200000, 14 ],
                [ 1701261000000, 11 ],
                [ 1701262800000, 7 ]
            ],
            type: "line", symbol: "circle", symbolSize: 5
        },
        { 
            name: "Carbon Dioxide", 
            data:  [
                [ 1701255600000, 20 ],
                [ 1701257400000, 6 ],
                [ 1701259200000, 13 ],
                [ 1701261000000, 20 ],
                [ 1701262800000, 17 ]
            ],
            type: "line", symbol: "circle", symbolSize: 5
        }
    ]
}
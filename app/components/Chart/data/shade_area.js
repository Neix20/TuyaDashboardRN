option = {
    title: {
        text: 'Temperature & Humidity'
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Union Ads',
            type: 'line',
            data: [20, 21, 10, 20, 29, 18, 5],
            markArea: {
                itemStyle: {
                    color: 'rgba(255, 173, 177, 0.4)'
                },
                data: [
                    [
                        {
                            name: 'Morning Peak',
                            yAxis: 15
                        },
                        {
                            yAxis: 20
                        }
                    ],
                ]
            }
        },

    ]
};
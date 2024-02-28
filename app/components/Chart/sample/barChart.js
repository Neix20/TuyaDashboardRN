option = {
    tooltip: {
        show: true,
        trigger: 'axis',
        renderMode: "richText",
        textStyle: {
            color: "rgba(0, 0, 0, 1)",
        },
        backgroundColor: "rgba(255, 255, 255, 1)",
    },
    legend: {
        data: [ "B8 Study LG Monitor Smart Plug", "B8 Study LG Monitor Smart Plug II" ],
        orient: 'horizontal',
        bottom: 0,
    },
    xAxis: {
        type: "category",
        data: [ "10-20", "10-21", "10-22", "10-23", "10-24", "10-25", "10-26" ],
        axisLabel: {
            rotate: 45,
            showMinLabel: true,
            showMaxLabel: true
        },
        axisPointer: {
            snap: true,
            lineStyle: {
                color: '#7581BD',
                width: 2
            },
            label: {
                show: true,
                formatter: function (params) {
                    return params.value;
                },
                backgroundColor: '#7581BD'
            },
            handle: {
                show: true,
                color: '#7581BD',
                size: [48, 48]
            },
            zlevel: 0,
        }
    },
    yAxis: {
        type: 'value',
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
        left: 5,
        right: 5,
        bottom: 60,
        containLabel: true,
    },
    series: [
        {
            "name": "B8 Study LG Monitor Smart Plug",
            "data": [ 0.3, 0.66, 0.84, 1.24, 0.46, 0, 1.01 ],
            "type": "bar"
        },
        {
            "name": "B8 Study LG Monitor Smart Plug II",
            "data": [ 0.53, 0.55, 0.76, 0.97, 0.34, 0.41, 0.86 ],
            "type": "bar"
        }
    ]
};
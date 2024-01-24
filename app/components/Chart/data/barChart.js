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
        data: ["Total KiloWatt (KWh)"],
        orient: 'horizontal',
        bottom: 0,
    },
    xAxis: {
        type: "category",
        axisLabel: {
            rotate: 45,
            showMinLabel: true,
            showMaxLabel: true
        },
        data: [ "10-20", "10-21", "10-22", "10-23", "10-24", "10-25", "10-26" ],
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
            "name": "Total KiloWatt (KWh)",
            "data": [7.9, 7.27, 7.44, 7.77, 7.43, 7.54, 4.24],
            "type": "bar"
        }
    ]
}
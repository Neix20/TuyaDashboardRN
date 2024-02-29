let option = {};
option = {
    tooltip: {
        show: true,
        trigger: "axis",
        renderMode: "richText",
        textStyle: {
            color: "rgba(0, 0, 0, 1)",
        },
        backgroundColor: "rgba(255, 255, 255, 1)",
    },
    legend: {
        data: [ "0-200", "201-500", "501++" ],
        orient: 'horizontal',
        bottom: 0,
    },
    xAxis: {
        type: "category",
        data: [ "01-18", "01-19", "01-20", "01-21", "01-22", "01-23", "01-24" ],
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
            label: { show: true, formatter: function (params) { return params.value; }, backgroundColor: '#7581BD' },
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
        renderMode: "richText",
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
            "data": [
                {
                    "value": 50,
                    "itemStyle": { "borderRadius": [ 20, 20, 0, 0 ] },
                    "label": { "show": true, "position": "top", "formatter": "RM 21.75" }
                },
                {
                    "value": 10,
                    "itemStyle": { "borderRadius": [ 20, 20, 0, 0 ] },
                    "label": { "show": true, "position": "top", "formatter": "RM 4.35" }
                },
                {
                    "value": 200,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 200,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 200,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 50,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                }
            ],
            "itemStyle": { "color": "#00F0FF" },
            "type": "bar",
            "stack": "a",
            "name": "0-200"
        },
        {
            "data": [
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 60,
                    "itemStyle": { "borderRadius": [ 20, 20, 0, 0 ] },
                    "label": { "show": true, "position": "top", "formatter": "RM 113.10" }
                },
                {
                    "value": 50,
                    "itemStyle": { "borderRadius": [ 20, 20, 0, 0 ] },
                    "label": { "show": true, "position": "top", "formatter": "RM 108.75" }
                },
                {
                    "value": 100,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 80,
                    "itemStyle": { "borderRadius": [ 20, 20, 0, 0 ] },
                    "label": { "show": true, "position": "top", "formatter": "RM 56.55" }
                },
                {
                    "value": 40,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                }
            ],
            "itemStyle": { "color": "#AEFFDF" },
            "type": "bar",
            "stack": "a",
            "name": "201-500"
        },
        {
            "data": [
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 100,
                    "itemStyle": { "borderRadius": [ 20, 20, 0, 0 ] },
                    "label": { "show": true, "position": "top", "formatter": "RM 174.00" }
                },
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                },
                {
                    "value": 0,
                    "itemStyle": { "borderRadius": [ 0, 0, 0, 0 ] }
                }
            ],
            "itemStyle": { "color": "#FFF300" },
            "type": "bar",
            "stack": "a",
            "name": "501++"
        }
    ]
};
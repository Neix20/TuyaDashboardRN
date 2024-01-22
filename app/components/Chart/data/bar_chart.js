
// Price
price = {
    "Sep": "14.75",
    "Oct": "4.55",
    "Nov": "62.20",
    "Dec": "54.95",
    "Jan": "105.60",
    "Feb": "63.70"
}

// [x] Text On Top Of Each Bar
// [x] Total Sum Of Each Stack (Use javascript)
// [x] Change color of Stack

option = {
    xAxis: {
        type: "category",
        data: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
    },
    yAxis: { type: "value" },
    series: [
        {
            "data": [
                { "value": 50 },
                { "value": 10 },
                { "value": 200 },
                { "value": 200 },
                { "value": 200 },
                { "value": 200 }
            ],
            "label": {
                "show": true,
                "position": 'top'
            },
            "itemStyle": {
                "color": "#00F0FF",
                "borderRadius": [ 20, 20, 0, 0 ]
            },
            "type": "bar",
            "stack": "a",
            "name": "a"
        },
        {
            "data": [
                { "value": 0 },
                { "value": 0 },
                { "value": 60 },
                { "value": 50 },
                { "value": 100 },
                { "value": 80 }
            ],
            "itemStyle": {
                "color": "#AEFFDF",
                "borderRadius": [ 20, 20, 0, 0 ]
            },
            "type": "bar",
            "stack": "a",
            "name": "b"
        },
        {
            "data": [
                { "value": 0 },
                { "value": 0 },
                { "value": 0 },
                { "value": 0 },
                { "value": 100 },
                { "value": 0 }
            ],
            "itemStyle": {
                "color": "#F5D036",
                "borderRadius": [ 20, 20, 0, 0 ]
            },
            "type": "bar",
            "stack": "a",
            "name": "c"
        }
    ]
};

option = {
    animation: false,
    tooltip: {
        trigger: 'item',
        renderMode: "richText",
    },
    title: {
        text: name,
        left: 'center'
    },
    grid: {
        top: 0,
        bottom: 0,
        left: 5,
        right: 5,
    },
    color: ["rgba(255, 0, 0, 1)", "rgba(255, 0, 0, 0.25)"],
    series: [
        {
            "name": "Temp Humd",
            "type": "pie",
            "radius": [
                "80%",
                "60%"
            ],
            "label": {
                "show": true,
                "formatter": "4 / 9",
                "position": "center",
                "fontSize": 24,
                "fontWeight": "bold"
            },
            "data": [
                {
                    "name": "Active",
                    "value": 4
                },
                {
                    "name": "Inactive",
                    "value": 5
                }
            ]
        }
    ]
}
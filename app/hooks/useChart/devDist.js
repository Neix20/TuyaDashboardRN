import { useState, useEffect } from "react";

function genDataset(data = []) {
    // Input: [{ "Name": "Temp_Humd", "Active": 4, "Inactive": 5, "Total": 9, "Color": "rgba(255, 0, 0, 1)" }, { "Name": "Smart_Plug", "Active": 0, "Inactive": 1, "Total": 1, "Color": "rgba(0, 255, 0, 1)" }, { "Name": "Total", "Active": 4, "Inactive": 6, "Total": 10, "Color": "rgba(265, 165, 0, 1)" }]
    const res = [];

    for (const val of data) {
        let key = val["Name"];
        key = key.replace(/_/g, " ");

        const active = val["Active"];
        const inactive = val["Inactive"];
        const color = val["Color"];

        const total = active + inactive;

        let obj = [
            {
                name: key,
                type: "pie",
                radius: ["80%", "60%"],
                label: {
                    show: true,
                    formatter: `${active} / ${total}`,
                    position: "center",
                    fontSize: 24,
                    fontWeight: 'bold',
                },
                data: [
                    { name: 'Active', value: active },
                    { name: 'Inactive', value: inactive },
                ],
                tCol: color,
            }
        ]

        res.push(obj);
    }

    // Output: [[{ "name": "Temp Humd", "type": "pie", "radius": ["80%", "60%"], "label": { "show": true, "formatter": "4 / 9", "position": "center", "fontSize": 24, "fontWeight": "bold" }, "data": [{ "name": "Active", "value": 4 }, { "name": "Inactive", "value": 5 }], "tCol": "rgba(255, 0, 0, 1)" }], [{ "name": "Smart Plug", "type": "pie", "radius": ["80%", "60%"], "label": { "show": true, "formatter": "0 / 1", "position": "center", "fontSize": 24, "fontWeight": "bold" }, "data": [{ "name": "Active", "value": 0 }, { "name": "Inactive", "value": 1 }], "tCol": "rgba(0, 255, 0, 1)" }], [{ "name": "Total", "type": "pie", "radius": ["80%", "60%"], "label": { "show": true, "formatter": "4 / 10", "position": "center", "fontSize": 24, "fontWeight": "bold" }, "data": [{ "name": "Active", "value": 4 }, { "name": "Inactive", "value": 6 }], "tCol": "rgba(265, 165, 0, 1)" }]]
    return res;
}

function Index() {

    const [chart, setChart] = useState([]);

    const [chartLegend, setChartLegend] = useState([]);

    const updateChart = (data = []) => {

        const legend = data.map(x => x["Name"]);
        setChartLegend(_ => legend);

        const dataset = genDataset(data);

        const next_state = { dataset };
        setChart(_ => next_state);
    }
    return [chart, updateChart, chartLegend];
}

export default Index;
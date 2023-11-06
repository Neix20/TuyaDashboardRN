import { useState, useEffect } from "react";

function Index() {

    // [
    //     {
    //         "Name": "Temp_Humd",
    //         "Active": 3,
    //         "Inactive": 9,
    //         "Total": 12
    //     }
    // ]
    const [chart, setChart] = useState([]);

    // [
    //     [
    //         {
    //             name: "Temp-Humd",
    //             type: "pie",
    //         }
    //     ],
    //     [
    //         {
    //             name: "Smart-Plug",
    //             type: "pie",
    //         }
    //     ]
    // ]
    const [chartData, setChartData] = useState([]);

    const [chartLegend, setChartLegend] = useState([]);

    const chartKey = "";

    useEffect(() => {

        const legend = chart.map(x => x["Name"]);
        setChartLegend(_ => legend);

        let dataset = [];

        for (const ind in chart) {
            const val = chart[ind];

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

            dataset.push(obj);
        }

        const next_state = { dataset };
        setChartData(next_state);
    }, [chart]);

    return [chart, setChart, chartData, chartLegend, chartKey];
}

export default Index;
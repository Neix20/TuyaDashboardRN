import { useState, useEffect } from "react";

import { DateTime } from "luxon";

const genDataset = (data = {}) => {

    let res = [];
    const legends = Object.keys(data);

    if (legends.length > 0) {

        // [ '11-29', '05-22', '12-31', '04-20', '02-12' ]
        const label = data[legends[0]]
            .map(x => x["Timestamp"])
            .map(x => DateTime.fromISO(x).toFormat("MM-dd"));

        const keys = Object.keys(data[legends[0]][0])
            .filter(x => !["Device_Id", "Timestamp"].includes(x));

        const dataset = [];

        // Chart Key
        for (const _legend of legends) {

            const _data = data[_legend];

            const obj = {
                name: _legend
            }

            for (const _key of keys) {
                const val = _data.map(x => +x[_key]);

                if (val.length == 0) continue;
                obj[_key] = val;
            }

            dataset.push(obj)
        }

        res = [legends, keys, label, dataset];
    }

    return res;
}


function Index(default_key) {
    const [chart, setChart] = useState([]);

    const [chartDataset, setChartDataset] = useState([]);
    const [chartLegend, setChartLegend] = useState([]);

    const [chartKey, setChartKey] = useState(default_key);
    const [chartKeyOption, setChartKeyOption] = useState([]);

    const updateChart = (data = {}) => {
        const dataArr = genDataset(data);
        if (dataArr.length > 0) {
            const [legends, keys, label, dataset] = dataArr;
            setChartLegend(_ => legends);
            setChartKeyOption(_ => keys);
            setChartDataset(_ => dataset);

            const _dataset = dataset.map(x => ({ name: x.name, data: x[chartKey] }));

            const next_state = { label: label, dataset: _dataset };
            setChart(_ => next_state);
        }
    }

    const updateChartKey = (val) => {
        
        // Update Chart Key
        setChartKey(_ => val);
        
        const _dataset = chartDataset.map(x => ({ name: x.name, data: x[val] }));
        const next_state = {
            ...chart,
            dataset: _dataset
        }
        setChart(_ => next_state);
    }

    // Legend : [ "B8 Study LG Monitor Smart Plug", "B8 Study LG Monitor Smart Plug II" ]
    // Keys   : [ "Total Kilowatt (KWH)"]
    // Label  : [ "11-23", "11-24", "11-25", "11-26", "11-27", "11-28", "11-29" ]
    // Dataset: [ { "name": "B8 Study LG Monitor Smart Plug", "data": [ 0.3, 0.66, 0.84, 1.24, 0.46, 0, 1.01 ] }, { "name": "B8 Study LG Monitor Smart Plug II", "data": [ 0.97, 0.98, 0.2, 0.71, 0.75, 0.32, 0.97 ] } ]

    return [
        chart, updateChart,
        chartKey, updateChartKey,
        chart, () => { },
        chartLegend,
        chartKeyOption, setChartKeyOption,
    ];
}

export default Index;
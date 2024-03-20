import { useState, useEffect } from "react";

import { DateTime } from "luxon";

import { Svg } from "@config";

const genDataset = (data = {}) => {

    let res = [];
    const legends = Object.keys(data);

    const svg_key = Object.keys(Svg["MetaData_Header"]);

    if (legends.length > 0) {

        // [ "00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30" ]
        const label = data[legends[0]]
            .map(x => x["Timestamp"])
            .map(x => DateTime.fromISO(x).toFormat("T"));

        const ts = data[legends[0]]
            .map(x => x["Timestamp"])
            .map(x => DateTime.fromISO(x).toSeconds())
            .map(x => Math.floor(x * 1000));

        const keys = Object.keys(data[legends[0]][0])
            .filter(x => svg_key.includes(x));

        const dataset = [];

        // Chart Key
        for (const _legend of legends) {

            const _data = data[_legend];

            const obj = {
                name: _legend
            }

            for (const _key of keys) {
                let val = _data.map(x => +x[_key]);

                val = val.map((x, ind) => ({
                    value: [ts[ind], x]
                }));

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
        } else {
            setChart({})
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

    // Legend : [ "B8 Bedroom Smart IR 4", "B8 multi-function-timer-air monitor", "LF Piano LG aircon" ],
    // Keys   : [ "Absolute Humidity", "Temperature (℃)", "Relative Humidity (%)" ],
    // Label  : [ "00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45", "02:00", "02:15", "02:30", "02:45", "03:00", "03:15", "03:30", "03:45", "04:00", "04:15", "04:30", "04:45", "05:00", "05:15", "05:30", "05:45", "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45" ],
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
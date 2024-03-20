import { useState, useEffect } from "react";
import { DateTime } from "luxon";

import { Svg } from "@config";
const svg_key = Object.keys(Svg["MetaData_Header"]);

const genDataset = (data = []) => {

    let res = []

    if (data.length > 0 && svg_key.length > 0) {
        const obj = { ...data[0] };
        delete obj["Device_Id"];

        const label = data
            .map(x => x["Timestamp"])
            .map(x => DateTime.fromISO(x).toFormat("T"));

        const ts = data
            .map(x => x["Timestamp"])
            .map(x => DateTime.fromISO(x).toSeconds())
            .map(x => Math.floor(x * 1000));

        delete obj["Timestamp"];

        const keys = Object.keys(obj)
            .filter(x => svg_key.includes(x));

        const dataset = [];

        for (const key of keys) {
            let val = data.map(x => +x[key])

            if (val.length == 0) continue;

            val = val.map((x, ind) => ({
                value: [ts[ind], x]
            }));

            dataset.push({
                name: key,
                data: val
            });
        }

        res = [keys, label, dataset];
    }

    return res;
}

function Index(onSetLoading = () => {}) {

    const [chart, setChart] = useState([]);
    const [chartLegend, setChartLegend] = useState([]);

    const updateChart = (data = []) => {
        onSetLoading(true);
        const dataArr = genDataset(data);

        if (dataArr.length > 0) {
            const [keys, label, dataset] = dataArr;
            setChartLegend(_ => keys);

            const next_state = { 
                label: label, 
                dataset: dataset 
            };
            setChart(_ => next_state);
        } else {
            setChart([]);
        }

        onSetLoading(false);
    }

    return [chart, updateChart, chart, () => { }, chartLegend];
}

export default Index;
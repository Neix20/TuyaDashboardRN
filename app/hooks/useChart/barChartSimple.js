import { useState, useEffect } from "react";

import { DateTime } from "luxon";

const genDataset = (data = []) => {

    let res = []

    if (data.length > 0) {
        const obj = { ...data[0] };
        delete obj["Device_Id"];

        // [ '11-29', '05-22', '12-31', '04-20', '02-12' ]
        const label = data
            .map(x => x["Timestamp"])
            .map(x => DateTime.fromISO(x).toFormat("MM-dd"));

        delete obj["Timestamp"];
        const keys = Object.keys(obj);

        const dataset = [];

        for (const key of keys) {
            let val = data.map(x => +x[key]);

            if (val.length == 0) continue;

            dataset.push({
                name: key,
                data: val
            });
        }

        res = [keys, label, dataset];
    }

    return res;
}

function Index(onSetLoading = () => { }) {

    const [chart, setChart] = useState([]);
    const [chartLegend, setChartLegend] = useState([])

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
        }
        
        onSetLoading(false);
    }

    return [chart, updateChart, chart, () => { }, chartLegend];
}

export default Index;
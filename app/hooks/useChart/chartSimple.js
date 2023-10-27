import { useState, useEffect } from "react";

import { DateTime } from "luxon";

import { Svg } from "@config";

function Index() {

    const [chart, setChart] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartLegend, setChartLegend] = useState([]);

    const svg_key = Object.keys(Svg["MetaData_Header"]);

    useEffect(() => {
        if (chart.length > 1) {

            const obj = { ...chart[0] };

            delete obj["Device_Id"];

            let ts = chart.map(x => x["Timestamp"]);

            const label = ts.map(x => DateTime.fromISO(x).toFormat("T"));

            ts = ts.map(x => DateTime.fromISO(x).toSeconds());
            ts = ts.map(x => Math.floor(x * 1000));

            delete obj["Timestamp"];

            const keys = Object.keys(obj).filter(x => svg_key.includes(x));
            setChartLegend(keys);

            let dataset = [];

            for (const key of keys) {
                let val = chart.map(x => x[key]);
                val = val.map(x => +x);

                if (val.length == 0) continue;

                val = val.map((x, ind) => ({
                    value: [ts[ind], x]
                }));

                let obj = {
                    name: key,
                    data: val
                }

                dataset.push(obj);
            }

            setChartData(() => ({ label, dataset }));
        }
    }, [chart]);

    return [chart, setChart, chartData, setChartData, chartLegend];
}

export default Index;
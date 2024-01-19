import { useState, useEffect } from "react";

import { DateTime } from "luxon";

function Index(onSetLoading = () => {}) {

    const [chart, setChart] = useState([]);
    const [chartData, setChartData] = useState({});

    const [chartLegend, setChartLegend] = useState([])

    useEffect(() => {
        if (chart.length > 1) {

            onSetLoading(true);

            const obj = { ...chart[0] };
            delete obj["Device_Id"];

            let ts = chart.map(x => x["Timestamp"]);

            // [ '11-29', '05-22', '12-31', '04-20', '02-12' ]
            const label = ts.map(x => DateTime.fromISO(x).toFormat("MM-dd"));
            delete obj["Timestamp"];

            const keys = Object.keys(obj);
            setChartLegend(keys);

            let dataset = [];

            for (const key of keys) {
                let val = chart.map(x => x[key]);
                val = val.map(x => +x);

                if (val.length == 0) continue;

                let obj = {
                    name: key,
                    data: val
                }

                dataset.push(obj);
            }

            let dict = {
                label,
                dataset
            };

            setChartData(dict);

            onSetLoading(false);
        }
    }, [chart]);

    return [chart, setChart, chartData, setChartData, chartLegend];
}

export default Index;
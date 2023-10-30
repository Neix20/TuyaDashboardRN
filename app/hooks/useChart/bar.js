import { useState, useEffect } from "react";

import { DateTime } from "luxon";

function Index(default_key) {

    // #region UseState
    const [chart, setChart] = useState([]);
    const [chartII, setChartII] = useState({});

    const [chartData, setChartData] = useState({});

    const [chartLegend, setChartLegend] = useState([]);

    const [chartKey, setChartKey] = useState(default_key);
    const [chartKeyOption, setChartKeyOption] = useState([]);
    // #endregion

    // #region Helper
    const gen_device_log = (arr = []) => {

        const dataDict = {};

        for (const obj of arr) {

            delete obj["Device_Id"];

            // [
            //     {
            //         "Temperature": 1,
            //         "Humidity": 1
            //     },
            //     {
            //         "Temperature": 2,
            //         "Humidity": 2
            //     }
            // ]

            // {
            //     "Temperature": [1, 2, 3],
            //     "Humidity": [1, 2, 3]
            // }

            for (const o_key in obj) {
                const o_val = obj[o_key];

                if (o_key in dataDict) {
                    dataDict[o_key].push(o_val);
                }
                else {
                    dataDict[o_key] = [o_val];
                }
            }
        }

        return dataDict;
    }
    // #endregion

    useEffect(() => {

        let data_dict = {};

        for (const key in chart) {
            const val = chart[key];
            data_dict[key] = gen_device_log(val);
        }

        setChartII(_ => data_dict);

        let ck_arr = [];

        for (const key in chart) {

            if (chart[key].length <= 0) continue;

            const ck_obj = chart[key][0];

            for (const ck_key in ck_obj) {

                if (ck_key === "Timestamp") {
                    continue;
                }

                ck_arr.push(ck_key);
            }

            break;
        }

        setChartKeyOption(ck_arr);
    }, [chart]);

    useEffect(() => {

        let dataset = [];
        let label = [];

        for (const key in chartII) {
            const device_log = chartII[key];

            let val = [0];

            if (chartKey in device_log) {
                val = device_log[chartKey];
                val = val.map(x => +x);
            }

            label = device_log["Timestamp"].map(x => DateTime.fromISO(x).toFormat("yyyy-MM-dd"));

            val = val.map(x => +x);

            if (val.length == 0) continue;

            let obj = {
                name: key,
                data: val
            }

            dataset.push(obj);
        }

        console.log(JSON.stringify(dataset))

        setChartData(() => ({ label, dataset }));

        const legend = Object.keys(chartII);
        setChartLegend(() => legend);
    }, [chartKey, chartII]);

    return [
        chart, setChart,
        chartKey, setChartKey,
        chartData, setChartData,
        chartLegend,
        chartKeyOption, setChartKeyOption
    ];
}

export default Index;
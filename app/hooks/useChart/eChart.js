import { useState, useEffect } from "react";

import { DateTime } from "luxon";

function Index(default_key) {

    const init = {
        chartData: {
            dataset: [0],
            min: 0,
            max: 0,
        }
    }

    // #region Use State
    const [chart, setChart] = useState({});
    const [chartKey, setChartKey] = useState(default_key);

    const [chartII, setChartII] = useState({});

    const [chartData, setChartData] = useState(init.chartData);
    const [chartLegend, setChartLegend] = useState([]);
    const [chartKeyOption, setChartKeyOption] = useState([]);
    // #endregion

    // #region Helper
    const gen_device_log = (arr = []) => {

        const dataDict = {};

        for (const obj of arr) {

            delete obj["Device_Id"];

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
            // DCH-CRYS
            const val = chart[key];
            data_dict[key] = gen_device_log(val);
        }

        setChartII(data_dict);

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

    // Generate Dataset and Legend
    // This is Based on Which Chart Key is Selected
    // TODO: Change This Shit
    useEffect(() => {
        let dataset = [];
        let label = [];

        let ts = [];

        let min_val = Number.MAX_VALUE;
        let max_val = Number.MIN_VALUE;

        let min_dt = DateTime.now().toSeconds();
        let max_dt = DateTime.fromFormat("2021-01-01", "yyyy-MM-dd").toSeconds();

        min_dt = Math.floor(min_dt * 1000);
        max_dt = Math.floor(max_dt * 1000);

        let ind = 0;
        for (const key in chartII) {
            const device_log = chartII[key];

            let val = [0];

            if (chartKey in device_log) {
                val = device_log[chartKey];
                val = val.map(x => +x);
            }

            // Get Min, Max value
            min_val = Math.min(...val, min_val);
            max_val = Math.max(...val, max_val);

            if ("Timestamp" in device_log) {
                ts = device_log["Timestamp"];
                label = [...ts];

                ts = ts.map(x => DateTime.fromISO(x).toSeconds());
                ts = ts.map(x => Math.floor(x * 1000));

                min_dt = Math.min(...ts, min_dt);
                max_dt = Math.max(...ts, max_dt);
            }

            label = label.map(x => DateTime.fromISO(x).toFormat("T"))

            val = val.map((x, ind) => ({
                value: [ts[ind], x]
            }));

            let obj = {
                name: key,
                data: val
            }

            dataset.push(obj);

            ind += 1;
        }

        setChartData(() => ({ label, dataset, min: min_val, max: max_val, min_dt, max_dt }));

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
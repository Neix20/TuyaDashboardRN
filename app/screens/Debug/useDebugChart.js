import { useState, useEffect } from "react";

import { DateTime } from "luxon";

function Index(default_key) {

    const init = {
        colors: [
            "#DB7D86", "#E7E005", "#188B9A",
            "#DB2E54", "#A53202", "#82EB20",
            "#75368B", "#395DAD", "#EC259F",
            "#0FA1AF", "#ADAC72", "#7FD106",
            "#6AC237", "#C5F022", "#76862A"
        ],
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

    const genDefArr = (start_num = 0, end_num = 0, data_point = 12) => {

        start_num = start_num * 60;
        end_num = end_num * 60;
    
        let arr = [];
    
        let step = 60 / data_point; 
    
        for(let ind = start_num; ind < end_num; ind += step) {
            arr.push(null);
        }
    
        return arr;
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
    useEffect(() => {
        let dataset = [];
        let label = [];

        let min_val = Number.MAX_VALUE;
        let max_val = Number.MIN_VALUE;

        let min_dt = "2021-01-01";
        let max_dt = DateTime.now().toFormat("yyyy-MM-dd");

        let ind = 0;
        for (const key in chartII) {
            const device_log = chartII[key];

            let val = [0];

            if (chartKey in device_log) {
                val = device_log[chartKey];
                val = val.map(x => +x);
            }

            if ("Timestamp" in device_log) {
                let arr = device_log["Timestamp"];

                if (arr.length > 0) {
                    min_dt = arr[0];
                    max_dt = arr.at(-1);

                    // Get Start Dt
                    const s_hr = DateTime.fromISO(min_dt).hour;

                    let s_arr = genDefArr(0, s_hr);
            
                    // Get End Dt
                    const e_hr = DateTime.fromISO(max_dt).hour;

                    let e_arr = genDefArr(e_hr, 23);

                    val = [...s_arr, ...val, ...e_arr]
                }

                label = arr.map(x => DateTime.fromISO(x).toFormat("hh:mma"));
                
            }

            // Get Min, Max value
            min_val = Math.min(...val, min_val);
            max_val = Math.max(...val, max_val);

            let obj = {
                name: key,
                type: "line",
                data: val
            }

            dataset.push(obj);

            ind += 1;
        }

        setChartData(() => ({ label, dataset, min: min_val, max: max_val }));

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
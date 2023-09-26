import React, { useState, useEffect } from "react";

function Index(default_key = "") {

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
            delete obj["Timestamp"];

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
        if (Object.keys(chart).length > 0) {
            let data_dict = {};

            for (const key in chart) {
                // DCH-CRYS
                const val = chart[key];

                data_dict[key] = gen_device_log(val);
            }

            setChartII(data_dict);

            let ck_arr = [];

            for (const key in chart) {
                const ck_obj = chart[key][0];

                for (const ck_key in ck_obj) {
                    ck_arr.push(ck_key);
                }

                break;
            }

            setChartKeyOption(ck_arr);
        }
    }, [chart]);

    // Generate Dataset and Legend
    // This is Based on Which Chart Key is Selected
    useEffect(() => {
        if (chartKey.length > 0 && Object.keys(chartII).length > 0) {
            let dataset = [];
            let legend = [];

            let min_val = Number.MAX_VALUE;
            let max_val = Number.MIN_VALUE;

            let ind = 0;
            for (const key in chartII) {
                const device_log = chartII[key];
                const color = init.colors[ind];

                let val = [0];

                if (chartKey in device_log) {
                    val = device_log[chartKey];
                    val = val.map(x => +x);
                }

                // Get Min, Max value
                min_val = Math.min(...val, min_val);
                max_val = Math.max(...val, max_val);

                let obj = {
                    data: val,
                    svg: { stroke: color },
                    strokeWidth: 2,
                }

                dataset.push(obj);

                let legendObj = {
                    name: key,
                    flag: true,
                    color,
                }

                legend.push(legendObj);

                ind += 1;
            }

            setChartData(() => ({ dataset, min: min_val, max: max_val }))
            setChartLegend(() => legend);
        }
    }, [chartKey, chartII]);

    useEffect(() => {
        if (chartKey.length > 0 && Object.keys(chartII).length > 0 && chartLegend.length > 0) {
            let leg = [...chartLegend];
            let dst = [];

            let min_val = Number.MAX_VALUE;
            let max_val = Number.MIN_VALUE;

            let ind = 0;
            for (const device_name in chartII) {
                if (leg[ind] != null && leg[ind].flag) {
                    const device_log = chartII[device_name];
                    const color = init.colors[ind];

                    let val = [0];

                    if (chartKey in device_log) {
                        val = device_log[chartKey];
                        val = val.map(x => +x);
                    }

                    // Get Min, Max value
                    min_val = Math.min(...val, min_val);
                    max_val = Math.max(...val, max_val);

                    let obj = {
                        data: val,
                        svg: { stroke: color },
                        strokeWidth: 2,
                    }

                    dst.push(obj);
                }
                ind += 1;
            }

            setChartData(() => ({ dataset: dst, min: min_val, max: max_val }))
        }

    }, [JSON.stringify(chartLegend.map(x => x.flag)), chartII, chartKey]);

    return [
        chart, setChart,
        chartKey, setChartKey,
        chartData, setChartData,
        chartLegend, setChartLegend,
        chartKeyOption, setChartKeyOption
    ];
}

export default Index;
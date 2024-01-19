import { useState, useEffect } from "react";

import { DateTime } from "luxon";

import { Svg } from "@config";

import { Utility } from "@utility";

function Index(default_key) {

    const init = {
        chartData: {
            dataset: [0]
        }
    }

    const svg_key = Object.keys(Svg["MetaData_Header"]);

    // #region Use State
    const [chart, setChart] = useState({});
    const [chartII, setChartII] = useState({});
    
    const [chartKey, setChartKey] = useState(default_key);
    const [chartData, setChartData] = useState(init.chartData);

    const [chartLegend, setChartLegend] = useState([]);
    const [chartKeyOption, setChartKeyOption] = useState([]);
    // #endregion

    // #region Helper
    const gen_device_log = (arr = []) => {

        // Input:  [ { "Temperature": 1, "Humidity": 1 }, { "Temperature": 2, "Humidity": 2 } ]
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

        // Output: { "Temperature": [ 1, 2, 3 ], "Humidity": [ 1, 2, 3 ] }
        return dataDict;
    }
    // #endregion

    useEffect(() => {

        // Input:  { "B8 Bedroom Smart IR 4": [ { "Timestamp": "2023-11-29T00:00:00", "Device_Id": 416, "Absolute Humidity": "18.87", "Temperature (℃)": "28.9", "Relative Humidity (%)": "66" } ], "B8 multi-function-timer-air monitor": [ { "Timestamp": "2023-11-29T00:00:00", "Device_Id": 414, "tvoc": "44", "air_quality": "good", "Particle Matter (ug/m3)": "51", "Carbon Dioxide (ppm)": "537", "Absolute Humidity": "15.7", "Temperature (℃)": "31", "Relative Humidity (%)": "49", "Formaldehyde (mg/m3)": "19" } ], "LF Piano LG aircon": [ { "Timestamp": "2023-11-29T00:00:00", "Device_Id": 430, "Absolute Humidity": "19.01", "Temperature (℃)": "29.6", "Relative Humidity (%)": "64" } ] }
        let data_dict = {};

        for (const key in chart) {
            // "B8 Bedroom Smart IR 4"
            const val = chart[key];
            data_dict[key] = gen_device_log(val);
        }

        // Output: { "B8 Bedroom Smart IR 4": { "Temperature": [ 1, 2, 3 ], "Humidity": [ 1, 2, 3 ] } }
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

        ck_arr = ck_arr.filter(x => svg_key.includes(x));
        // [ "Temperature", "Humidity" ]
        setChartKeyOption(ck_arr);
    }, [chart]);

    // Generate Dataset and Legend
    // This is Based on Which Chart Key is Selected
    // TODO: Change This Shit
    useEffect(() => {
        
        const unit = Utility.genUnit(chartKey);

        let dataset = [];
        let label = [];

        let ts = [];

        for (const key in chartII) {
            const device_log = chartII[key];

            let val = [0];

            // Chart Key: "Temperature"
            if (chartKey in device_log) {
                val = device_log[chartKey];
                val = val.map(x => +x);
            }

            if ("Timestamp" in device_log) {
                ts = device_log["Timestamp"];

                ts = ts.map(x => DateTime.fromISO(x).toSeconds());
                ts = ts.map(x => Math.floor(x * 1000));
            }

            label = device_log["Timestamp"].map(x => DateTime.fromISO(x).toFormat("T"))

            val = val.map((x, ind) => ({
                value: [ts[ind], x]
            }));

            let obj = {
                name: key,
                data: val
            }

            // Output: [{ "name": "Temperature", "data": [ [1701255600000, 5], [1701257400000, 5], [1701259200000, 7], [1701261000000, 6], [1701262800000, 5] ] }]
            dataset.push(obj);
        }
        setChartData(() => ({ label, dataset }));

        // [ "B8 Bedroom Smart IR 4", "B8 multi-function-timer-air monitor", "LF Piano LG aircon" ]
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
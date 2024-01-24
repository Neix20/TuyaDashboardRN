
let series = [
    {
        "data": [50, 10, 200, 200, 200, 200],
        "itemStyle": {
            "color": "#00F0FF"
        },
        "type": "bar",
        "stack": "a",
        "name": "a"
    },
    {
        "data": [0, 0, 60, 50, 100, 80],
        "itemStyle": {
            "color": "#AEFFDF"
        },
        "type": "bar",
        "stack": "a",
        "name": "b"
    },
    {
        "data": [0, 0, 0, 0, 100, 0],
        "itemStyle": {
            "color": "#FFF300"
        },
        "type": "bar",
        "stack": "a",
        "name": "c"
    }
];

const rate = {
    residential: 21.8,
    commercial: 43.5,
    industrial: 38
}

const m_rate = rate.commercial;

function getStackInfo(arr = []) {

    const stackInfo = {};

    for (const stackSeries of arr) {
        let { stack = "", data = [] } = stackSeries;

        data = data.map(x => x === "-" ? 0 : x);

        if (stack in stackInfo) {
            stackInfo[stack].push(data);
        }
        else {
            stackInfo[stack] = [data];
        }
    }

    // Output: { "a": [ [ 142, 97, 43, 70, 127 ], [ 21, 0, 26, 168, 0 ], [ 0, 0, 59, 0, 0 ] ], "b": [ [ 142, 97, 43, 70, 127 ], [ 21, 12, 26, 168, 57 ] ] }
    // Get Furthermost of Each Stack Info
    for (const stack in stackInfo) {

        // Input
        const data = stackInfo[stack];

        // Assume Best Case
        let info_arr = data[0].map(x => data.length - 1);

        for (let col_ind = 0; col_ind < data[0].length; col_ind += 1) {
            for (let row_ind = 0; row_ind < data.length; row_ind += 1) {
                if (data[row_ind][col_ind] === 0) {
                    info_arr[col_ind] = row_ind - 1;
                    break;
                }
            }
        }
        // Output: [ 0, 0, 1, 1, 2, 1 ]
        // data[0].length

        // Output: [ 14.75, 4.55, 62.20, 54.95, 105.60, 63.70 ]
        // data[0].length
        const ts_arr = data[0].map(x => "");

        for (let col_ind = 0; col_ind < data[0].length; col_ind += 1) {
            let total = 0;
            for (let row_ind = 0; row_ind < data.length; row_ind += 1) {
                total += data[row_ind][col_ind];
            }
            total = total * m_rate / 100;
            
            ts_arr[col_ind] = `RM ${total.toFixed(2)}`;
        }

        const borderRadius = 20;

        for (let ind = 0; ind < data.length; ind += 1) {
            data[ind] = data[ind].map((value, pos) => {

                if (info_arr[pos] === ind) {

                    return {
                        value, 
                        itemStyle: { borderRadius: [borderRadius, borderRadius, 0, 0] },
                        label: { show: true, position: "top", formatter: ts_arr[pos] },
                        
                    };
                }

                return { 
                    value, 
                    itemStyle: { borderRadius: [0, 0, 0, 0] } 
                };
            })
        }

        stackInfo[stack] = data;
    }

    // Sort By Stack
    const res = arr.sort((objA, objB) => objA.stack - objB.stack);
    let stackInd = 0;

    for (let ind = 0; ind < res.length; ind += 1) {
        if (ind > 0 && res[ind].stack !== res[ind - 1].stack) {
            stackInd = 0;
        }

        res[ind]["data"] = stackInfo[res[ind].stack][stackInd];
        stackInd += 1;
    }

    return res;
}

// Price
price = {
    "Sep": 14.75,
    "Oct": 4.55,
    "Nov": 62.20,
    "Dec": 54.95,
    "Jan": 105.60,
    "Feb": 63.70,
}

// Return Total
series = getStackInfo(series);
option = {
    xAxis: {
        type: "category",
        data: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
    },
    yAxis: { type: "value" },
    series
};
console.log(`option = ${JSON.stringify(option, null, 4)}`);
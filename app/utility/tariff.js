function tariffHelper(data) {

    // Output: Expect Array of 7 elements
    // [ 249, 363, 480, 663, 240, 123, 561 ]
    const total_kwh = [];

    // Step 1. Sum Up the data in input
    for (let col = 0; col < data[0]["data"].length; col += 1) {
        let total = 0;

        for (const elem of data) {
            total += elem["data"][col];
        }

        // Step 1.2: Multiple by 100
        total = total * 100;

        total_kwh.push(total);
    }

    const res = categorizeData(total_kwh);
    return res;
}

function categorizeData(input) {

    let output = [];

    const genArr = (arr, a_val, b_val) => {
        const data = []
        for (const value of arr) {
            let res = Math.min(value - a_val, b_val);
            res = Math.max(res, 0);
            res = Math.floor(res);
            data.push(res);
        }
        return data;
    }

    // 0-200
    output.push({
        name: "0-200",
        itemStyle: {
            color: "#00F0FF"
        },
        data: genArr(input, 0, 200)
    });

    output.push({
        name: "201-500",
        itemStyle: {
            color: "#AEFFDF"
        },
        data: genArr(input, 200, 300)
    });

    output.push({
        name: "501++",
        itemStyle: {
            color: "#FFF300"
        },
        data: genArr(input, 500, 99999)
    });

    output = output.map(x => ({
        ...x,
        stack: "a",
        type: "bar"
    }))

    // Output: [ { name: '0-200', data: [ 200, 200, 200, 200, 200, 123, 200 ] }, { name: '201-500', data: [ 49, 163, 280, 300, 40,   0, 300 ] }, { name: '501++', data: [ 0, 0,  0, 163, 0, 0, 61 ] } ]
    return output;
}

function organizeStackData(arr) {
    const stackInfo = {};
    for (const stackSeries of arr) {
        let { stack = "", data = [] } = stackSeries;

        // Convert "-" to 0
        data = data.map(x => x === "-" ? 0 : x);

        // Group data by stack
        if (stack in stackInfo) {
            stackInfo[stack].push(data);
        } else {
            stackInfo[stack] = [data];
        }
    }
    return stackInfo;
}

function calculateFurthermostPoints(data = []) {

    const furthermostPoints = data[0].map(() => data.length - 1);

    for (let colIndex = 0; colIndex < furthermostPoints.length; colIndex += 1) {
        for (let rowIndex = 0; rowIndex < data.length; rowIndex += 1) {
            if (data[rowIndex][colIndex] === 0) {
                furthermostPoints[colIndex] = rowIndex - 1;
                break;
            }
        }
    }

    return furthermostPoints;
}

function calculateTotalSumArray(data, m_rate) {
    // Sample Input: [[200, 10, 0], [200, 10, 10], [100, 200, 20]]
    const totalSumArray = data[0].map(() => "");
    for (let colIndex = 0; colIndex < totalSumArray.length; colIndex += 1) {
        let total = data
            .map(x => x[colIndex])
            .reduce((a, b) => a + b, 0);
        total = total * m_rate / 100;
        totalSumArray[colIndex] = `RM ${total.toFixed(2)}`;
    }
    return totalSumArray;
}

function formatDataPoints(data, furthermostPoints, totalSumArray, borderRadius = 20, label = false) {
    const res = [...data];

    for (let rowIndex = 0; rowIndex < res.length; rowIndex += 1) {
        res[rowIndex] = res[rowIndex].map((value, pos) => {
            if (furthermostPoints[pos] === rowIndex) {
                const res = {
                    value,
                    itemStyle: { borderRadius: [borderRadius, borderRadius, 0, 0] }
                };
                
                if (label) {
                    res["label"] = { show: true, position: "top", formatter: totalSumArray[pos] };
                }
                return res;
            }
            return {
                value,
                itemStyle: { borderRadius: [0, 0, 0, 0] }
            };
        });
    }

    return res;
}

function assignFormattedData(arr, stackInfo) {

    // Sort the result array by stack
    const sortedArr = arr.sort((objA, objB) => objA.stack - objB.stack);

    // Assign formatted data to original objects
    let stackIndex = 0;
    let previousStack = null;

    for (const entry of sortedArr) {
        if (entry.stack !== previousStack) {
            stackIndex = 0;
            previousStack = entry.stack;
        }
        entry.data = stackInfo[entry.stack][stackIndex];
        stackIndex += 1;
    }

    return sortedArr;
}


function ConvertNormalToTariff(arr, m_rate) {

    arr = tariffHelper(arr);

    // Step 2: Organize stack data
    const stackInfo = organizeStackData(arr);

    for (const stack in stackInfo) {

        const data = stackInfo[stack];

        // Step 3.1: Calculate furthermost points for each stack
        const furthermostPoints = calculateFurthermostPoints(data);

        // Step 3.2: Calculate total and format as required
        const totalSumArray = calculateTotalSumArray(data, m_rate);

        // Step 3.3: Apply formatting to each data point
        const borderRadius = 20;

        stackInfo[stack] = formatDataPoints(data, furthermostPoints, totalSumArray, borderRadius, true);
    }

    // Step 4: Assign formatted data to original objects
    const sortedArr = assignFormattedData(arr, stackInfo);

    return sortedArr;
}

export {
    ConvertNormalToTariff
}
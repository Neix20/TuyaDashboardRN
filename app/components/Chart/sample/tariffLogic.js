
let series = [
    {
        "data": [50, 10, 200, 200, 200, 50],
        "itemStyle": {
            "color": "#00F0FF"
        },
        "type": "bar",
        "stack": "a",
        "name": "0-200"
    },
    {
        "data": [0, 0, 60, 50, 100, 80],
        "itemStyle": {
            "color": "#AEFFDF"
        },
        "type": "bar",
        "stack": "a",
        "name": "201-500"
    },
    {
        "data": [0, 0, 0, 0, 100, 0],
        "itemStyle": {
            "color": "#FFF300"
        },
        "type": "bar",
        "stack": "a",
        "name": "501++"
    }
];

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

function formatDataPoints(data, furthermostPoints, totalSumArray, borderRadius = 20) {
    const res = [...data];

    for (let rowIndex = 0; rowIndex < res.length; rowIndex += 1) {
        res[rowIndex] = res[rowIndex].map((value, pos) => {
            if (furthermostPoints[pos] === rowIndex) {
                return {
                    value,
                    itemStyle: { borderRadius: [borderRadius, borderRadius, 0, 0] },
                    label: { show: true, position: "top", formatter: totalSumArray[pos] }
                };
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


function getStackInfo(arr, m_rate) {

    // Step 1: Organize stack data
    const stackInfo = organizeStackData(arr);

    for (const stack in stackInfo) {

        const data = stackInfo[stack];

        // Step 2.1: Calculate furthermost points for each stack
        const furthermostPoints = calculateFurthermostPoints(data);

        // Step 2.2: Calculate total and format as required
        const totalSumArray = calculateTotalSumArray(data, m_rate);

        // Step 2.3: Apply formatting to each data point
        const borderRadius = 20;

        stackInfo[stack] = formatDataPoints(data, furthermostPoints, totalSumArray, borderRadius);
    }

    // Step 3: Assign formatted data to original objects
    const sortedArr = assignFormattedData(arr, stackInfo);

    return sortedArr;
}

// Price
const price = {
    "Sep": 14.75,
    "Oct": 4.55,
    "Nov": 62.20,
    "Dec": 54.95,
    "Jan": 105.60,
    "Feb": 63.70,
}

const rate = {
    residential: 21.8,
    commercial: 43.5,
    industrial: 38
}

const m_rate = rate.commercial;

// Return Tota
series = getStackInfo(series, m_rate);
const option = {
    xAxis: {
        type: "category",
        data: ["01-18", "01-19", "01-20", "01-21", "01-22", "01-23", "01-24"]
    },
    yAxis: { type: "value" },
    series
};
console.log(`option = ${JSON.stringify(option, null, 4)}`);
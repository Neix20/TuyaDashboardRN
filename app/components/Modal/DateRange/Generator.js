function dateArrGen(dt) {
    let arr = [];
    let obj = {};

    const ytdDt = dt.plus({days: -1});

    obj = {
        title: "Yesterday",
        description: ytdDt.toFormat("EEEE, d MMMM"),
        startDt: ytdDt.toFormat("yyyy-MM-dd"),
        endDt: ytdDt.toFormat("yyyy-MM-dd"),
        flag: false,
    };
    arr.push(obj);

    obj = {
        title: "Today",
        description: dt.toFormat("EEEE, d MMMM"),
        startDt: dt.toFormat("yyyy-MM-dd"),
        endDt: dt.toFormat("yyyy-MM-dd"),
        flag: false,
    };
    arr.push(obj);

    return arr;
}

function weekArrGen(dt) {
    let arr = [];
    let obj = {};

    const sDt = dt.plus({days: -7});

    // Last 7 Days
    obj = {
        title: "Last 7 Days",
        description: `${sDt.toFormat("d MMM")} - ${dt.toFormat("d MMM")}`,
        startDt: sDt.toFormat("yyyy-MM-dd"),
        endDt: dt.toFormat("yyyy-MM-dd"),
        flag: false,
    }
    arr.push(obj);

    // This Week

    let stWeekDt = dt.startOf("week");
    let eWeekDt = dt.endOf("week");

    obj = {
        title: "This Week",
        description: `${stWeekDt.toFormat("d MMM")} - ${eWeekDt.toFormat("d MMM")}`,
        startDt: stWeekDt.toFormat("yyyy-MM-dd"),
        endDt: eWeekDt.toFormat("yyyy-MM-dd"),
        flag: false
    }
    arr.push(obj);

    // Last Week
    stWeekDt = dt.plus({weeks: -1}).startOf("week");
    eWeekDt = dt.plus({weeks: -1}).endOf("week");

    obj = {
        title: "Last Week",
        description: `${stWeekDt.toFormat("d MMM")} - ${eWeekDt.toFormat("d MMM")}`,
        startDt: stWeekDt.toFormat("yyyy-MM-dd"),
        endDt: eWeekDt.toFormat("yyyy-MM-dd"),
        flag: false
    }
    arr.push(obj);

    return arr;
}

function monthArrGen(dt) {
    let arr = [];
    let obj = {};

    const sDt = dt.plus({days: -30});

    // Last 30 Days
    obj = {
        title: "Last 30 Days",
        description: `${sDt.toFormat("d MMM")} - ${dt.toFormat("d MMM")}`,
        startDt: sDt.toFormat("yyyy-MM-dd"),
        endDt: dt.toFormat("yyyy-MM-dd"),
        flag: false,
    }
    arr.push(obj);

    // This Month
    let stMonthDt = dt.startOf("month");
    let eMonthDt = dt.endOf("month");

    obj = {
        title: "This Month",
        description: stMonthDt.toFormat("MMMM"),
        startDt: stMonthDt.toFormat("yyyy-MM-dd"),
        endDt: eMonthDt.toFormat("yyyy-MM-dd"),
        flag: false
    }
    arr.push(obj);

    // Last Month
    stMonthDt = dt.plus({months: -1}).startOf("month");
    eMonthDt = dt.plus({months: -1}).endOf("month");

    obj = {
        title: "Last Month",
        description: stMonthDt.toFormat("MMMM"),
        startDt: stMonthDt.toFormat("yyyy-MM-dd"),
        endDt: eMonthDt.toFormat("yyyy-MM-dd"),
        flag: false
    }
    arr.push(obj);

    return arr;
}

function customArrGen(dt) {
    let arr = [];

    const ytdDt = dt.plus({days: -1});

    const ytdObj = {
        title: "Start Date",
        description: ytdDt.toFormat("EEEE, d MMMM"),
        startDt: ytdDt.toFormat("yyyy-MM-dd"),
        endDt: ytdDt.toFormat("yyyy-MM-dd"),
        flag: false,
    };

    arr.push(ytdObj);

    const tdObj = {
        title: "End Date",
        description: dt.toFormat("EEEE, d MMMM"),
        startDt: dt.toFormat("yyyy-MM-dd"),
        endDt: dt.toFormat("yyyy-MM-dd"),
        flag: false,
    };

    arr.push(tdObj);

    return arr;
}

export {
    dateArrGen,
    weekArrGen,
    monthArrGen,
    customArrGen
}
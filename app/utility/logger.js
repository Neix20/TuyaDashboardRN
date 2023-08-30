import { genLogUrl } from "./utility";

// #region API
const fetchInfoLogData = async (param) => {
    const action = "InfoLog";
    const url = genLogUrl(action);

    const { fileName = "" } = param;

    // Static Data
    let obj = {
        content: {
            ...param,
            app: "Buah Cinta",
        },
        fileName: fileName,
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    const data = await resp.json();

    if (data["ResponseCode"] === "00") {
        console.log("Info Logging!");
    }

    return data;
};

const fetchErrorLogData = async (param) => {
    const action = "ErrorLog";
    const url = genLogUrl(action);

    const { fileName = "" } = param;

    // Static Data
    let obj = {
        content: {
            ...param,
            app: "Buah Cinta",
        },
        fileName: fileName,
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    const data = await resp.json();

    if (data["ResponseCode"] === "00") {
        console.log("Error Logging!");
    }

    return data;
};
// #endregion

class Log {
    info(param) {
        const obj = JSON.stringify({
            ...param,
            app: "Buah Cinta",
        });

        console.log(obj);

        fetchInfoLogData(param)
        .then(res => {
            console.log(res);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
    }

    error(param) {
        const obj = JSON.stringify({
            ...param,
            app: "Buah Cinta",
        });

        console.log(obj);

        fetchErrorLogData(param)
        .then(res => {
            console.log(res);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
        });
    }
}

module.exports = new Log();